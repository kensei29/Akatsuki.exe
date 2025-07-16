import asyncio
import logging
from typing import Optional, Dict, Any, List, TypedDict, Annotated
from enum import Enum
import os

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

from pydantic import BaseModel, Field

# Import Gemini utility
from ..utils.gemini_chat import create_response_gemini_chat

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ResponseType(str, Enum):
    PROBLEM_INTRODUCTION = "problem_introduction"
    HINT_PROVISION = "hint_provision"
    CODE_REVIEW = "code_review"
    ENCOURAGEMENT = "encouragement"


class InterviewResponse(BaseModel):
    content: str = Field(..., description="The main response content")
    response_type: ResponseType = Field(..., description="Type of response")
    confidence_score: float = Field(default=0.8, ge=0.0, le=1.0)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class InterviewState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    problem_data: Optional[Dict[str, Any]]
    context: Optional[str]
    response_type_needed: Optional[ResponseType]
    current_response: Optional[InterviewResponse]


class ResponseGeneratorConfig(BaseModel):
    # Remove api_key and model_name since LLM will be provided externally
    temperature: float = 0.2
    max_tokens: int = 10000


class TechnicalInterviewerResponseGenerator:
    def __init__(self, llm, config: Optional[ResponseGeneratorConfig] = None):
        self.llm = llm
        self.config = config or ResponseGeneratorConfig()
        self.output_parser = self._setup_output_parser()
        self.graph = self._build_graph()

    def _setup_output_parser(self) -> PydanticOutputParser:
        return PydanticOutputParser(pydantic_object=InterviewResponse)

    def _create_system_prompts(self) -> Dict[str, str]:
        return {
            "problem_introduction": "You are a friendly technical interviewer. Present the DSA problem clearly and ask if they have any questions.",
            "hint_provision": "You are a supportive technical interviewer. Provide helpful hints without giving away the complete solution.",
            "code_review": "You are a technical interviewer reviewing code. Provide constructive feedback on correctness and efficiency.",
            "encouragement": "You are a supportive technical interviewer. Keep the candidate motivated and guide them through challenges."
        }

    async def _generate_response_node(self, state: InterviewState) -> InterviewState:
        try:
            response_type = state.get(
                "response_type_needed") or ResponseType.ENCOURAGEMENT
            system_prompts = self._create_system_prompts()
            system_prompt = system_prompts.get(
                response_type.value, system_prompts["encouragement"])

            prompt_template = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "{context}\n\n{user_message}\n\n{format_instructions}")
            ])

            context = state.get("context") or ""
            problem_data = state.get("problem_data") or {}

            if problem_data:
                context += f"\nProblem: {problem_data.get('title', 'Unknown')}\nDescription: {problem_data.get('description', 'N/A')}"

            messages = state.get("messages", [])
            user_message = ""
            if messages:
                last_message = messages[-1]
                if isinstance(last_message, HumanMessage):
                    user_message = last_message.content

            chain = prompt_template | self.llm | self.output_parser

            response = await chain.ainvoke({
                "context": context,
                "user_message": user_message,
                "format_instructions": self.output_parser.get_format_instructions()
            })

            state["current_response"] = response
            state["messages"] = state.get(
                "messages", []) + [AIMessage(content=response.content)]

            return state

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")

            fallback_response = InterviewResponse(
                content="I apologize, but I'm experiencing some technical difficulties. Could you please repeat your question?",
                response_type=ResponseType.ENCOURAGEMENT,
                confidence_score=0.3,
                metadata={"error": str(e)}
            )

            state["current_response"] = fallback_response
            state["messages"] = state.get(
                "messages", []) + [AIMessage(content=fallback_response.content)]

            return state

    def _build_graph(self):
        workflow = StateGraph(InterviewState)
        workflow.add_node("generate_response", self._generate_response_node)

        workflow.add_edge(START, "generate_response")
        workflow.add_edge("generate_response", END)

        memory = MemorySaver()
        complied_workflow = workflow.compile(checkpointer=memory)

        # # store compiled graph image in current directory
        # bytes = complied_workflow.get_graph().draw_mermaid_png()
        # with open("response_generator_graph.png", "wb") as f:
        #     f.write(bytes)

        return complied_workflow

    async def generate_response(
        self,
        user_message: str,
        response_type: ResponseType = ResponseType.ENCOURAGEMENT,
        context: Optional[str] = None,
        problem_data: Optional[Dict[str, Any]] = None,
        conversation_id: str = "default"
    ) -> InterviewResponse:
        initial_state: InterviewState = {
            "messages": [HumanMessage(content=user_message)],
            "problem_data": problem_data,
            "context": context,
            "response_type_needed": response_type,
            "current_response": None
        }

        config = RunnableConfig(configurable={"thread_id": conversation_id})
        result = await self.graph.ainvoke(initial_state, config=config)
        return result["current_response"]

    async def generate_problem_introduction(self, problem_data: Dict[str, Any]) -> InterviewResponse:
        return await self.generate_response(
            user_message="Please introduce this DSA problem",
            response_type=ResponseType.PROBLEM_INTRODUCTION,
            problem_data=problem_data
        )

    async def generate_hint(self, context: str, hint_level: str = "gentle") -> InterviewResponse:
        return await self.generate_response(
            user_message="I need a hint",
            response_type=ResponseType.HINT_PROVISION,
            context=f"Context: {context}. Provide a {hint_level} hint."
        )

    async def generate_code_review(self, code: str, problem_context: str) -> InterviewResponse:
        return await self.generate_response(
            user_message="Please review my code",
            response_type=ResponseType.CODE_REVIEW,
            context=f"Problem: {problem_context}\nCode:\n{code}"
        )


def create_response_generator(api_key: Optional[str] = None, **kwargs) -> TechnicalInterviewerResponseGenerator:
    """
    Factory function to create a TechnicalInterviewerResponseGenerator with Gemini

    Args:
        api_key: Deprecated, not needed for Gemini (uses GOOGLE_API_KEY from env)
        **kwargs: Additional configuration parameters

    Returns:
        Configured TechnicalInterviewerResponseGenerator instance
    """
    try:
        logger.info("🤖 Creating Response Generator with Gemini")

        # Create Gemini chat instance
        llm = create_response_gemini_chat()

        # Create config for other parameters
        config = ResponseGeneratorConfig(
            temperature=kwargs.get('temperature', 0.2),
            max_tokens=kwargs.get('max_tokens', 10000)
        )

        logger.info("✅ Response Generator created successfully with Gemini")
        return TechnicalInterviewerResponseGenerator(llm=llm, config=config)

    except Exception as e:
        logger.error(f"❌ Failed to create Response Generator: {str(e)}")
        raise
