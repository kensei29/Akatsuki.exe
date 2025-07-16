"""
Main Interview Orchestrator

Central coordinator that manages the entire interview flow and orchestrates
all AI agents and components. Handles session lifecycle, component coordination,
and interview flow control.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

import asyncio
import logging
import os
import uuid
from typing import Dict, Any, Optional, List, Union
from datetime import datetime, timedelta
from enum import Enum

from pydantic import BaseModel, Field

# Import core components
from ..core.base_agent import BaseInterviewAgent, AgentState
from ..core.problem_database import (
    ProblemDatabase,
    ProblemDifficulty,
    ProblemCategory,
    Problem,
    create_problem_database
)
from ..core.interview_state_manager import (
    InterviewStateManager,
    SessionStatus,
    create_interview_state_manager
)
from ..interviewer_agents.dsa_interviewer import (
    DSAInterviewAgent,
    create_dsa_interviewer
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InterviewType(str, Enum):
    """Types of interviews supported"""
    DSA_ONLY = "dsa_only"
    BEHAVIORAL_ONLY = "behavioral_only"
    SYSTEM_DESIGN_ONLY = "system_design_only"
    MIXED_DSA_BEHAVIORAL = "mixed_dsa_behavioral"
    FULL_TECHNICAL = "full_technical"


class InterviewSessionConfig(BaseModel):
    """Configuration for an interview session"""
    interview_type: InterviewType = InterviewType.DSA_ONLY
    duration_minutes: int = Field(default=30, ge=15, le=120)
    difficulty_range: List[ProblemDifficulty] = Field(
        default=[ProblemDifficulty.EASY, ProblemDifficulty.MEDIUM])
    problem_categories: List[ProblemCategory] = Field(default_factory=list)
    max_problems: int = Field(default=3, ge=1, le=10)
    user_id: Optional[str] = None
    user_preferences: Dict[str, Any] = Field(default_factory=dict)


class SessionState(BaseModel):
    """Current state of an interview session"""
    session_id: str
    config: InterviewSessionConfig
    status: SessionStatus
    current_agent: Optional[str] = None
    current_problem: Optional[Problem] = None
    problems_completed: List[str] = Field(default_factory=list)
    start_time: datetime
    end_time: Optional[datetime] = None
    total_score: float = 0.0
    performance_metrics: Dict[str, Any] = Field(default_factory=dict)


class OrchestratorResponse(BaseModel):
    """Response from the orchestrator"""
    session_id: str
    message: str
    current_phase: str
    suggested_actions: List[str] = Field(default_factory=list)
    session_state: SessionState
    requires_user_input: bool = True
    is_session_complete: bool = False


class MainInterviewOrchestrator:
    """
    Main coordinator for interview sessions that orchestrates all agents and components
    """

    def __init__(
        self,
        problem_database: ProblemDatabase,
        interview_state_manager: InterviewStateManager,
        dsa_interviewer: DSAInterviewAgent,
        config: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize the orchestrator with all required components

        Args:
            problem_database: Database for problem management
            interview_state_manager: Manager for interview state
            dsa_interviewer: DSA interview agent
            config: Optional configuration parameters
        """
        self.problem_database = problem_database
        self.interview_state_manager = interview_state_manager
        self.dsa_interviewer = dsa_interviewer
        self.config = config or {}

        # Active sessions storage
        self.active_sessions: Dict[str, SessionState] = {}

        logger.info("MainInterviewOrchestrator initialized successfully")

    async def create_session(
        self,
        session_config: InterviewSessionConfig
    ) -> OrchestratorResponse:
        """
        Create a new interview session

        Args:
            session_config: Configuration for the new session

        Returns:
            OrchestratorResponse with session details
        """
        try:
            # Generate unique session ID
            session_id = str(uuid.uuid4())

            # Create session state
            session_state = SessionState(
                session_id=session_id,
                config=session_config,
                status=SessionStatus.ACTIVE,
                start_time=datetime.now()
            )

            # Store session
            self.active_sessions[session_id] = session_state

            # Initialize interview state manager for this session
            session_data = await self.interview_state_manager.create_session(
                user_id=session_config.user_id,
                session_type="dsa",
                duration_limit=session_config.duration_minutes * 60  # Convert to seconds
            )

            logger.info(f"Created new interview session: {session_id}")

            return OrchestratorResponse(
                session_id=session_id,
                message="Welcome! Your interview session has been created. Let's get started!",
                current_phase="session_initialization",
                suggested_actions=[
                    "Begin with the first problem",
                    "Ask questions about the interview format",
                    "Proceed when ready"
                ],
                session_state=session_state,
                is_session_complete=False
            )

        except Exception as e:
            logger.error(f"Error creating session: {str(e)}")
            raise

    async def start_interview(self, session_id: str) -> OrchestratorResponse:
        """
        Start the actual interview for a session

        Args:
            session_id: ID of the session to start

        Returns:
            OrchestratorResponse with first problem/interaction
        """
        try:
            if session_id not in self.active_sessions:
                raise ValueError(f"Session {session_id} not found")

            session_state = self.active_sessions[session_id]

            # Update session state
            session_state.current_agent = "dsa_interviewer"

            # Start with first problem based on interview type
            if session_state.config.interview_type == InterviewType.DSA_ONLY:
                return await self._start_dsa_interview(session_id)
            else:
                # For now, default to DSA interview (will expand for other types)
                return await self._start_dsa_interview(session_id)

        except Exception as e:
            logger.error(f"Error starting interview {session_id}: {str(e)}")
            raise

    async def _start_dsa_interview(self, session_id: str) -> OrchestratorResponse:
        """Start DSA interview for the session"""
        session_state = self.active_sessions[session_id]

        try:
            # Initialize DSA interviewer session
            agent_state = await self.dsa_interviewer.initialize_session(
                user_id=session_state.config.user_id or "anonymous",
                session_id=session_id
            )

            # Extract current problem from agent state metadata
            current_problem_title = agent_state.metadata.get(
                "problem_title", "Unknown Problem")

            # Create a welcome message for the DSA interview
            welcome_message = f"""Welcome to your DSA interview! 

I've selected a problem for you: "{current_problem_title}"

Let me know when you're ready to see the problem statement, or if you have any questions about the interview format."""

            return OrchestratorResponse(
                session_id=session_id,
                message=welcome_message,
                current_phase="dsa_interview_started",
                suggested_actions=[
                    "Ask to see the problem statement",
                    "Ask questions about the interview format",
                    "Say you're ready to begin"
                ],
                session_state=session_state,
                is_session_complete=False
            )

        except Exception as e:
            logger.error(f"Error starting DSA interview: {str(e)}")
            # Return a fallback response
            return OrchestratorResponse(
                session_id=session_id,
                message="I'm ready to conduct your DSA interview! Let me know when you'd like to begin.",
                current_phase="dsa_interview_fallback",
                suggested_actions=["Tell me you're ready to start"],
                session_state=session_state,
                is_session_complete=False
            )

    async def process_message(
        self,
        session_id: str,
        user_message: str
    ) -> OrchestratorResponse:
        """
        Process a user message for the given session

        Args:
            session_id: ID of the session
            user_message: Message from the user

        Returns:
            OrchestratorResponse with AI response
        """
        try:
            logger.info(
                f"🎯 ORCHESTRATOR: Processing message for session {session_id}")
            logger.info(f"📝 USER MESSAGE: {user_message}")

            if session_id not in self.active_sessions:
                raise ValueError(f"Session {session_id} not found")

            session_state = self.active_sessions[session_id]
            logger.info(
                f"📊 SESSION STATE: Agent={session_state.current_agent}, Status={session_state.status}")

            # Route to appropriate agent based on current agent
            if session_state.current_agent == "dsa_interviewer":
                response = await self._process_dsa_message(session_id, user_message)
                logger.info(
                    f"✅ ORCHESTRATOR RESPONSE: {response.message[:100]}...")
                return response
            else:
                raise ValueError(
                    f"Unknown agent: {session_state.current_agent}")

        except Exception as e:
            logger.error(
                f"❌ ORCHESTRATOR ERROR: Error processing message for session {session_id}: {str(e)}")
            raise

    async def _process_dsa_message(
        self,
        session_id: str,
        user_message: str
    ) -> OrchestratorResponse:
        """Process message through DSA interviewer"""
        session_state = self.active_sessions[session_id]
        logger.info(
            f"🤖 DSA AGENT: Processing message for session {session_id}")

        try:
            # Create a basic agent state for the message processing
            agent_state = AgentState(
                session_id=session_id,
                user_id=session_state.config.user_id or "anonymous",
                current_step="processing_message",
                metadata={"session_active": True}
            )

            logger.info(
                f"🔄 DSA AGENT: Calling agent with state: {agent_state.current_step}")

            # Process through DSA interviewer
            dsa_response = await self.dsa_interviewer.process_message(
                message=user_message,
                state=agent_state
            )

            logger.info(f"🎯 DSA AGENT RAW RESPONSE: {dsa_response}")

            # Extract response details
            response_message = dsa_response.get(
                "message", "I understand. How can I help you with the problem?")
            current_phase = dsa_response.get("phase", "dsa_interview_active")

            logger.info(f"📤 DSA AGENT EXTRACTED MESSAGE: {response_message}")
            logger.info(f"📊 DSA AGENT CURRENT PHASE: {current_phase}")

            # Check if session should be completed
            is_complete = dsa_response.get("session_completed", False)
            if is_complete:
                logger.info(f"🏁 DSA AGENT: Session marked as complete")
                session_state.status = SessionStatus.COMPLETED
                session_state.end_time = datetime.now()
                session_state.total_score = dsa_response.get(
                    "final_score", 0.0)

            final_response = OrchestratorResponse(
                session_id=session_id,
                message=response_message,
                current_phase=current_phase,
                suggested_actions=dsa_response.get(
                    "suggested_actions", ["Continue the conversation"]),
                session_state=session_state,
                is_session_complete=is_complete
            )

            logger.info(
                f"✅ DSA AGENT FINAL RESPONSE: message_length={len(final_response.message)}, phase={final_response.current_phase}")
            return final_response

        except Exception as e:
            logger.error(f"Error processing DSA message: {str(e)}")
            # Return a fallback response
            return OrchestratorResponse(
                session_id=session_id,
                message="I'm having some technical difficulties. Could you please repeat your message?",
                current_phase="dsa_interview_error",
                suggested_actions=["Repeat your message", "Ask for help"],
                session_state=session_state,
                is_session_complete=False
            )

    async def get_session_status(self, session_id: str) -> SessionState:
        """Get current status of a session"""
        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")

        return self.active_sessions[session_id]

    async def end_session(self, session_id: str) -> OrchestratorResponse:
        """End an interview session"""
        try:
            if session_id not in self.active_sessions:
                raise ValueError(f"Session {session_id} not found")

            session_state = self.active_sessions[session_id]
            session_state.status = SessionStatus.COMPLETED
            session_state.end_time = datetime.now()

            # Get final evaluation (simplified for now)
            if session_state.current_agent == "dsa_interviewer":
                # For now, provide a simple completion message
                # TODO: Implement proper final evaluation method in DSA interviewer
                session_state.total_score = 75.0  # Default score
                session_state.performance_metrics = {
                    "problems_attempted": len(session_state.problems_completed),
                    "session_duration": (datetime.now() - session_state.start_time).total_seconds(),
                    "completion_status": "completed"
                }

            return OrchestratorResponse(
                session_id=session_id,
                message="Interview session completed successfully! Thank you for participating.",
                current_phase="session_completed",
                suggested_actions=[
                    "View detailed feedback", "Start new interview"],
                session_state=session_state,
                is_session_complete=True
            )

        except Exception as e:
            logger.error(f"Error ending session {session_id}: {str(e)}")
            raise


