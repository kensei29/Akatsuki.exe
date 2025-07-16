/**
 * Interview Session Context
 * Manages real-time interview sessions with AI backend
 */

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  createInterview,
  startInterview,
  sendInterviewMessage,
  getInterviewStatus,
  endInterview,
  InterviewSession,
  InterviewMessageResponse,
  APIError,
  handleAPIError,
} from "@/lib/api";
import { useApp } from "./AppContext";

interface InterviewState {
  session: InterviewSession | null;
  messages: InterviewMessage[];
  currentQuestion: string | null;
  currentQuestionNumber: number;
  totalQuestions: number;
  isLoading: boolean;
  error: string | null;
  sessionStarted: boolean;
  sessionCompleted: boolean;
  interviewPhase: string;
  suggestions: string[];
  currentScore: number;
}

interface InterviewMessage {
  id: string;
  type: "question" | "answer" | "feedback" | "system";
  content: string;
  timestamp: Date;
  sender: "ai" | "user" | "system";
  questionNumber?: number;
}

type InterviewAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "SESSION_CREATED"; payload: InterviewSession }
  | { type: "SESSION_STARTED"; payload: InterviewSession }
  | { type: "SESSION_ENDED"; payload: InterviewSession }
  | { type: "MESSAGE_SENT"; payload: InterviewMessage }
  | { type: "AI_RESPONSE"; payload: InterviewMessageResponse }
  | { type: "RESET_SESSION" };

const initialState: InterviewState = {
  session: null,
  messages: [],
  currentQuestion: null,
  currentQuestionNumber: 0,
  totalQuestions: 5, // Default to 5 questions
  isLoading: false,
  error: null,
  sessionStarted: false,
  sessionCompleted: false,
  interviewPhase: "introduction",
  suggestions: [],
  currentScore: 0,
};

const interviewReducer = (
  state: InterviewState,
  action: InterviewAction
): InterviewState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "SESSION_CREATED":
      return {
        ...state,
        session: action.payload,
        isLoading: false,
        error: null,
      };

    case "SESSION_STARTED":
      return {
        ...state,
        session: action.payload,
        sessionStarted: true,
        isLoading: false,
        error: null,
        messages: [
          {
            id: "start",
            type: "system",
            content:
              "Interview session started. The AI interviewer will now ask you questions.",
            timestamp: new Date(),
            sender: "system",
          },
        ],
      };

    case "SESSION_ENDED":
      return {
        ...state,
        session: action.payload,
        sessionCompleted: true,
        isLoading: false,
        messages: [
          ...state.messages,
          {
            id: "end",
            type: "system",
            content:
              "Interview session completed. Thank you for participating!",
            timestamp: new Date(),
            sender: "system",
          },
        ],
      };

    case "MESSAGE_SENT":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isLoading: true, // Will be set to false when AI responds
      };

    case "AI_RESPONSE":
      console.log("Processing AI_RESPONSE:", action.payload); // Debug log

      const aiMessage: InterviewMessage = {
        id: `ai_${Date.now()}`,
        type: action.payload.response_type as any,
        content: action.payload.response,
        timestamp: new Date(),
        sender: "ai",
        questionNumber: state.currentQuestionNumber,
      };

      console.log("Created AI message:", aiMessage); // Debug log

      return {
        ...state,
        messages: [...state.messages, aiMessage],
        currentQuestion:
          action.payload.response_type === "question"
            ? action.payload.response
            : state.currentQuestion,
        interviewPhase: action.payload.interview_phase || state.interviewPhase,
        suggestions: action.payload.suggestions || [],
        currentScore: action.payload.score_update || state.currentScore,
        currentQuestionNumber:
          action.payload.response_type === "question"
            ? state.currentQuestionNumber + 1
            : state.currentQuestionNumber,
        isLoading: false,
      };

    case "RESET_SESSION":
      return initialState;

    default:
      return state;
  }
};

const InterviewContext = createContext<{
  state: InterviewState;
  createSession: (difficulty?: string) => Promise<void>;
  startSession: () => Promise<void>;
  sendMessage: (content: string, messageType?: string) => Promise<void>;
  endSession: () => Promise<void>;
  resetSession: () => void;
} | null>(null);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  const { state: appState } = useApp();

  const createSession = async (difficulty: string = "medium") => {
    if (!appState.user) {
      dispatch({
        type: "SET_ERROR",
        payload: "User must be logged in to start interview",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const session = await createInterview({
        user_id: appState.user.id,
        interview_type: "dsa", // Default to DSA interview type
        difficulty,
      });

      dispatch({ type: "SESSION_CREATED", payload: session });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const startSession = async () => {
    if (!state.session || !appState.user) {
      dispatch({
        type: "SET_ERROR",
        payload: "No active session or user not logged in",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const updatedSession = await startInterview(state.session.id, {
        user_id: appState.user.id,
      });

      dispatch({ type: "SESSION_STARTED", payload: updatedSession });

      // Send initial message to get first question
      await sendMessage("Hello, I'm ready to start the interview.", "start");
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const sendMessage = async (
    content: string,
    messageType: string = "response"
  ) => {
    if (!state.session) {
      dispatch({ type: "SET_ERROR", payload: "No active session" });
      return;
    }

    // Add user message first
    const userMessage: InterviewMessage = {
      id: `user_${Date.now()}`,
      type: messageType as any,
      content,
      timestamp: new Date(),
      sender: "user",
      questionNumber: state.currentQuestionNumber,
    };

    dispatch({ type: "MESSAGE_SENT", payload: userMessage });

    try {
      const response = await sendInterviewMessage(state.session.id, {
        content,
        message_type: messageType as any,
      });

      console.log("API Response:", response); // Debug log
      dispatch({ type: "AI_RESPONSE", payload: response });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const endSession = async () => {
    if (!state.session) {
      dispatch({ type: "SET_ERROR", payload: "No active session" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const finalSession = await endInterview(state.session.id);
      dispatch({ type: "SESSION_ENDED", payload: finalSession });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const resetSession = () => {
    dispatch({ type: "RESET_SESSION" });
  };

  return (
    <InterviewContext.Provider
      value={{
        state,
        createSession,
        startSession,
        sendMessage,
        endSession,
        resetSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within InterviewProvider");
  }
  return context;
};
