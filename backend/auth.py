"""
JWT Authentication utilities for the AI Mock Interview Platform

Handles JWT token creation, validation, and user authentication.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

import os
from jose import JWTError, jwt  # python-jose library
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from pydantic import BaseModel

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "your_secret_key_change_in_production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Security scheme
security = HTTPBearer()

# Pydantic models


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Password utilities


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

# JWT utilities


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + \
            timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY,
                             algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> TokenData:
    """Verify and decode a JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: Optional[str] = payload.get("sub")
        email: Optional[str] = payload.get("email")

        if user_id is None:
            raise credentials_exception

        token_data = TokenData(user_id=user_id, email=email)
        return token_data

    except JWTError:
        raise credentials_exception


async def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """Dependency to get current user from JWT token"""
    return verify_token(credentials.credentials)

# Optional: Get current user from database


async def get_current_user(token_data: TokenData = Depends(get_current_user_token)):
    """Dependency to get current user from token (can be extended to fetch from DB)"""
    return token_data