def create_interview_orchestrator(
    api_key: Optional[str] = None,
    **kwargs
) -> MainInterviewOrchestrator:
    """
    Factory function to create MainInterviewOrchestrator with all dependencies

    Args:
        api_key: HuggingFace API key (optional, will use environment variable if not provided)
        **kwargs: Additional configuration parameters

    Returns:
        Configured MainInterviewOrchestrator instance
    """
    try:
        # Create core components using their factory functions
        problem_database = create_problem_database()
        interview_state_manager = create_interview_state_manager(
            api_key=api_key)
        dsa_interviewer = create_dsa_interviewer(api_key=api_key)

        # Create orchestrator
        orchestrator = MainInterviewOrchestrator(
            problem_database=problem_database,
            interview_state_manager=interview_state_manager,
            dsa_interviewer=dsa_interviewer,
            config=kwargs
        )

        logger.info(
            "MainInterviewOrchestrator created successfully via factory function")
        return orchestrator

    except Exception as e:
        logger.error(f"Error creating MainInterviewOrchestrator: {str(e)}")
        raise


# Example usage and testing
if __name__ == "__main__":
    async def test_orchestrator():
        """Basic test of the orchestrator"""
        try:
            # Create orchestrator
            orchestrator = create_interview_orchestrator()

            # Create session config
            config = InterviewSessionConfig(
                interview_type=InterviewType.DSA_ONLY,
                duration_minutes=30,
                difficulty_range=[ProblemDifficulty.EASY],
                user_id="test_user_001"
            )

            # Create session
            response = await orchestrator.create_session(config)
            print(f"✅ Session created: {response.session_id}")

            # Start interview
            start_response = await orchestrator.start_interview(response.session_id)
            print(f"✅ Interview started: {start_response.message}")

            print("🎉 Basic orchestrator test passed!")

        except Exception as e:
            print(f"❌ Test failed: {str(e)}")

    # Run test
    asyncio.run(test_orchestrator())
