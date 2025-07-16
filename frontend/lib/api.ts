/**
 * API Service Layer for Frontend-Backend Communication
 * Handles all HTTP requests to the FastAPI backend
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Token storage utilities
const TOKEN_KEY = "ai_interview_token";

export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Request/Response Types matching backend models

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  college?: string;
  year?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  name: string; // Changed from full_name to match backend
  email: string;
  college?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string; // Changed from full_name to match backend
  email: string;
  college?: string;
  year?: number;
  password?: string;
}

export interface UserStats {
  user_id: string;
  total_interviews: number;
  total_time_minutes: number;
  average_score: number;
  interviews_by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  recent_interviews: InterviewSession[];
}

export interface InterviewSession {
  id: string;
  user_id: string;
  interview_type: string;
  status: "pending" | "active" | "completed" | "cancelled";
  created_at: string;
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  score?: number;
  difficulty?: "easy" | "medium" | "hard";
  problem_title?: string;
  feedback?: string;
}

export interface CreateInterviewRequest {
  user_id: string;
  interview_type: string;
  difficulty?: string;
}

export interface StartInterviewRequest {
  user_id: string;
}

export interface InterviewMessage {
  content: string;
  message_type?: "question" | "response" | "code" | "clarification";
}

export interface InterviewMessageResponse {
  session_id: string;
  response: string;
  response_type: string;
  interview_phase?: string;
  suggestions?: string[];
  score_update?: number;
}

// Backend response format (different from frontend format)
interface BackendMessageResponse {
  session_id: string;
  ai_message: string;
  current_phase: string;
  suggested_actions: string[];
  is_session_complete: boolean;
  timestamp: string;
}

// Error handling
export class APIError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = "APIError";
  }
}

// HTTP client with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get auth token and add to headers
  const token = getAuthToken();
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network or parsing errors
    throw new APIError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      0,
      error
    );
  }
}

// API Service Functions

// Authentication
export const loginUser = async (
  loginData: LoginRequest
): Promise<AuthResponse> => {
  return apiRequest("/api/v1/users/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export const registerUser = async (
  registerData: RegisterRequest
): Promise<AuthResponse> => {
  return apiRequest("/api/v1/users/register", {
    method: "POST",
    body: JSON.stringify(registerData),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiRequest("/api/v1/users/me");
};

// Health Check
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
}> => {
  return apiRequest("/api/v1/health");
};

// User Management
export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  return apiRequest("/api/v1/users/create", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getUser = async (userId: string): Promise<User> => {
  return apiRequest(`/api/v1/users/${userId}`);
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  return apiRequest(`/api/v1/users/${userId}/stats`);
};

// Backend response types
interface SessionResponse {
  session_id: string;
  status: string;
  message: string;
  current_phase: string;
  suggested_actions: string[];
  created_at: string;
}

// Interview Management
export const createInterview = async (
  interviewData: CreateInterviewRequest
): Promise<InterviewSession> => {
  const response = (await apiRequest("/api/v1/interviews/create", {
    method: "POST",
    body: JSON.stringify(interviewData),
  })) as SessionResponse;

  // Map backend SessionResponse to frontend InterviewSession format
  return {
    id: response.session_id,
    user_id: interviewData.user_id,
    interview_type: interviewData.interview_type,
    status:
      response.status === "created" ? "pending" : (response.status as any),
    created_at: response.created_at,
    difficulty:
      (interviewData.difficulty as "easy" | "medium" | "hard") || "medium",
  };
};

interface MessageResponse {
  session_id: string;
  ai_message: string;
  current_phase: string;
  suggested_actions: string[];
  is_session_complete: boolean;
  timestamp: string;
}

export const startInterview = async (
  sessionId: string,
  startData: StartInterviewRequest
): Promise<InterviewSession> => {
  const response = (await apiRequest(`/api/v1/interviews/${sessionId}/start`, {
    method: "POST",
    body: JSON.stringify(startData),
  })) as MessageResponse;

  // Map backend MessageResponse to frontend InterviewSession format
  // For start interview, we mainly need to preserve the session ID and update status
  return {
    id: response.session_id,
    user_id: startData.user_id,
    interview_type: "dsa", // Default, would be better to pass this from context
    status: "active",
    created_at: new Date().toISOString(),
    started_at: response.timestamp,
  };
};

export const sendInterviewMessage = async (
  sessionId: string,
  message: InterviewMessage
): Promise<InterviewMessageResponse> => {
  // Convert frontend message format to backend format
  const backendMessage = {
    message: message.content,
  };

  const backendResponse = (await apiRequest(
    `/api/v1/interviews/${sessionId}/message`,
    {
      method: "POST",
      body: JSON.stringify(backendMessage),
    }
  )) as BackendMessageResponse;

  // Map backend response format to frontend format
  return {
    session_id: backendResponse.session_id,
    response: backendResponse.ai_message, // Map ai_message to response
    response_type: backendResponse.current_phase || "response", // Map current_phase to response_type
    interview_phase: backendResponse.current_phase,
    suggestions: backendResponse.suggested_actions || [],
    score_update: undefined, // Backend doesn't return score in message response
  };
};

export const getInterviewStatus = async (
  sessionId: string
): Promise<InterviewSession> => {
  return apiRequest(`/api/v1/interviews/${sessionId}/status`);
};

export const endInterview = async (
  sessionId: string
): Promise<InterviewSession> => {
  return apiRequest(`/api/v1/interviews/${sessionId}/end`, {
    method: "POST",
  });
};

// Utility functions for frontend
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};

export const handleAPIError = (error: unknown): string => {
  if (isAPIError(error)) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "Permission denied.";
      case 404:
        return "Resource not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
};

// Mock data helper (to be removed after integration)
export const isMockMode =
  process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;
