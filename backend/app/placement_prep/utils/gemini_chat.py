"""
Gemini Chat Utility

Centralized utility for creating and configuring Google Gemini chat instances
using LangChain's ChatGoogleGenerativeAI.

Author: AI Mock Interview Platform Team
Date: July 2025
"""

import os
import logging
from typing import Optional, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI

logger = logging.getLogger(__name__)


def create_gemini_chat(
    model_name: str = "gemini-2.5-flash",
    temperature: float = 0.7,
    max_tokens: Optional[int] = 2048,
    **kwargs: Any
) -> ChatGoogleGenerativeAI:
    """
    Create a configured Gemini chat instance

    Args:
        model_name: Gemini model to use (default: gemini-2.5-flash)
        temperature: Temperature for response randomness (0.0 - 1.0)
        max_tokens: Maximum tokens in response
        **kwargs: Additional parameters for ChatGoogleGenerativeAI

    Returns:
        Configured ChatGoogleGenerativeAI instance
    """
    try:
        # Get API key from environment
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.warning("GOOGLE_API_KEY not found in environment variables")
            logger.info("Please set GOOGLE_API_KEY environment variable")
            raise ValueError("Google API key is required")

        # Configure the chat instance
        chat_config = {
            "model": model_name,
            "temperature": temperature,
            "google_api_key": api_key,
            **kwargs
        }

        if max_tokens:
            chat_config["max_tokens"] = max_tokens

        logger.info(
            f"🤖 Creating Gemini chat instance with model: {model_name}")
        logger.info(f"🌡️ Temperature: {temperature}, Max tokens: {max_tokens}")

        chat = ChatGoogleGenerativeAI(**chat_config)

        logger.info("✅ Gemini chat instance created successfully")
        return chat

    except Exception as e:
        logger.error(f"❌ Failed to create Gemini chat instance: {str(e)}")
        raise


def create_interview_gemini_chat() -> ChatGoogleGenerativeAI:
    """
    Create a Gemini chat instance optimized for interview scenarios

    Returns:
        Configured ChatGoogleGenerativeAI for interviews
    """
    return create_gemini_chat(
        model_name="gemini-2.5-flash",
        temperature=0.7,  # Balanced creativity and consistency
        max_tokens=1024,  # Reasonable response length for interviews
    )


def create_conversation_gemini_chat() -> ChatGoogleGenerativeAI:
    """
    Create a Gemini chat instance optimized for conversation management

    Returns:
        Configured ChatGoogleGenerativeAI for conversation
    """
    return create_gemini_chat(
        model_name="gemini-2.5-flash",
        temperature=0.8,  # Slightly more creative for natural conversation
        max_tokens=2048,  # Longer responses for detailed explanations
    )


def create_response_gemini_chat() -> ChatGoogleGenerativeAI:
    """
    Create a Gemini chat instance optimized for response generation

    Returns:
        Configured ChatGoogleGenerativeAI for response generation
    """
    return create_gemini_chat(
        model_name="gemini-2.5-flash",
        temperature=0.6,  # More consistent for structured responses
        max_tokens=1536,  # Medium length responses
    )


# Available Gemini models
GEMINI_MODELS = {
    "flash": "gemini-2.5-flash",      # Fast, efficient
    "pro": "gemini-1.5-pro",          # High quality, slower
    "flash_8b": "gemini-2.5-flash-8b"  # Smaller, faster
}


def get_available_models() -> Dict[str, str]:
    """
    Get available Gemini models

    Returns:
        Dictionary of model aliases and their full names
    """
    return GEMINI_MODELS.copy()
