"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  User as APIUser,
  loginUser as loginUserAPI,
  registerUser as registerUserAPI,
  getCurrentUser,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  APIError,
  handleAPIError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/lib/api";

interface User extends APIUser {
  // Extend API User with additional frontend properties
  avatar?: string;
  college?: string;
  year?: number; // Changed to match API type
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  notifications: any[];
  sidebarCollapsed: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Track if auth state is initialized
}

type AppAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_NOTIFICATIONS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_INITIALIZED"; payload: boolean };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  notifications: [],
  sidebarCollapsed: false,
  loading: false,
  error: null,
  isInitialized: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_INITIALIZED":
      return {
        ...state,
        isInitialized: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // API action helpers
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (userData: RegisterRequest) => Promise<void>;
  logoutUser: () => void;
  initializeAuth: () => Promise<void>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize authentication state on app load
  const initializeAuth = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const user = await getCurrentUser();

        // Extend with frontend properties
        const enhancedUser: User = {
          ...user,
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        };

        dispatch({ type: "LOGIN", payload: enhancedUser });
      } catch (error) {
        // Token might be invalid, remove it
        removeAuthToken();
        dispatch({ type: "LOGOUT" });
      }
    }
    dispatch({ type: "SET_INITIALIZED", payload: true });
  };

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await loginUserAPI({ email, password });

      // Store the token
      setAuthToken(response.access_token);

      // Extend with frontend properties
      const enhancedUser: User = {
        ...response.user,
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      };

      dispatch({ type: "LOGIN", payload: enhancedUser });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const registerUser = async (userData: RegisterRequest) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await registerUserAPI(userData);

      // Store the token
      setAuthToken(response.access_token);

      // Extend with frontend properties
      const enhancedUser: User = {
        ...response.user,
        avatar: undefined, // No default avatar for new users
      };

      dispatch({ type: "LOGIN", payload: enhancedUser });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const logoutUser = () => {
    removeAuthToken();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        loginUser,
        registerUser,
        logoutUser,
        initializeAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
