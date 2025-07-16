/**
 * Problem Sheets API Service
 *
 * API functions for interacting with LeetCode and CodeForces problem sheets,
 * including progress tracking and search functionality.
 *
 * Author: AI Mock Interview Platform Team
 * Date: July 2025
 */

import { getAuthToken } from "./api";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// HTTP client for problem sheets API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return await response.json();
}

// Types for Problem Sheets
export interface LeetCodeProblem {
  _id: string;
  name: string;
  link: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  main_tag: string;
  other_tags?: string[];
  companies?: string[];
  problem_number: number;
  created_at: string;
  updated_at: string;
}

export interface CodeForcesProblem {
  _id: string;
  problem_id: string;
  contestId: number;
  index: string;
  name: string;
  type: string;
  points?: number;
  rating?: number;
  tags?: string[];
  url?: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProblemsResponse<T> {
  problems: T[];
  pagination: PaginationInfo;
}

export interface UserProgress {
  [problemId: string]: boolean;
}

export interface UserStats {
  leetcode: {
    completed: number;
    total: number;
    percentage: number;
  };
  codeforces: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface ProblemStatusUpdate {
  problem_id: string;
  completed: boolean;
}

/**
 * Get LeetCode problems with pagination
 */
export const getLeetCodeProblems = async (
  page: number = 1,
  limit: number = 50
): Promise<ProblemsResponse<LeetCodeProblem>> => {
  const response = await apiRequest<{
    data: ProblemsResponse<LeetCodeProblem>;
  }>(`/api/v1/problem-sheets/leetcode?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Get CodeForces problems with pagination
 */
export const getCodeForcesProblems = async (
  page: number = 1,
  limit: number = 50
): Promise<ProblemsResponse<CodeForcesProblem>> => {
  const response = await apiRequest<{
    data: ProblemsResponse<CodeForcesProblem>;
  }>(`/api/v1/problem-sheets/codeforces?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Get user's progress for a specific platform
 */
export const getUserProgress = async (
  platform: "leetcode" | "codeforces"
): Promise<UserProgress> => {
  const response = await apiRequest<{ data: UserProgress }>(
    `/api/v1/problem-sheets/progress/${platform}`
  );
  return response.data;
};

/**
 * Update problem completion status
 */
export const updateProblemStatus = async (
  platform: "leetcode" | "codeforces",
  problemId: string,
  completed: boolean
): Promise<void> => {
  await apiRequest(`/api/v1/problem-sheets/progress/${platform}`, {
    method: "PUT",
    body: JSON.stringify({
      problem_id: problemId,
      completed,
    }),
  });
};

/**
 * Get user's overall statistics
 */
export const getUserStats = async (): Promise<UserStats> => {
  const response = await apiRequest<{ data: UserStats }>(
    "/api/v1/problem-sheets/stats"
  );
  return response.data;
};

/**
 * Search problems by query, difficulty, etc.
 */
export const searchProblems = async (
  platform: "leetcode" | "codeforces",
  query?: string,
  difficulty?: string,
  page: number = 1,
  limit: number = 50
): Promise<ProblemsResponse<LeetCodeProblem | CodeForcesProblem>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (query) params.append("query", query);
  if (difficulty) params.append("difficulty", difficulty);

  const response = await apiRequest<{
    data: ProblemsResponse<LeetCodeProblem | CodeForcesProblem>;
  }>(`/api/v1/problem-sheets/search/${platform}?${params.toString()}`);
  return response.data;
};

/**
 * Get difficulty color for LeetCode problems
 */
export const getDifficultyColor = (
  difficulty: string | undefined | null
): string => {
  if (!difficulty) {
    return "text-gray-600 bg-gray-100";
  }

  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "hard":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Get rating color for CodeForces problems
 */
export const getRatingColor = (rating: number | undefined | null): string => {
  if (rating === undefined || rating === null || isNaN(rating)) {
    return "text-gray-600 bg-gray-100";
  }

  if (rating < 1200) return "text-gray-600 bg-gray-100";
  if (rating < 1400) return "text-green-600 bg-green-100";
  if (rating < 1600) return "text-cyan-600 bg-cyan-100";
  if (rating < 1900) return "text-blue-600 bg-blue-100";
  if (rating < 2100) return "text-purple-600 bg-purple-100";
  if (rating < 2400) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
};

/**
 * Format problem tags for display
 */
export const formatTags = (tags: string[] | undefined | null): string => {
  // Handle undefined, null, or empty arrays
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return "No tags";
  }

  return tags.slice(0, 3).join(", ") + (tags.length > 3 ? "..." : "");
};
