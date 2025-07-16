"""
Interview State Manager for AI-Based Mock Interview Platform

Manages the overall state of interview sessions, including:
- Session lifecycle management
- Performance tracking and analytics
- Time management
- Problem progression
- User progress tracking

Uses LangChain/LangGraph for state orchestration.

Author: AI Mock Interview Platform Team
Date: January 2025
"""

import asyncio
import logging
from typing import Optional, Dict, Any, List, TypedDict, Annotated
from enum import Enum
from datetime import datetime, timedelta
import uuid
import json

from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

from pydantic import BaseModel, Field

from .conversation_manager import (
    TechnicalInterviewConversationManager,
    ConversationManagerConfig,
    InterviewPhase
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SessionStatus(str, Enum):
    """Overall status of an interview session"""
    INITIALIZING = "initializing"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    TERMINATED = "terminated"
    ERROR = "error"


class ProblemDifficulty(str, Enum):
    """Problem difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class PerformanceMetric(BaseModel):
    """Performance tracking for interview sessions"""
    session_id: str
    problem_title: str
    difficulty: ProblemDifficulty
    start_time: datetime
    end_time: Optional[datetime] = None
    time_taken: Optional[int] = None  # in seconds
    hints_used: int = 0
    attempts: int = 0
    solution_correct: Optional[bool] = None
    code_quality_score: Optional[float] = None
    communication_score: Optional[float] = None
    overall_score: Optional[float] = None


class InterviewSessionData(BaseModel):
    """Complete interview session data"""
    session_id: str
    user_id: Optional[str] = None
    session_type: str = "dsa"  # dsa, system_design, core_cs
    status: SessionStatus = SessionStatus.INITIALIZING
    current_problem: Optional[Dict[str, Any]] = None
    problems_completed: List[str] = Field(default_factory=list)
    performance_metrics: List[PerformanceMetric] = Field(default_factory=list)
    conversation_id: Optional[str] = None
    start_time: datetime = Field(default_factory=datetime.now)
    last_activity: datetime = Field(default_factory=datetime.now)
    session_duration_limit: int = 3600  # 1 hour default
    metadata: Dict[str, Any] = Field(default_factory=dict)


class InterviewSessionState(TypedDict):
    """State for the interview session graph"""
    session_data: InterviewSessionData
    current_action: Optional[str]
    next_actions: List[str]
    error_message: Optional[str]


class InterviewStateManagerConfig(BaseModel):
    """Configuration for Interview State Manager"""
    conversation_manager_config: ConversationManagerConfig
    default_session_duration: int = 3600  # 1 hour
    max_hints_per_problem: int = 3
    auto_save_interval: int = 300  # 5 minutes
    performance_tracking_enabled: bool = True


class InterviewStateManager:
    """
    Manages the overall state of interview sessions with LangGraph orchestration
    """

    def __init__(self, config: InterviewStateManagerConfig):
        self.config = config
        self.active_sessions: Dict[str, InterviewSessionData] = {}
        self.conversation_manager = TechnicalInterviewConversationManager(
            config.conversation_manager_config
        )

        # Create LangGraph workflow for session management
        self.session_graph = self._create_session_graph()

        logger.info("InterviewStateManager initialized")

    def _create_session_graph(self) -> StateGraph:
        """Create LangGraph workflow for session state management"""

        def process_session_action(state: InterviewSessionState) -> InterviewSessionState:
            """Process session actions based on current state"""
            logger.info(
                f"Processing session action for: {state['session_data'].session_id}")

            session_data = state["session_data"]
            current_time = datetime.now()

            # Update last activity
            session_data.last_activity = current_time

            # Check session time limits
            session_duration = (
                current_time - session_data.start_time).total_seconds()
            if session_duration > session_data.session_duration_limit:
                logger.warning(
                    f"Session {session_data.session_id} exceeded time limit")
                session_data.status = SessionStatus.COMPLETED
                state["current_action"] = "session_timeout"
            else:
                # Update status based on current state
                if session_data.status == SessionStatus.INITIALIZING:
                    session_data.status = SessionStatus.ACTIVE
                    state["current_action"] = "session_initialized"
                else:
                    state["current_action"] = "session_updated"

            state["next_actions"] = ["monitor", "interact", "finalize"]
            return state

        # Build the graph with simple structure
        graph = StateGraph(InterviewSessionState)

        # Add single processing node
        graph.add_node("process_session", process_session_action)

        # Simple linear flow
        graph.add_edge(START, "process_session")
        graph.add_edge("process_session", END)

        # Add checkpointer for state persistence
        memory = MemorySaver()
        return graph.compile(checkpointer=memory)

    async def create_session(
        self,
        user_id: Optional[str] = None,
        session_type: str = "dsa",
        duration_limit: Optional[int] = None
    ) -> Dict[str, Any]:
        """Create a new interview session"""

        session_id = str(uuid.uuid4())

        # Create session data
        session_data = InterviewSessionData(
            session_id=session_id,
            user_id=user_id,
            session_type=session_type,
            session_duration_limit=duration_limit or self.config.default_session_duration
        )

        # Initialize session state
        initial_state: InterviewSessionState = {
            "session_data": session_data,
            "current_action": None,
            "next_actions": [],
            "error_message": None
        }

        try:
            # Run session initialization through graph
            config = {"configurable": {"thread_id": session_id}}
            result = await self.session_graph.ainvoke(initial_state, config)

            # Store in active sessions
            self.active_sessions[session_id] = result["session_data"]

            logger.info(f"Created new interview session: {session_id}")

            return {
                "success": True,
                "session_id": session_id,
                "status": result["session_data"].status.value,
                "next_actions": result["next_actions"]
            }

        except Exception as e:
            logger.error(f"Error creating session: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def start_problem(
        self,
        session_id: str,
        problem_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Start a new problem in the interview session"""

        if session_id not in self.active_sessions:
            return {"success": False, "error": "Session not found"}

        session_data = self.active_sessions[session_id]

        try:
            # Start conversation for the problem
            conversation_result = await self.conversation_manager.start_new_conversation(
                problem_data=problem_data
            )

            if not conversation_result.get("success", True):
                return {"success": False, "error": "Failed to start conversation"}

            # Update session data
            session_data.current_problem = problem_data
            session_data.conversation_id = conversation_result["conversation_id"]
            session_data.last_activity = datetime.now()

            # Create performance metric
            performance_metric = PerformanceMetric(
                session_id=session_id,
                problem_title=problem_data.get("title", "Unknown"),
                difficulty=ProblemDifficulty(
                    problem_data.get("difficulty", "medium").lower()),
                start_time=datetime.now()
            )
            session_data.performance_metrics.append(performance_metric)

            logger.info(
                f"Started problem '{problem_data.get('title')}' in session {session_id}")

            return {
                "success": True,
                "conversation_id": conversation_result["conversation_id"],
                "response": conversation_result["response"],
                "metadata": conversation_result["metadata"]
            }

        except Exception as e:
            logger.error(f"Error starting problem: {e}")
            return {"success": False, "error": str(e)}

    async def process_user_message(
        self,
        session_id: str,
        message: str
    ) -> Dict[str, Any]:
        """Process a user message within the session context"""

        if session_id not in self.active_sessions:
            return {"success": False, "error": "Session not found"}

        session_data = self.active_sessions[session_id]

        if not session_data.conversation_id:
            return {"success": False, "error": "No active conversation"}

        try:
            # Process message through conversation manager
            result = await self.conversation_manager.process_message(
                session_data.conversation_id,
                message
            )

            # Update session activity
            session_data.last_activity = datetime.now()

            # Update performance metrics if applicable
            if session_data.performance_metrics:
                current_metric = session_data.performance_metrics[-1]

                # Update hints used
                if result.get("metadata", {}).get("hints_remaining") is not None:
                    hints_given = self.config.max_hints_per_problem - \
                        result["metadata"]["hints_remaining"]
                    current_metric.hints_used = hints_given

                # Increment attempts for code submissions
                if result.get("metadata", {}).get("user_intent") == "SUBMIT_CODE":
                    current_metric.attempts += 1

            return result

        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return {"success": False, "error": str(e)}

    async def complete_problem(
        self,
        session_id: str,
        solution_correct: bool = True,
        code_quality_score: Optional[float] = None
    ) -> Dict[str, Any]:
        """Mark current problem as completed and update metrics"""

        if session_id not in self.active_sessions:
            return {"success": False, "error": "Session not found"}

        session_data = self.active_sessions[session_id]

        if not session_data.current_problem:
            return {"success": False, "error": "No active problem"}

        try:
            # Update performance metrics
            if session_data.performance_metrics:
                current_metric = session_data.performance_metrics[-1]
                current_metric.end_time = datetime.now()
                current_metric.time_taken = int(
                    (current_metric.end_time -
                     current_metric.start_time).total_seconds()
                )
                current_metric.solution_correct = solution_correct
                current_metric.code_quality_score = code_quality_score

                # Calculate overall score (simple formula)
                score_components = []
                if solution_correct:
                    # Base score for correct solution
                    score_components.append(70)

                # Bonus for efficiency (fewer hints, less time)
                # Up to 30 points
                time_bonus = max(0, 30 - current_metric.time_taken // 60)
                hint_penalty = current_metric.hints_used * 5  # 5 points per hint
                score_components.append(max(0, time_bonus - hint_penalty))

                current_metric.overall_score = min(100, sum(score_components))

            # Add to completed problems
            problem_title = session_data.current_problem.get(
                "title", "Unknown")
            session_data.problems_completed.append(problem_title)
            session_data.current_problem = None
            session_data.conversation_id = None

            logger.info(
                f"Completed problem '{problem_title}' in session {session_id}")

            return {
                "success": True,
                "problems_completed": len(session_data.problems_completed),
                "performance_summary": current_metric.dict() if session_data.performance_metrics else None
            }

        except Exception as e:
            logger.error(f"Error completing problem: {e}")
            return {"success": False, "error": str(e)}

    async def get_session_analytics(self, session_id: str) -> Dict[str, Any]:
        """Get comprehensive analytics for a session"""

        if session_id not in self.active_sessions:
            return {"success": False, "error": "Session not found"}

        session_data = self.active_sessions[session_id]

        # Calculate session statistics
        total_time = (session_data.last_activity -
                      session_data.start_time).total_seconds()
        problems_attempted = len(session_data.performance_metrics)
        problems_completed = len(session_data.problems_completed)

        # Calculate average scores
        completed_metrics = [
            m for m in session_data.performance_metrics if m.solution_correct is not None]
        avg_score = sum(m.overall_score or 0 for m in completed_metrics) / \
            len(completed_metrics) if completed_metrics else 0

        return {
            "success": True,
            "session_id": session_id,
            "status": session_data.status.value,
            "session_duration": int(total_time),
            "problems_attempted": problems_attempted,
            "problems_completed": problems_completed,
            "completion_rate": problems_completed / problems_attempted if problems_attempted > 0 else 0,
            "average_score": round(avg_score, 1),
            "performance_metrics": [m.dict() for m in session_data.performance_metrics],
            "session_metadata": session_data.metadata
        }

    async def close_session(self, session_id: str) -> Dict[str, Any]:
        """Close and finalize an interview session"""

        if session_id not in self.active_sessions:
            return {"success": False, "error": "Session not found"}

        session_data = self.active_sessions[session_id]

        try:
            # Update session status
            session_data.status = SessionStatus.COMPLETED
            session_data.last_activity = datetime.now()

            # Get final analytics
            analytics = await self.get_session_analytics(session_id)

            # Remove from active sessions
            del self.active_sessions[session_id]

            logger.info(f"Closed interview session: {session_id}")

            return {
                "success": True,
                "session_id": session_id,
                "final_analytics": analytics.get("analytics", {})
            }

        except Exception as e:
            logger.error(f"Error closing session: {e}")
            return {"success": False, "error": str(e)}

    def get_active_sessions(self) -> List[Dict[str, Any]]:
        """Get list of all active sessions"""
        return [
            {
                "session_id": session_id,
                "status": session_data.status.value,
                "start_time": session_data.start_time.isoformat(),
                "last_activity": session_data.last_activity.isoformat(),
                "problems_completed": len(session_data.problems_completed),
                "current_problem": session_data.current_problem.get("title") if session_data.current_problem else None
            }
            for session_id, session_data in self.active_sessions.items()
        ]


def create_interview_state_manager(
    api_key: Optional[str] = None,
    model_name: Optional[str] = None,
    **kwargs
) -> InterviewStateManager:
    """Factory function to create InterviewStateManager with default config"""
    import os

    # Use environment variables if not provided
    final_api_key = api_key or os.getenv("INTERVIEW_STATE_MANAGER_API_KEY")
    final_model_name = model_name or os.getenv(
        "INTERVIEW_STATE_MANAGER_MODEL_NAME")

    if not final_api_key:
        raise ValueError(
            "API key is required. Set INTERVIEW_STATE_MANAGER_API_KEY environment variable or pass api_key parameter.")

    if not final_model_name:
        raise ValueError(
            "Model name is required. Set INTERVIEW_STATE_MANAGER_MODEL_NAME environment variable or pass model_name parameter.")

    conversation_config = ConversationManagerConfig(
        api_key=final_api_key,
        model_name=final_model_name,
        **kwargs
    )

    state_manager_config = InterviewStateManagerConfig(
        conversation_manager_config=conversation_config
    )

    return InterviewStateManager(state_manager_config)
