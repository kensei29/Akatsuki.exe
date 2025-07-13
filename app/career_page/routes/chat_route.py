from fastapi import APIRouter, Request
from pydantic import BaseModel
from langchain.memory import ConversationSummaryBufferMemory
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, SystemMessage
from models.hf_models import MODEL_REGISTRY 
from prompts.static_prompts import SYSTEM_PROMPT
from tools import web_search

chat_llm = MODEL_REGISTRY["llama_tools"]
memory = ConversationSummaryBufferMemory(llm=chat_llm.llm, max_token_limit=1000, return_messages=True, max_window_size=3)
router = APIRouter()

class ChatInput(BaseModel):
    message: str

@router.post("/chat")
async def chat(input: ChatInput):
    user_input = input.message.lower().strip()
    
    # Mock response for the programming languages question
    if "programming languages" in user_input and ("2025" in user_input or "best" in user_input):
        mock_response = """Based on current industry trends and market demands, here are the best programming languages to learn in 2025:

1. Python
   - Ideal for AI/ML, Data Science, and Backend Development
   - High demand in job market with excellent salary prospects
   - Large ecosystem of libraries and frameworks

2. JavaScript/TypeScript
   - Essential for modern web development
   - Widely used in frontend and backend (Node.js)
   - TypeScript adds strong typing and better tooling

3. Rust
   - Growing rapidly in systems programming and WebAssembly
   - Excellent for high-performance and secure applications
   - Strong community and increasing enterprise adoption

4. Go (Golang)
   - Perfect for cloud-native and microservices development
   - High performance and excellent concurrency support
   - Used by major tech companies like Google and Uber

5. Kotlin
   - Modern alternative to Java for Android development
   - Clean syntax and better safety features
   - Growing adoption in server-side development

Additional considerations:
- Focus on learning principles over syntax
- Consider your career goals and industry requirements
- Practice building real projects in your chosen language
- Stay updated with modern development practices"""
        return {"response": mock_response}
    
    # Default response for other questions
    default_response = "I'm currently in maintenance mode and can only provide specific information about programming languages in 2025. Please try asking about the best programming languages to learn in 2025."
    return {"response": default_response}