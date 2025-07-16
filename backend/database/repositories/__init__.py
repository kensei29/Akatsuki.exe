"""
Database Repositories

Repository pattern implementation for MongoDB operations.
"""

from .users import UserRepository, get_user_repository

__all__ = ["UserRepository", "get_user_repository"]
