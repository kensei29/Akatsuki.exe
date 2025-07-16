"""
Conversation Manager for Technical Interview System

Manages multi-turn conversations, maintains context, and coordinates with Response Generator.
Uses LangChain/LangGraph for conversation state management and flow control.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

import asyncio
import logging
import os
from typing import Optional, Dict, Any, List, TypedDict, Annotated
from enum import Enum
from datetime import datetime
import uuid

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

from pydantic import BaseModel, Field

from .response_generator import (
    TechnicalInterviewerResponseGenerator,
    ResponseGeneratorConfig,
    ResponseType,
    InterviewResponse,
    create_response_generator
)

# Import Gemini utility
from ..utils.gemini_chat import create_conversation_gemini_chat

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InterviewPhase(str, Enum):
    """Different phases of the interview process"""
    STARTING = "starting"
    PROBLEM_INTRODUCTION = "problem_introduction"
    DISCUSSION = "discussion"
    HINT_GIVING = "hint_giving"
    CODE_REVIEW = "code_review"
    WRAP_UP = "wrap_up"
    COMPLETED = "completed"


class UserIntent(str, Enum):
    """Different types of user intents we can recognize"""
    GENERAL_MESSAGE = "general_message"
    REQUEST_HINT = "request_hint"
    SUBMIT_CODE = "submit_code"
    ASK_CLARIFICATION = "ask_clarification"
    REQUEST_REPEAT = "request_repeat"
    READY_TO_START = "ready_to_start"
    FINISH_INTERVIEW = "finish_interview"


class ConversationMessage(BaseModel):
    """Structured message in conversation"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str = Field(..., description="Message content")
    sender: str = Field(..., description="'user' or 'assistant'")
    timestamp: datetime = Field(default_factory=datetime.now)
    message_type: str = Field(default="text", description="Type of message")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ConversationState(TypedDict):
    """State for conversation management workflow"""
    messages: Annotated[List[BaseMessage], add_messages]
    conversation_id: str
    current_phase: InterviewPhase
    problem_data: Optional[Dict[str, Any]]
    user_code: Optional[str]
    code_language: Optional[str]
    hints_given: int
    max_hints: int
    session_start_time: datetime
    last_activity_time: datetime
    conversation_metadata: Dict[str, Any]


class ConversationManagerConfig(BaseModel):
    """Configuration for Conversation Manager"""
    max_hints: int = Field(default=3, description="Maximum hints per problem")
    session_timeout_minutes: int = Field(
        default=60, description="Session timeout")
    enable_code_execution: bool = Field(
        default=False, description="Enable code execution")
    response_generator_config: Optional[Dict[str, Any]] = Field(
        default_factory=dict)


class ConversationResponse(BaseModel):
    """Response from conversation manager"""
    message: str = Field(..., description="AI response message")
    conversation_id: str = Field(..., description="Conversation identifier")
    current_phase: InterviewPhase = Field(...,
                                          description="Current interview phase")
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Additional response metadata")
    requires_user_action: bool = Field(
        default=False, description="Whether user action is required")
    suggested_actions: List[str] = Field(
        default_factory=list, description="Suggested user actions")


