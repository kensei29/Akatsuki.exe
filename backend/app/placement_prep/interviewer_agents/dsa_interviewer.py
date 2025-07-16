"""
DSA (Data Structures & Algorithms) Interview Agent

Comprehensive agent for conducting DSA interviews with integrated components:
- Response Generator for AI responses
- Conversation Manager for multi-turn conversations
- Problem Database for intelligent problem selection
- Interview State Manager for session management

Author: AI Mock Interview Platform Team
Date: July 2025
"""

import asyncio
import logging
import os
from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid

from ..core.base_agent import BaseInterviewAgent, AgentState
from ..core.response_generator import (
    TechnicalInterviewerResponseGenerator,
    ResponseType,
    InterviewResponse,
    create_response_generator
)
from ..core.conversation_manager import (
    TechnicalInterviewConversationManager,
    InterviewPhase,
    ConversationState,
    UserIntent,
    ConversationResponse,
    create_conversation_manager
)
from ..core.problem_database import (
    ProblemDatabase,
    ProblemDifficulty,
    ProblemCategory,
    ProblemFilter,
    create_problem_database
)
from ..core.interview_state_manager import (
    InterviewStateManager,
    SessionStatus,
    create_interview_state_manager
)

# Import Gemini utility
from ..utils.gemini_chat import create_interview_gemini_chat

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DSAInterviewAgent(BaseInterviewAgent):
    """AI agent specialized in conducting DSA interviews with full component integration"""

    def __init__(
        self,
        response_generator: TechnicalInterviewerResponseGenerator,
        conversation_manager: TechnicalInterviewConversationManager,
        problem_database: ProblemDatabase,
        interview_state_manager: InterviewStateManager,
        session_config: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            name="DSA Interviewer",
            description="Specialized agent for Data Structures and Algorithms interviews"
        )

        # Core components
        self.response_generator = response_generator
        self.conversation_manager = conversation_manager
        self.problem_database = problem_database
        self.interview_state_manager = interview_state_manager

        # Session configuration
        self.session_config = session_config or {
            "max_problems": 3,
            "time_limit_minutes": 45,
            "hints_per_problem": 3,
            "difficulty_progression": True
        }

        # Current session state
        self.current_session_id: Optional[str] = None
        self.current_conversation_state: Optional[ConversationState] = None
        self.current_problem: Optional[Dict[str, Any]] = None

        logger.info(
            f"DSA Interview Agent initialized with components: {self._component_status()}")

    def _component_status(self) -> Dict[str, bool]:
        """Check status of all integrated components"""
        return {
            "response_generator": self.response_generator is not None,
            "conversation_manager": self.conversation_manager is not None,
            "problem_database": self.problem_database is not None,
            "interview_state_manager": self.interview_state_manager is not None
        }

    async def initialize_session(self, user_id: str, session_id: str) -> AgentState:
        """Initialize DSA interview session with all components"""
        try:
            logger.info(
                f"Initializing DSA interview session {session_id} for user {user_id}")

            # Initialize interview state manager session
            session_data = await self.interview_state_manager.create_session(
                user_id=user_id,
                session_type="dsa",
                duration_limit=self.session_config.get(
                    "time_limit_minutes", 45)
            )

            # Select first problem
            first_problem = await self._select_initial_problem(user_id)
            if not first_problem:
                raise ValueError("No suitable problems found for interview")

            # Store session state
            self.current_session_id = session_id
            self.current_problem = first_problem

            # Initialize conversation state
            self.current_conversation_state = {
                "messages": [],
                "conversation_id": session_id,
                "current_phase": InterviewPhase.STARTING,
                "problem_data": first_problem,
                "user_code": None,
                "code_language": None,
                "hints_given": 0,
                "max_hints": self.session_config.get("hints_per_problem", 3),
                "session_start_time": datetime.now(),
                "last_activity_time": datetime.now(),
                "conversation_metadata": {
                    "interview_type": "dsa",
                    "session_id": session_id
                }
            }

            # Create agent state
            agent_state = AgentState(
                session_id=session_id,
                user_id=user_id,
                current_step="problem_introduction",
                metadata={
                    "interview_type": "dsa",
                    "current_problem_id": first_problem.get("id"),
                    "problem_title": first_problem.get("title"),
                    "difficulty_level": first_problem.get("difficulty", "medium"),
                    "problems_solved": 0,
                    "hints_used": 0,
                    "start_time": datetime.now().isoformat(),
                    "session_status": "active",
                    "components_initialized": self._component_status()
                }
            )

            logger.info(
                f"DSA interview session {session_id} initialized successfully")
            return agent_state

        except Exception as e:
            logger.error(
                f"Failed to initialize DSA interview session: {str(e)}")
            raise

    async def _select_initial_problem(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Select appropriate first problem for the interview"""
        try:
            # Create filter for initial problem (medium difficulty by default)
            problem_filter = ProblemFilter(
                difficulties=[ProblemDifficulty.MEDIUM],
                categories=[
                    ProblemCategory.ARRAY,
                    ProblemCategory.STRING,
                    ProblemCategory.TWO_POINTERS
                ]
            )

            # Search for suitable problems
            problems = self.problem_database.search_problems(problem_filter)

            if problems:
                # Convert Problem object to dict and select first one
                problem = problems[0]
                problem_dict = {
                    "id": problem.id,
                    "title": problem.title,
                    "description": problem.description,
                    "difficulty": problem.difficulty.value,
                    "category": problem.category.value,
                    "hints": problem.hints,
                    "test_cases": problem.test_cases
                }
                logger.info(
                    f"Selected initial problem: {problem.title} ({problem.difficulty.value})")
                return problem_dict

            # Fallback: get any problem
            all_problems = self.problem_database.problems
            if all_problems:
                problem = list(all_problems.values())[0]  # Get first problem
                problem_dict = {
                    "id": problem.id,
                    "title": problem.title,
                    "description": problem.description,
                    "difficulty": problem.difficulty.value,
                    "category": problem.category.value,
                    "hints": problem.hints,
                    "test_cases": problem.test_cases
                }
                return problem_dict

            logger.warning("No problems found in database")
            return None

        except Exception as e:
            logger.error(f"Error selecting initial problem: {str(e)}")
            return None

    async def process_message(self, message: str, state: AgentState) -> Dict[str, Any]:
        """Process user message in DSA interview context"""
        try:
            logger.info(
                f"🎯 DSA INTERVIEWER: Received message: {message[:100]}...")

            if not self.current_conversation_state or not self.current_session_id:
                raise ValueError(
                    "No active conversation state. Please initialize session first.")

            logger.info(
                f"🔄 DSA INTERVIEWER: Processing through conversation manager for session {self.current_session_id}")

            # Process message through conversation manager
            response = await self.conversation_manager.process_user_message(
                conversation_id=self.current_session_id,
                user_message=message
            )

            logger.info(f"📤 CONVERSATION MANAGER RESPONSE: {response}")
            logger.info(f"📝 GENERATED MESSAGE: {response.message}")
            logger.info(f"📊 CURRENT PHASE: {response.current_phase}")
            logger.info(
                f"🎯 USER INTENT: {getattr(response, 'user_intent', 'unknown')}")

            # Update agent state metadata
            updated_metadata = state.metadata.copy()
            updated_metadata.update({
                "last_message_time": datetime.now().isoformat(),
                "current_phase": response.current_phase.value if response.current_phase else "unknown",
                "hints_used": self.current_conversation_state.get("hints_given", 0) if self.current_conversation_state else 0
            })

            # Check if we need to transition to next problem or end interview
            action = self._determine_next_action(response, state)
            logger.info(f"🎬 DETERMINED ACTION: {action}")

            final_response = {
                "message": response.message,  # Changed from "response" to "message" for consistency
                "phase": response.current_phase.value if response.current_phase else "unknown",
                "suggested_actions": response.suggested_actions or ["Continue the conversation"],
                "session_completed": action == "end_interview",
                "action": action,
                "state_update": {
                    "metadata": updated_metadata,
                    "current_step": self._get_current_step(action)
                },
                "conversation_metadata": {
                    "phase": response.current_phase.value if response.current_phase else "unknown",
                    "problem_id": self.current_problem.get("id") if self.current_problem else None,
                    "hints_remaining": (
                        self.current_conversation_state.get("max_hints", 3) -
                        self.current_conversation_state.get("hints_given", 0)
                    ) if self.current_conversation_state else 3
                }
            }

            logger.info(f"✅ DSA INTERVIEWER FINAL RESPONSE: {final_response}")
            return final_response

        except Exception as e:
            logger.error(
                f"❌ DSA INTERVIEWER ERROR: Error processing message: {str(e)}")
            return {
                "message": "I apologize, but I encountered an issue. Let me help you continue with the interview.",
                "phase": "error",
                "suggested_actions": ["Continue the conversation"],
                "session_completed": False,
                "action": "continue",
                "state_update": {},
                "error": str(e)
            }

    def _determine_next_action(self, response: ConversationResponse, state: AgentState) -> str:
        """Determine the next action based on conversation response"""
        try:
            current_phase = response.current_phase

            # Check if interview should continue
            if current_phase == InterviewPhase.COMPLETED:
                return "end_interview"
            elif current_phase == InterviewPhase.WRAP_UP:
                return "wrap_up"
            elif current_phase == InterviewPhase.CODE_REVIEW:
                return "provide_feedback"
            elif current_phase == InterviewPhase.PROBLEM_INTRODUCTION:
                return "present_problem"
            else:
                return "continue_discussion"

        except Exception as e:
            logger.error(f"Error determining next action: {str(e)}")
            return "continue"

    def _get_current_step(self, action: str) -> str:
        """Map action to current step"""
        action_to_step = {
            "present_problem": "problem_introduction",
            "continue_discussion": "discussion",
            "provide_feedback": "code_review",
            "wrap_up": "wrap_up",
            "end_interview": "completed"
        }
        return action_to_step.get(action, "discussion")

    async def evaluate_response(self, response: str, state: AgentState) -> Dict[str, Any]:
        """Evaluate DSA solution and provide feedback"""
        try:
            logger.info(f"Evaluating DSA response: {response[:100]}...")

            if not self.current_problem:
                return {
                    "score": 0,
                    "feedback": "No active problem to evaluate against.",
                    "suggestions": ["Please start with a problem first."]
                }

            # Extract code from response if present
            code = self._extract_code_from_response(response)

            if not code:
                # If no code, provide general feedback on explanation
                return await self._evaluate_explanation(response, state)

            # Evaluate code solution
            return await self._evaluate_code_solution(code, response, state)

        except Exception as e:
            logger.error(f"Error evaluating DSA response: {str(e)}")
            return {
                "score": 0,
                "feedback": "Unable to evaluate response due to technical issue.",
                "suggestions": ["Please try submitting your solution again."],
                "error": str(e)
            }

    def _extract_code_from_response(self, response: str) -> Optional[str]:
        """Extract code from user response"""
        try:
            # Look for code blocks
            if "```" in response:
                parts = response.split("```")
                for i, part in enumerate(parts):
                    if i % 2 == 1:  # Code blocks are at odd indices
                        # Remove language identifier if present
                        lines = part.strip().split('\n')
                        if lines and lines[0].strip() in ['python', 'java', 'cpp', 'javascript', 'c']:
                            return '\n'.join(lines[1:])
                        return part.strip()

            # Look for function definitions
            if any(keyword in response.lower() for keyword in ['def ', 'function', 'class ', 'public class']):
                return response.strip()

            return None

        except Exception as e:
            logger.error(f"Error extracting code: {str(e)}")
            return None

    async def _evaluate_explanation(self, explanation: str, state: AgentState) -> Dict[str, Any]:
        """Evaluate user's explanation or approach"""
        try:
            # Create problem context for evaluation
            problem_title = self.current_problem.get(
                'title', 'Unknown') if self.current_problem else 'Unknown'
            problem_desc = self.current_problem.get(
                'description', 'No description') if self.current_problem else 'No description'

            problem_context = f"""
Problem: {problem_title}
Description: {problem_desc}
User's explanation: {explanation}
"""

            # Use response generator to evaluate explanation
            evaluation_response = await self.response_generator.generate_code_review(
                code="# No code provided, evaluating explanation only",
                problem_context=problem_context
            )

            # Extract feedback from AI response
            feedback = evaluation_response.content if hasattr(
                evaluation_response, 'content') else str(evaluation_response)

            # Basic scoring based on explanation quality
            score = self._score_explanation(explanation)

            return {
                "score": score,
                "feedback": feedback,
                "suggestions": [
                    "Consider providing a code implementation",
                    "Explain your approach step by step",
                    "Discuss time and space complexity"
                ],
                "evaluation_type": "explanation"
            }

        except Exception as e:
            logger.error(f"Error evaluating explanation: {str(e)}")
            return {
                "score": 50,  # Default score
                "feedback": "Thank you for your explanation. Could you provide a code implementation?",
                "suggestions": ["Try implementing your approach in code"],
                "evaluation_type": "explanation"
            }

    async def _evaluate_code_solution(self, code: str, full_response: str, state: AgentState) -> Dict[str, Any]:
        """Evaluate code solution"""
        try:
            # Create comprehensive problem context
            problem_title = self.current_problem.get(
                'title', 'Unknown') if self.current_problem else 'Unknown'
            problem_desc = self.current_problem.get(
                'description', 'No description') if self.current_problem else 'No description'
            problem_difficulty = self.current_problem.get(
                'difficulty', 'Unknown') if self.current_problem else 'Unknown'

            problem_context = f"""
Problem: {problem_title}
Description: {problem_desc}
Difficulty: {problem_difficulty}
Full user response: {full_response}
"""

            # Use response generator for detailed code review
            evaluation_response = await self.response_generator.generate_code_review(
                code=code,
                problem_context=problem_context
            )

            # Basic code analysis
            code_metrics = self._analyze_code_quality(code)

            # Calculate score based on multiple factors
            score = self._calculate_code_score(code, code_metrics)

            feedback = evaluation_response.content if hasattr(
                evaluation_response, 'content') else str(evaluation_response)

            suggestions = self._generate_code_suggestions(code, code_metrics)

            return {
                "score": score,
                "feedback": feedback,
                "suggestions": suggestions,
                "evaluation_type": "code",
                "code_metrics": code_metrics
            }

        except Exception as e:
            logger.error(f"Error evaluating code solution: {str(e)}")
            return {
                "score": 70,  # Default score for code attempt
                "feedback": "Thank you for providing a code solution. Let me review it...",
                "suggestions": ["Consider edge cases", "Think about optimization"],
                "evaluation_type": "code"
            }

    def _score_explanation(self, explanation: str) -> int:
        """Basic scoring for explanations"""
        score = 40  # Base score for providing explanation

        # Check for key elements
        if len(explanation) > 50:
            score += 10
        if any(word in explanation.lower() for word in ['approach', 'algorithm', 'solution']):
            score += 10
        if any(word in explanation.lower() for word in ['time', 'space', 'complexity']):
            score += 15
        if any(word in explanation.lower() for word in ['edge', 'case', 'example']):
            score += 10

        return min(score, 85)  # Cap at 85 for explanation only

    def _analyze_code_quality(self, code: str) -> Dict[str, Any]:
        """Analyze basic code quality metrics"""
        metrics = {
            "has_function_def": bool(any(keyword in code for keyword in ['def ', 'function', 'public '])),
            "has_return_statement": 'return' in code,
            "has_comments": '#' in code or '//' in code or '/*' in code,
            "line_count": len(code.split('\n')),
            "has_error_handling": any(keyword in code.lower() for keyword in ['try', 'catch', 'except', 'if']),
            "uses_variables": any(char in code for char in ['=', 'var ', 'let ', 'int ', 'string ']),
        }
        return metrics

    def _calculate_code_score(self, code: str, metrics: Dict[str, Any]) -> int:
        """Calculate score based on code quality"""
        score = 50  # Base score for providing code

        if metrics['has_function_def']:
            score += 15
        if metrics['has_return_statement']:
            score += 10
        if metrics['has_comments']:
            score += 5
        if metrics['has_error_handling']:
            score += 10
        if 5 <= metrics['line_count'] <= 50:  # Reasonable length
            score += 5
        if metrics['uses_variables']:
            score += 5

        return min(score, 100)

    def _generate_code_suggestions(self, code: str, metrics: Dict[str, Any]) -> List[str]:
        """Generate suggestions based on code analysis"""
        suggestions = []

        if not metrics['has_function_def']:
            suggestions.append("Consider defining a proper function")
        if not metrics['has_return_statement']:
            suggestions.append("Make sure to return the result")
        if not metrics['has_comments']:
            suggestions.append("Add comments to explain your logic")
        if metrics['line_count'] > 50:
            suggestions.append("Try to simplify your solution")
        if not metrics['has_error_handling']:
            suggestions.append("Consider edge cases and error handling")

        # Default suggestions
        if not suggestions:
            suggestions = [
                "Consider the time complexity",
                "Think about space optimization",
                "Test with edge cases"
            ]

        return suggestions


# Factory function for creating DSA Interviewer Agent
def create_dsa_interviewer(
    api_key: Optional[str] = None,
    model_name: Optional[str] = None,
    session_config: Optional[Dict[str, Any]] = None,
    **kwargs
) -> DSAInterviewAgent:
    """
    Factory function to create a DSA Interview Agent with Gemini and all dependencies

    Args:
        api_key: Deprecated, not needed for Gemini (uses GOOGLE_API_KEY from env)
        model_name: Deprecated, Gemini model is configured automatically
        session_config: Interview session configuration
        **kwargs: Additional configuration options

    Returns:
        Configured DSAInterviewAgent instance with Gemini
    """
    try:
        logger.info("🤖 Creating DSA Interviewer Agent with Gemini")

        # Create core components with Gemini
        response_generator = create_response_generator(**kwargs)
        conversation_manager = create_conversation_manager(**kwargs)
        problem_database = create_problem_database(**kwargs)
        interview_state_manager = create_interview_state_manager(**kwargs)

        # Create DSA interviewer agent
        dsa_agent = DSAInterviewAgent(
            response_generator=response_generator,
            conversation_manager=conversation_manager,
            problem_database=problem_database,
            interview_state_manager=interview_state_manager,
            session_config=session_config
        )

        logger.info("✅ DSA Interviewer Agent created successfully with Gemini")
        return dsa_agent

    except Exception as e:
        logger.error(f"Failed to create DSA Interviewer Agent: {str(e)}")
        raise


# Environment variable configuration examples
def get_default_session_config() -> Dict[str, Any]:
    """Get default session configuration for DSA interviews"""
    return {
        "max_problems": int(os.getenv("DSA_MAX_PROBLEMS", "3")),
        "time_limit_minutes": int(os.getenv("DSA_TIME_LIMIT", "45")),
        "hints_per_problem": int(os.getenv("DSA_HINTS_PER_PROBLEM", "3")),
        "difficulty_progression": os.getenv("DSA_DIFFICULTY_PROGRESSION", "true").lower() == "true"
    }
