"""
Database Package

MongoDB integration for the AI Mock Interview Platform.
"""

from .config import DatabaseConfig, db_config, get_database
from .models import UserDocument, InterviewSessionDocument, InterviewMessageDocument
from .repositories import UserRepository, get_user_repository

__all__ = [
    "DatabaseConfig",
    "db_config",
    "get_database",
    "UserDocument",
    "InterviewSessionDocument",
    "InterviewMessageDocument",
    "UserRepository",
    "get_user_repository"
]
