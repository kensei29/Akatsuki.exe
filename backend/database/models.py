"""
Database Models

Pydantic models for MongoDB collections in the AI Mock Interview Platform.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid


class UserDocument(BaseModel):
    """User document model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    password_hash: Optional[str] = None  # Added for authentication
    college: Optional[str] = None
    year: Optional[int] = None
    preferences: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    interview_count: int = 0


class InterviewSessionDocument(BaseModel):
    """Interview session document model for MongoDB"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    id: Optional[str] = Field(default=None, alias="_id")
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    interview_type: str
    status: str  # created, active, completed, failed
    difficulty: Optional[str] = None
    category: Optional[str] = None
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_description: Optional[str] = None
    conversation_history: List[Dict[str, Any]] = Field(default_factory=list)
    code_submissions: List[Dict[str, Any]] = Field(default_factory=list)
    feedback: Optional[Dict[str, Any]] = None
    score: Optional[float] = None
    duration_minutes: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class InterviewMessageDocument(BaseModel):
    """Individual message within an interview session"""
    model_config = ConfigDict(arbitrary_types_allowed=True)

    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    sender: str  # user, interviewer
    message_type: str  # text, code, feedback
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)