class TechnicalInterviewConversationManager:
    """
    Manages conversation flow for technical interviews using LangGraph
    """

    def __init__(self, response_generator: TechnicalInterviewerResponseGenerator, config: Optional[ConversationManagerConfig] = None):
        self.config = config or ConversationManagerConfig()
        self.response_generator = response_generator
        self.graph = self._build_conversation_graph()

        logger.info("TechnicalInterviewConversationManager initialized")

    # Remove _setup_response_generator method since response generator is provided externally

    def _analyze_user_intent(self, user_message: str) -> UserIntent:
        """Analyze user message to determine intent"""
        message_lower = user_message.lower().strip()

        # Intent keywords mapping
        intent_keywords = {
            UserIntent.REQUEST_HINT: ["hint", "help", "stuck", "don't know", "clue"],
            UserIntent.SUBMIT_CODE: ["```", "def ", "function", "class ", "solution"],
            UserIntent.ASK_CLARIFICATION: ["what", "how", "explain", "clarify", "understand"],
            UserIntent.REQUEST_REPEAT: ["repeat", "again", "say that again", "what did you say"],
            UserIntent.READY_TO_START: ["ready", "start", "begin", "let's go", "ok"],
            UserIntent.FINISH_INTERVIEW: [
                "done", "finish", "end", "complete", "stop"]
        }

        # Check for code submission (contains code blocks or programming patterns)
        if "```" in user_message or any(keyword in message_lower for keyword in ["def ", "class ", "function"]):
            return UserIntent.SUBMIT_CODE

        # Check other intents
        for intent, keywords in intent_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return intent

        return UserIntent.GENERAL_MESSAGE

    def _build_conversation_context(self, state: ConversationState) -> str:
        """Build context string for response generator"""
        context_parts = []

        # Add conversation metadata
        context_parts.append(f"Interview Phase: {state['current_phase']}")
        context_parts.append(
            f"Hints Given: {state['hints_given']}/{state['max_hints']}")

        # Add problem information
        if state.get("problem_data"):
            problem = state["problem_data"]
            if problem:  # Additional null check
                context_parts.append(
                    f"Current Problem: {problem.get('title', 'Unknown')}")
                context_parts.append(
                    f"Difficulty: {problem.get('difficulty', 'Unknown')}")

        # Add recent conversation history (last 3 exchanges)
        messages = state.get("messages", [])
        if len(messages) > 1:
            # Last 3 exchanges (user + assistant)
            recent_messages = messages[-6:]
            context_parts.append("Recent conversation:")
            for msg in recent_messages:
                if isinstance(msg, HumanMessage):
                    context_parts.append(f"User: {msg.content[:100]}...")
                elif isinstance(msg, AIMessage):
                    context_parts.append(f"Assistant: {msg.content[:100]}...")

        # Add code if submitted
        if state.get("user_code"):
            user_code = state["user_code"]
            if user_code:  # Additional null check
                context_parts.append(
                    f"User's submitted code ({state.get('code_language', 'unknown')} language):")
                context_parts.append(
                    user_code[:500] + "..." if len(user_code) > 500 else user_code)

        return "\n".join(context_parts)

    async def _process_message_node(self, state: ConversationState) -> ConversationState:
        """LangGraph node to process user messages and generate responses"""
        try:
            messages = state.get("messages", [])
            if not messages:
                logger.warning("No messages found in state")
                return state

            last_message = messages[-1]
            if not isinstance(last_message, HumanMessage):
                logger.warning("Last message is not from user")
                return state

            user_message = last_message.content
            if isinstance(user_message, list):
                user_message = ' '.join(str(item) for item in user_message)
            user_intent = self._analyze_user_intent(user_message)

            logger.info(f"Processing user message with intent: {user_intent}")

            # Build context for response generator
            context = self._build_conversation_context(state)

            # Determine response type based on intent and phase
            response_type = self._determine_response_type(
                user_intent, state["current_phase"])

            # Generate response using Response Generator
            if user_intent == UserIntent.SUBMIT_CODE:
                # Extract code from message
                code = self._extract_code_from_message(user_message)
                state["user_code"] = code
                state["code_language"] = self._detect_code_language(code)

                # Generate code review
                ai_response = await self.response_generator.generate_code_review(
                    code=code,
                    problem_context=context
                )

                # Update phase to code review
                state["current_phase"] = InterviewPhase.CODE_REVIEW

            elif user_intent == UserIntent.REQUEST_HINT:
                if state["hints_given"] >= state["max_hints"]:
                    ai_response = InterviewResponse(
                        content="I've already provided the maximum number of hints for this problem. Try to work with what we've discussed so far.",
                        response_type=ResponseType.ENCOURAGEMENT,
                        confidence_score=0.9
                    )
                else:
                    hint_level = "gentle" if state["hints_given"] == 0 else "moderate"
                    ai_response = await self.response_generator.generate_hint(
                        context=context,
                        hint_level=hint_level
                    )
                    state["hints_given"] += 1
                    state["current_phase"] = InterviewPhase.HINT_GIVING

            else:
                # General response
                ai_response = await self.response_generator.generate_response(
                    user_message=user_message,
                    response_type=response_type,
                    context=context,
                    problem_data=state.get("problem_data")
                )

            # Add AI response to conversation
            ai_message = AIMessage(content=ai_response.content)
            state["messages"] = state.get("messages", []) + [ai_message]

            # Update activity time
            state["last_activity_time"] = datetime.now()

            # Store current response in metadata
            state["conversation_metadata"]["last_response"] = {
                "content": ai_response.content,
                "response_type": ai_response.response_type,
                "confidence_score": ai_response.confidence_score,
                "user_intent": user_intent
            }

            logger.info(
                f"Generated response of type: {ai_response.response_type}")
            return state

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")

            # Add fallback response
            fallback_message = AIMessage(
                content="I apologize, but I encountered an issue processing your message. Could you please try again?"
            )
            state["messages"] = state.get("messages", []) + [fallback_message]
            return state

    def _determine_response_type(self, user_intent: UserIntent, current_phase: InterviewPhase) -> ResponseType:
        """Determine appropriate response type based on intent and phase"""
        if user_intent == UserIntent.SUBMIT_CODE:
            return ResponseType.CODE_REVIEW
        elif user_intent == UserIntent.REQUEST_HINT:
            return ResponseType.HINT_PROVISION
        elif current_phase == InterviewPhase.PROBLEM_INTRODUCTION:
            return ResponseType.PROBLEM_INTRODUCTION
        else:
            return ResponseType.ENCOURAGEMENT

    def _extract_code_from_message(self, message: str) -> str:
        """Extract code from user message"""
        # Look for code blocks first
        if "```" in message:
            parts = message.split("```")
            if len(parts) >= 3:
                # Return the first code block
                return parts[1].strip()

        # If no code blocks, return the whole message if it looks like code
        if any(keyword in message.lower() for keyword in ["def ", "class ", "function", "return", "if ", "for "]):
            return message.strip()

        return message.strip()

    def _detect_code_language(self, code: str) -> str:
        """Simple language detection based on code patterns"""
        code_lower = code.lower()

        if "def " in code_lower or "import " in code_lower:
            return "python"
        elif "function" in code_lower or "var " in code_lower or "let " in code_lower:
            return "javascript"
        elif "public class" in code_lower or "public static" in code_lower:
            return "java"
        elif "#include" in code_lower or "int main" in code_lower:
            return "cpp"
        else:
            return "unknown"

    def _build_conversation_graph(self):
        """Build the LangGraph workflow for conversation management"""
        workflow = StateGraph(ConversationState)

        # Add the main processing node
        workflow.add_node("process_message", self._process_message_node)

        # Add edges
        workflow.add_edge(START, "process_message")
        workflow.add_edge("process_message", END)

        # Compile with memory
        memory = MemorySaver()
        return workflow.compile(checkpointer=memory)

    async def start_new_conversation(self, problem_data: Dict[str, Any]) -> ConversationResponse:
        """Start a new conversation with a problem introduction"""
        conversation_id = str(uuid.uuid4())

        logger.info(f"Starting new conversation: {conversation_id}")

        # Generate problem introduction
        intro_response = await self.response_generator.generate_problem_introduction(problem_data)

        # Create initial state
        initial_state: ConversationState = {
            "messages": [
                SystemMessage(content="Starting technical interview session"),
                AIMessage(content=intro_response.content)
            ],
            "conversation_id": conversation_id,
            "current_phase": InterviewPhase.PROBLEM_INTRODUCTION,
            "problem_data": problem_data,
            "user_code": None,
            "code_language": None,
            "hints_given": 0,
            "max_hints": self.config.max_hints,
            "session_start_time": datetime.now(),
            "last_activity_time": datetime.now(),
            "conversation_metadata": {
                "problem_title": problem_data.get("title", "Unknown"),
                "difficulty": problem_data.get("difficulty", "Unknown")
            }
        }

        # Store initial state in graph
        config = RunnableConfig(configurable={"thread_id": conversation_id})
        await self.graph.ainvoke(initial_state, config=config)

        return ConversationResponse(
            message=intro_response.content,
            conversation_id=conversation_id,
            current_phase=InterviewPhase.PROBLEM_INTRODUCTION,
            metadata={
                "problem_title": problem_data.get("title"),
                "hints_remaining": self.config.max_hints
            },
            requires_user_action=True,
            suggested_actions=["Ask clarifying questions",
                               "Start thinking about the approach", "Request a hint if needed"]
        )

    async def process_user_message(self, conversation_id: str, user_message: str) -> ConversationResponse:
        """Process a user message and return AI response"""
        logger.info(f"Processing message for conversation: {conversation_id}")

        # Create user message
        user_msg = HumanMessage(content=user_message)

        # Get current state and add user message
        config = RunnableConfig(configurable={"thread_id": conversation_id})

        # Update state with new user message
        current_state: ConversationState = {
            "messages": [user_msg],
            "conversation_id": conversation_id,
            "current_phase": InterviewPhase.DISCUSSION,  # Will be updated by graph
            "problem_data": None,  # Will be preserved by graph
            "user_code": None,
            "code_language": None,
            "hints_given": 0,
            "max_hints": self.config.max_hints,
            "session_start_time": datetime.now(),
            "last_activity_time": datetime.now(),
            "conversation_metadata": {}
        }

        # Process through graph
        result_state = await self.graph.ainvoke(current_state, config=config)

        # Extract AI response
        messages = result_state.get("messages", [])
        ai_message = None
        for msg in reversed(messages):
            if isinstance(msg, AIMessage):
                ai_message = msg
                break

        if not ai_message:
            raise ValueError("No AI response generated")

        # Build response metadata
        last_response = result_state.get(
            "conversation_metadata", {}).get("last_response", {})

        # Handle AI message content type
        ai_content = ai_message.content
        if isinstance(ai_content, list):
            ai_content = ' '.join(str(item) for item in ai_content)

        return ConversationResponse(
            message=ai_content,
            conversation_id=conversation_id,
            current_phase=result_state.get(
                "current_phase", InterviewPhase.DISCUSSION),
            metadata={
                "response_type": last_response.get("response_type"),
                "confidence_score": last_response.get("confidence_score"),
                "hints_given": result_state.get("hints_given", 0),
                "hints_remaining": self.config.max_hints - result_state.get("hints_given", 0),
                "user_intent": last_response.get("user_intent")
            },
            requires_user_action=True,
            suggested_actions=self._get_suggested_actions(
                result_state.get("current_phase", InterviewPhase.DISCUSSION))
        )

    def _get_suggested_actions(self, phase: InterviewPhase) -> List[str]:
        """Get suggested actions based on current phase"""
        suggestions = {
            InterviewPhase.PROBLEM_INTRODUCTION: [
                "Ask clarifying questions about the problem",
                "Start thinking about your approach",
                "Request a hint if you're stuck"
            ],
            InterviewPhase.DISCUSSION: [
                "Explain your approach",
                "Ask for clarification if needed",
                "Submit your code when ready"
            ],
            InterviewPhase.HINT_GIVING: [
                "Think about the hint provided",
                "Ask follow-up questions",
                "Try implementing the suggested approach"
            ],
            InterviewPhase.CODE_REVIEW: [
                "Consider the feedback provided",
                "Ask about specific improvements",
                "Submit an updated solution if needed"
            ]
        }

        return suggestions.get(phase, ["Continue the conversation"])

    async def get_conversation_summary(self, conversation_id: str) -> Dict[str, Any]:
        """Get a summary of the conversation"""
        # This would retrieve conversation state and provide summary
        # For now, return basic structure
        return {
            "conversation_id": conversation_id,
            "status": "active",
            "message": "Conversation summary feature coming soon"
        }


