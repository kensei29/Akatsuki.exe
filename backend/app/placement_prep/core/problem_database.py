"""
Problem Database Integration for AI-Based Mock Interview Platform

Manages problem data, categorization, difficulty progression, and LeetCode integration.
Provides intelligent problem selection based on user performance and interview type.

Author: AI Mock Interview Platform Team
Date: January 2025
"""

import asyncio
import logging
from typing import Optional, Dict, Any, List, Set
from enum import Enum
import json
import random
from dataclasses import dataclass
from pathlib import Path

from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ProblemCategory(str, Enum):
    """Categories for DSA problems"""
    ARRAY = "array"
    STRING = "string"
    LINKED_LIST = "linked_list"
    STACK = "stack"
    QUEUE = "queue"
    TREE = "tree"
    GRAPH = "graph"
    DYNAMIC_PROGRAMMING = "dynamic_programming"
    GREEDY = "greedy"
    BACKTRACKING = "backtracking"
    BINARY_SEARCH = "binary_search"
    TWO_POINTERS = "two_pointers"
    SLIDING_WINDOW = "sliding_window"
    HASH_TABLE = "hash_table"
    HEAP = "heap"
    TRIE = "trie"
    MATH = "math"
    BIT_MANIPULATION = "bit_manipulation"


class ProblemDifficulty(str, Enum):
    """Problem difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class CompanyTag(str, Enum):
    """Common company tags for problems"""
    GOOGLE = "google"
    AMAZON = "amazon"
    MICROSOFT = "microsoft"
    FACEBOOK = "facebook"
    APPLE = "apple"
    NETFLIX = "netflix"
    UBER = "uber"
    LINKEDIN = "linkedin"
    TWITTER = "twitter"
    AIRBNB = "airbnb"


@dataclass
class TestCase:
    """Individual test case for a problem"""
    input: Dict[str, Any]
    expected_output: Any
    explanation: Optional[str] = None


@dataclass
class ProblemExample:
    """Example case for a problem"""
    input: str
    output: str
    explanation: Optional[str] = None


class Problem(BaseModel):
    """Complete problem data structure"""
    id: str
    title: str
    slug: str
    difficulty: ProblemDifficulty
    category: ProblemCategory
    subcategories: List[ProblemCategory] = Field(default_factory=list)

    description: str
    examples: List[ProblemExample] = Field(default_factory=list)
    constraints: List[str] = Field(default_factory=list)

    # LeetCode integration
    leetcode_id: Optional[int] = None
    leetcode_url: Optional[str] = None

    # Company and frequency data
    company_tags: List[CompanyTag] = Field(default_factory=list)
    frequency: Optional[float] = None  # 0.0 to 1.0

    # Solution hints and approaches
    hints: List[str] = Field(default_factory=list)
    approaches: List[str] = Field(default_factory=list)
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None

    # Test cases for validation
    test_cases: List[TestCase] = Field(default_factory=list)

    # Metadata
    tags: List[str] = Field(default_factory=list)
    similar_problems: List[str] = Field(default_factory=list)
    prerequisites: List[str] = Field(default_factory=list)

    # Statistics
    acceptance_rate: Optional[float] = None
    total_submissions: Optional[int] = None

    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ProblemFilter(BaseModel):
    """Filter criteria for problem selection"""
    difficulties: Optional[List[ProblemDifficulty]] = None
    categories: Optional[List[ProblemCategory]] = None
    company_tags: Optional[List[CompanyTag]] = None
    min_frequency: Optional[float] = None
    exclude_ids: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    limit: int = 10


class ProblemRecommendation(BaseModel):
    """Problem recommendation with reasoning"""
    problem: Problem
    confidence_score: float = Field(ge=0.0, le=1.0)
    reasoning: str
    estimated_time: int  # in minutes
    prerequisite_topics: List[str] = Field(default_factory=list)


class ProblemDatabaseConfig(BaseModel):
    """Configuration for problem database"""
    data_directory: str = "data/problems"
    enable_leetcode_sync: bool = False
    leetcode_api_key: Optional[str] = None
    default_difficulty_distribution: Dict[str, float] = Field(
        default_factory=lambda: {"easy": 0.3, "medium": 0.5, "hard": 0.2}
    )
    recommendation_algorithm: str = "adaptive"  # "adaptive", "random", "sequential"


class ProblemDatabase:
    """
    Manages problem data and provides intelligent problem selection
    """

    def __init__(self, config: ProblemDatabaseConfig):
        self.config = config
        self.problems: Dict[str, Problem] = {}
        self.category_index: Dict[ProblemCategory, List[str]] = {}
        self.difficulty_index: Dict[ProblemDifficulty, List[str]] = {}
        self.company_index: Dict[CompanyTag, List[str]] = {}

        # User performance tracking for recommendations
        self.user_performance: Dict[str, Dict[str, Any]] = {}

        self._initialize_database()
        logger.info("ProblemDatabase initialized")

    def _initialize_database(self):
        """Initialize database with default problems"""
        # Load problems from data directory if exists
        data_path = Path(self.config.data_directory)
        if data_path.exists():
            self._load_problems_from_directory(data_path)

        # If no problems loaded, create default problems
        if not self.problems:
            self._create_default_problems()

        self._build_indexes()

    def _load_problems_from_directory(self, data_path: Path):
        """Load problems from JSON files in data directory"""
        try:
            for problem_file in data_path.glob("*.json"):
                with open(problem_file, 'r', encoding='utf-8') as f:
                    problem_data = json.load(f)
                    problem = Problem(**problem_data)
                    self.problems[problem.id] = problem

            logger.info(
                f"Loaded {len(self.problems)} problems from {data_path}")
        except Exception as e:
            logger.error(f"Error loading problems: {e}")

    def _create_default_problems(self):
        """Create a set of default problems for testing"""
        default_problems = [
            {
                "id": "two-sum",
                "title": "Two Sum",
                "slug": "two-sum",
                "difficulty": ProblemDifficulty.EASY,
                "category": ProblemCategory.ARRAY,
                "subcategories": [ProblemCategory.HASH_TABLE],
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "examples": [
                    ProblemExample(
                        input="nums = [2,7,11,15], target = 9",
                        output="[0,1]",
                        explanation="Because nums[0] + nums[1] == 9, we return [0, 1]."
                    )
                ],
                "constraints": [
                    "2 <= nums.length <= 10^4",
                    "-10^9 <= nums[i] <= 10^9",
                    "Only one valid answer exists."
                ],
                "leetcode_id": 1,
                "leetcode_url": "https://leetcode.com/problems/two-sum/",
                "company_tags": [CompanyTag.GOOGLE, CompanyTag.AMAZON, CompanyTag.MICROSOFT],
                "frequency": 0.95,
                "hints": [
                    "Think about using a hash map to store numbers you've seen.",
                    "For each number, check if its complement exists in the hash map."
                ],
                "approaches": ["Brute Force O(n²)", "Hash Map O(n)"],
                "time_complexity": "O(n)",
                "space_complexity": "O(n)",
                "acceptance_rate": 0.51,
                "tags": ["fundamentals", "interview-favorite"]
            },
            {
                "id": "add-two-numbers",
                "title": "Add Two Numbers",
                "slug": "add-two-numbers",
                "difficulty": ProblemDifficulty.MEDIUM,
                "category": ProblemCategory.LINKED_LIST,
                "description": "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
                "leetcode_id": 2,
                "company_tags": [CompanyTag.AMAZON, CompanyTag.MICROSOFT],
                "frequency": 0.78,
                "hints": [
                    "Handle carry-over between digits carefully.",
                    "Consider edge cases where lists have different lengths."
                ],
                "time_complexity": "O(max(m,n))",
                "space_complexity": "O(max(m,n))",
                "acceptance_rate": 0.38
            },
            {
                "id": "longest-substring-without-repeating",
                "title": "Longest Substring Without Repeating Characters",
                "slug": "longest-substring-without-repeating-characters",
                "difficulty": ProblemDifficulty.MEDIUM,
                "category": ProblemCategory.STRING,
                "subcategories": [ProblemCategory.SLIDING_WINDOW, ProblemCategory.HASH_TABLE],
                "description": "Given a string s, find the length of the longest substring without repeating characters.",
                "leetcode_id": 3,
                "company_tags": [CompanyTag.AMAZON, CompanyTag.GOOGLE, CompanyTag.FACEBOOK],
                "frequency": 0.82,
                "hints": [
                    "Use sliding window technique.",
                    "Keep track of character positions in a hash map."
                ],
                "time_complexity": "O(n)",
                "space_complexity": "O(min(m,n))",
                "acceptance_rate": 0.33
            },
            {
                "id": "median-of-two-sorted-arrays",
                "title": "Median of Two Sorted Arrays",
                "slug": "median-of-two-sorted-arrays",
                "difficulty": ProblemDifficulty.HARD,
                "category": ProblemCategory.BINARY_SEARCH,
                "subcategories": [ProblemCategory.ARRAY],
                "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
                "leetcode_id": 4,
                "company_tags": [CompanyTag.GOOGLE, CompanyTag.AMAZON],
                "frequency": 0.65,
                "hints": [
                    "Think about binary search to find the partition.",
                    "The time complexity should be O(log(min(m,n)))."
                ],
                "time_complexity": "O(log(min(m,n)))",
                "space_complexity": "O(1)",
                "acceptance_rate": 0.35
            },
            {
                "id": "valid-parentheses",
                "title": "Valid Parentheses",
                "slug": "valid-parentheses",
                "difficulty": ProblemDifficulty.EASY,
                "category": ProblemCategory.STACK,
                "subcategories": [ProblemCategory.STRING],
                "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                "leetcode_id": 20,
                "company_tags": [CompanyTag.AMAZON, CompanyTag.GOOGLE, CompanyTag.MICROSOFT],
                "frequency": 0.88,
                "hints": [
                    "Use a stack to keep track of opening brackets.",
                    "When you encounter a closing bracket, check if it matches the most recent opening bracket."
                ],
                "time_complexity": "O(n)",
                "space_complexity": "O(n)",
                "acceptance_rate": 0.41
            }
        ]

        for problem_data in default_problems:
            problem = Problem(**problem_data)
            self.problems[problem.id] = problem

        logger.info(f"Created {len(default_problems)} default problems")

    def _build_indexes(self):
        """Build indexes for efficient problem lookup"""
        self.category_index.clear()
        self.difficulty_index.clear()
        self.company_index.clear()

        for problem in self.problems.values():
            # Category index
            if problem.category not in self.category_index:
                self.category_index[problem.category] = []
            self.category_index[problem.category].append(problem.id)

            # Subcategory index
            for subcategory in problem.subcategories:
                if subcategory not in self.category_index:
                    self.category_index[subcategory] = []
                self.category_index[subcategory].append(problem.id)

            # Difficulty index
            if problem.difficulty not in self.difficulty_index:
                self.difficulty_index[problem.difficulty] = []
            self.difficulty_index[problem.difficulty].append(problem.id)

            # Company index
            for company in problem.company_tags:
                if company not in self.company_index:
                    self.company_index[company] = []
                self.company_index[company].append(problem.id)

    def get_problem(self, problem_id: str) -> Optional[Problem]:
        """Get a specific problem by ID"""
        return self.problems.get(problem_id)

    def search_problems(self, filter_criteria: ProblemFilter) -> List[Problem]:
        """Search problems based on filter criteria"""
        candidate_ids = set(self.problems.keys())

        # Apply difficulty filter
        if filter_criteria.difficulties:
            difficulty_ids = set()
            for difficulty in filter_criteria.difficulties:
                difficulty_ids.update(
                    self.difficulty_index.get(difficulty, []))
            candidate_ids &= difficulty_ids

        # Apply category filter
        if filter_criteria.categories:
            category_ids = set()
            for category in filter_criteria.categories:
                category_ids.update(self.category_index.get(category, []))
            candidate_ids &= category_ids

        # Apply company filter
        if filter_criteria.company_tags:
            company_ids = set()
            for company in filter_criteria.company_tags:
                company_ids.update(self.company_index.get(company, []))
            candidate_ids &= company_ids

        # Apply frequency filter
        if filter_criteria.min_frequency is not None:
            frequency_ids = {
                pid for pid in candidate_ids
                if self.problems[pid].frequency and self.problems[pid].frequency >= filter_criteria.min_frequency
            }
            candidate_ids &= frequency_ids

        # Apply exclusion filter
        if filter_criteria.exclude_ids:
            candidate_ids -= set(filter_criteria.exclude_ids)

        # Apply tag filter
        if filter_criteria.tags:
            tag_ids = set()
            for tag in filter_criteria.tags:
                tag_ids.update([
                    pid for pid in candidate_ids
                    if tag in self.problems[pid].tags
                ])
            candidate_ids &= tag_ids

        # Get problems and apply limit
        problems = [self.problems[pid] for pid in candidate_ids]

        # Sort by frequency (descending) and then by difficulty
        problems.sort(key=lambda p: (-(p.frequency or 0), p.difficulty.value))

        return problems[:filter_criteria.limit]

    def get_recommendations(
        self,
        user_id: str,
        session_history: List[Dict[str, Any]],
        interview_type: str = "dsa",
        target_difficulty: Optional[ProblemDifficulty] = None
    ) -> List[ProblemRecommendation]:
        """Get intelligent problem recommendations for a user"""

        # Analyze user performance
        user_perf = self._analyze_user_performance(user_id, session_history)

        # Determine target difficulty if not specified
        if not target_difficulty:
            target_difficulty = self._determine_target_difficulty(user_perf)

        # Get candidate problems
        filter_criteria = ProblemFilter(
            difficulties=[target_difficulty],
            exclude_ids=user_perf.get("completed_problems", []),
            limit=20
        )

        candidate_problems = self.search_problems(filter_criteria)

        # Generate recommendations with scoring
        recommendations = []
        for problem in candidate_problems:
            confidence_score = self._calculate_recommendation_score(
                problem, user_perf)
            estimated_time = self._estimate_problem_time(problem, user_perf)
            reasoning = self._generate_recommendation_reasoning(
                problem, user_perf)

            recommendation = ProblemRecommendation(
                problem=problem,
                confidence_score=confidence_score,
                reasoning=reasoning,
                estimated_time=estimated_time
            )
            recommendations.append(recommendation)

        # Sort by confidence score
        recommendations.sort(key=lambda r: r.confidence_score, reverse=True)

        return recommendations[:5]  # Return top 5 recommendations

    def _analyze_user_performance(
        self,
        user_id: str,
        session_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze user performance from session history"""

        performance = {
            "completed_problems": [],
            "attempted_problems": [],
            "strong_categories": [],
            "weak_categories": [],
            "average_time": 0,
            "success_rate": 0,
            "preferred_difficulty": ProblemDifficulty.EASY
        }

        if not session_history:
            return performance

        total_problems = len(session_history)
        successful_problems = 0
        total_time = 0
        category_performance = {}

        for session in session_history:
            problem_id = session.get("problem_id")
            if problem_id:
                performance["attempted_problems"].append(problem_id)

                if session.get("solution_correct", False):
                    performance["completed_problems"].append(problem_id)
                    successful_problems += 1

                # Track time
                time_taken = session.get("time_taken", 0)
                total_time += time_taken

                # Track category performance
                problem = self.get_problem(problem_id)
                if problem:
                    category = problem.category
                    if category not in category_performance:
                        category_performance[category] = {
                            "attempts": 0, "successes": 0}

                    category_performance[category]["attempts"] += 1
                    if session.get("solution_correct", False):
                        category_performance[category]["successes"] += 1

        # Calculate metrics
        performance["success_rate"] = successful_problems / \
            total_problems if total_problems > 0 else 0
        performance["average_time"] = total_time / \
            total_problems if total_problems > 0 else 0

        # Determine strong and weak categories
        for category, stats in category_performance.items():
            success_rate = stats["successes"] / \
                stats["attempts"] if stats["attempts"] > 0 else 0
            if success_rate > 0.7:
                performance["strong_categories"].append(category)
            elif success_rate < 0.3:
                performance["weak_categories"].append(category)

        # Determine preferred difficulty
        if performance["success_rate"] > 0.8:
            performance["preferred_difficulty"] = ProblemDifficulty.MEDIUM
        elif performance["success_rate"] > 0.6:
            performance["preferred_difficulty"] = ProblemDifficulty.EASY
        else:
            performance["preferred_difficulty"] = ProblemDifficulty.EASY

        return performance

    def _determine_target_difficulty(self, user_perf: Dict[str, Any]) -> ProblemDifficulty:
        """Determine appropriate target difficulty for user"""
        success_rate = user_perf.get("success_rate", 0)

        if success_rate > 0.85:
            return ProblemDifficulty.HARD
        elif success_rate > 0.65:
            return ProblemDifficulty.MEDIUM
        else:
            return ProblemDifficulty.EASY

    def _calculate_recommendation_score(
        self,
        problem: Problem,
        user_perf: Dict[str, Any]
    ) -> float:
        """Calculate confidence score for problem recommendation"""
        score = 0.5  # Base score

        # Frequency boost
        if problem.frequency:
            score += problem.frequency * 0.3

        # Category alignment
        strong_categories = user_perf.get("strong_categories", [])
        weak_categories = user_perf.get("weak_categories", [])

        if problem.category in weak_categories:
            score += 0.2  # Practice weak areas
        elif problem.category in strong_categories:
            score += 0.1  # Reinforce strengths

        # Company tag relevance
        if problem.company_tags:
            score += len(problem.company_tags) * 0.05

        # Acceptance rate consideration
        if problem.acceptance_rate:
            if problem.acceptance_rate > 0.5:
                score += 0.1  # More approachable problems

        return min(1.0, score)

    def _estimate_problem_time(
        self,
        problem: Problem,
        user_perf: Dict[str, Any]
    ) -> int:
        """Estimate time needed to solve problem in minutes"""
        base_times = {
            ProblemDifficulty.EASY: 15,
            ProblemDifficulty.MEDIUM: 30,
            ProblemDifficulty.HARD: 45
        }

        base_time = base_times[problem.difficulty]

        # Adjust based on user performance
        avg_time = user_perf.get("average_time", 1800)  # 30 minutes default
        if avg_time > 2400:  # If user typically takes longer
            base_time = int(base_time * 1.3)
        elif avg_time < 1200:  # If user is faster
            base_time = int(base_time * 0.8)

        return base_time

    def _generate_recommendation_reasoning(
        self,
        problem: Problem,
        user_perf: Dict[str, Any]
    ) -> str:
        """Generate reasoning for why this problem is recommended"""
        reasons = []

        # Difficulty reasoning
        success_rate = user_perf.get("success_rate", 0)
        if problem.difficulty == ProblemDifficulty.EASY and success_rate < 0.5:
            reasons.append(
                "Good for building confidence with fundamental concepts")
        elif problem.difficulty == ProblemDifficulty.MEDIUM and success_rate > 0.6:
            reasons.append("Ready to tackle more challenging problems")
        elif problem.difficulty == ProblemDifficulty.HARD and success_rate > 0.8:
            reasons.append("Advanced problem to test mastery")

        # Category reasoning
        weak_categories = user_perf.get("weak_categories", [])
        if problem.category in weak_categories:
            reasons.append(
                f"Practice opportunity for {problem.category.value} problems")

        # Frequency reasoning
        if problem.frequency and problem.frequency > 0.8:
            reasons.append("Frequently asked in technical interviews")

        # Company reasoning
        if problem.company_tags:
            reasons.append(
                f"Popular at {', '.join([tag.value for tag in problem.company_tags[:2]])}")

        return ". ".join(reasons) if reasons else "Well-rounded problem for skill development"

    def add_problem(self, problem: Problem) -> bool:
        """Add a new problem to the database"""
        try:
            self.problems[problem.id] = problem
            self._build_indexes()
            logger.info(f"Added problem: {problem.title}")
            return True
        except Exception as e:
            logger.error(f"Error adding problem: {e}")
            return False

    def update_problem(self, problem_id: str, updates: Dict[str, Any]) -> bool:
        """Update an existing problem"""
        if problem_id not in self.problems:
            return False

        try:
            problem = self.problems[problem_id]
            for key, value in updates.items():
                if hasattr(problem, key):
                    setattr(problem, key, value)

            self._build_indexes()
            logger.info(f"Updated problem: {problem_id}")
            return True
        except Exception as e:
            logger.error(f"Error updating problem: {e}")
            return False

    def get_statistics(self) -> Dict[str, Any]:
        """Get database statistics"""
        total_problems = len(self.problems)

        difficulty_stats = {
            difficulty: len(problems)
            for difficulty, problems in self.difficulty_index.items()
        }

        category_stats = {
            category: len(problems)
            for category, problems in self.category_index.items()
        }

        return {
            "total_problems": total_problems,
            "difficulty_distribution": difficulty_stats,
            "category_distribution": category_stats,
            "companies_covered": len(self.company_index),
            "average_frequency": sum(
                p.frequency for p in self.problems.values() if p.frequency
            ) / total_problems if total_problems > 0 else 0
        }


def create_problem_database(
    data_directory: str = "data/problems",
    **kwargs
) -> ProblemDatabase:
    """Factory function to create ProblemDatabase with default config"""

    config = ProblemDatabaseConfig(
        data_directory=data_directory,
        **kwargs
    )

    return ProblemDatabase(config)
