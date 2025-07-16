"""
Base Agent Class for AI Mock Interview Platform
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class AgentState(BaseModel):
    """Base state model for all agents"""
    session_id: str
    user_id: str
    current_step: str
    conversation_history: List[Dict[str, Any]] = []
    metadata: Dict[str, Any] = {}

class BaseInterviewAgent(ABC):
    """Base class for all interview agents"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.state: Optional[AgentState] = None

    @abstractmethod
    async def initialize_session(self, user_id: str, session_id: str) -> AgentState:
        """Initialize a new interview session"""
        pass

    @abstractmethod
    async def process_message(self, message: str, state: AgentState) -> Dict[str, Any]:
        """Process a user message and return response"""
        pass

    @abstractmethod
    async def evaluate_response(self, response: str, state: AgentState) -> Dict[str, Any]:
        """Evaluate user response and provide feedback"""
        pass