def create_conversation_manager(api_key: Optional[str] = None, **kwargs) -> TechnicalInterviewConversationManager:
    """
    Factory function to create conversation manager with Gemini

    Args:
        api_key: Deprecated, not needed for Gemini (uses GOOGLE_API_KEY from env)
        **kwargs: Additional configuration parameters

    Returns:
        Configured TechnicalInterviewConversationManager instance
    """
    try:
        logger.info("🤖 Creating Conversation Manager with Gemini")

        # Create Gemini chat instance
        llm = create_conversation_gemini_chat()

        # Create response generator config for other parameters
        response_config = ResponseGeneratorConfig(
            temperature=kwargs.get('temperature', 0.2),
            max_tokens=kwargs.get('max_tokens', 10000)
        )

        # Create response generator with LLM
        response_generator = TechnicalInterviewerResponseGenerator(
            llm=llm, config=response_config)

        # Create conversation manager config
        config = ConversationManagerConfig(
            max_hints=kwargs.get('max_hints', 3),
            session_timeout_minutes=kwargs.get('session_timeout_minutes', 60),
            enable_code_execution=kwargs.get('enable_code_execution', False),
            response_generator_config=kwargs.get(
                'response_generator_config', {})
        )

        logger.info("✅ Conversation Manager created successfully with Gemini")
        return TechnicalInterviewConversationManager(
            response_generator=response_generator,
            config=config
        )

    except Exception as e:
        logger.error(f"❌ Failed to create Conversation Manager: {str(e)}")
        raise
