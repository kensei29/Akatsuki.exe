"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Search,
  ExternalLink,
  CheckCircle,
  Circle,
  Code,
  Trophy,
  TrendingUp,
  Filter,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import {
  getLeetCodeProblems,
  getCodeForcesProblems,
  getUserProgress,
  updateProblemStatus,
  getUserStats,
  searchProblems,
  LeetCodeProblem,
  CodeForcesProblem,
  UserProgress,
  UserStats,
  getDifficultyColor,
  getRatingColor,
  formatTags,
} from "@/lib/problemSheetsApi";

import DashboardLayout from "@/components/layout/DashboardLayout";

interface ProblemSheetProps {
  platform: "leetcode" | "codeforces";
  problems: (LeetCodeProblem | CodeForcesProblem)[];
  userProgress: UserProgress;
  onStatusChange: (problemId: string, completed: boolean) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const ProblemSheet: React.FC<ProblemSheetProps> = ({
  platform,
  problems,
  userProgress,
  onStatusChange,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
}) => {
  const handleStatusToggle = async (problemId: string, completed: boolean) => {
    try {
      await updateProblemStatus(platform, problemId, completed);
      onStatusChange(problemId, completed);
      toast.success(
        `Problem ${completed ? "completed" : "unmarked"} successfully!`
      );
    } catch (error) {
      toast.error("Failed to update problem status");
      console.error("Error updating problem status:", error);
    }
  };

  const openProblemLink = (problem: LeetCodeProblem | CodeForcesProblem) => {
    if ("link" in problem) {
      window.open(problem.link, "_blank");
    } else if ("url" in problem && problem.url) {
      window.open(problem.url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading problems...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead>Problem Name</TableHead>
            {platform === "leetcode" ? (
              <>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Companies</TableHead>
              </>
            ) : (
              <>
                <TableHead>Rating</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Contest</TableHead>
              </>
            )}
            <TableHead className="w-16">Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => {
            const isCompleted = userProgress[problem._id] || false;
            const problemName = problem.name;

            return (
              <TableRow
                key={problem._id}
                className={isCompleted ? "bg-green-50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) =>
                      handleStatusToggle(problem._id, checked as boolean)
                    }
                    className="w-5 h-5"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <button
                    onClick={() => openProblemLink(problem)}
                    className="text-left hover:text-blue-600 transition-colors"
                  >
                    {problemName}
                  </button>
                </TableCell>
                {platform === "leetcode" ? (
                  <>
                    <TableCell>
                      <Badge
                        className={getDifficultyColor(
                          (problem as LeetCodeProblem).difficulty
                        )}
                      >
                        {(problem as LeetCodeProblem).difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {(problem as LeetCodeProblem).main_tag}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatTags((problem as LeetCodeProblem).companies)}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <Badge
                        className={getRatingColor(
                          (problem as CodeForcesProblem).rating
                        )}
                      >
                        {(problem as CodeForcesProblem).rating}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatTags((problem as CodeForcesProblem).tags)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {(problem as CodeForcesProblem).contestId}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openProblemLink(problem)}
                    className="p-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProblemSheetsPage() {
  const [activeTab, setActiveTab] = useState<"leetcode" | "codeforces">(
    "leetcode"
  );
  const [leetcodeProblems, setLeetcodeProblems] = useState<LeetCodeProblem[]>(
    []
  );
  const [codeforcesProblems, setCodeforcesProblems] = useState<
    CodeForcesProblem[]
  >([]);
  const [leetcodeProgress, setLeetcodeProgress] = useState<UserProgress>({});
  const [codeforcesProgress, setCodeforcesProgress] = useState<UserProgress>(
    {}
  );
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Load initial data
  useEffect(() => {
    loadProblems();
    loadUserProgress();
    loadUserStats();
  }, []);

  // Load problems when tab or page changes
  useEffect(() => {
    loadProblems();
  }, [activeTab, currentPage]);

  const loadProblems = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "leetcode") {
        const data = await getLeetCodeProblems(currentPage, 50);
        setLeetcodeProblems(data.problems);
        setTotalPages(data.pagination.total_pages);
      } else {
        const data = await getCodeForcesProblems(currentPage, 50);
        setCodeforcesProblems(data.problems);
        setTotalPages(data.pagination.total_pages);
      }
    } catch (error) {
      toast.error("Failed to load problems");
      console.error("Error loading problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const [leetcodeProgressData, codeforcesProgressData] = await Promise.all([
        getUserProgress("leetcode"),
        getUserProgress("codeforces"),
      ]);
      setLeetcodeProgress(leetcodeProgressData);
      setCodeforcesProgress(codeforcesProgressData);
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const handleStatusChange = (problemId: string, completed: boolean) => {
    if (activeTab === "leetcode") {
      setLeetcodeProgress((prev) => ({
        ...prev,
        [problemId]: completed,
      }));
    } else {
      setCodeforcesProgress((prev) => ({
        ...prev,
        [problemId]: completed,
      }));
    }
    // Reload stats
    loadUserStats();
  };

  const handleSearch = async () => {
    if (
      !searchQuery.trim() &&
      (!difficultyFilter || difficultyFilter === "all")
    ) {
      loadProblems();
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchProblems(
        activeTab,
        searchQuery,
        difficultyFilter === "all" ? "" : difficultyFilter,
        1,
        50
      );

      if (activeTab === "leetcode") {
        setLeetcodeProblems(data.problems as LeetCodeProblem[]);
      } else {
        setCodeforcesProblems(data.problems as CodeForcesProblem[]);
      }
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Search failed");
      console.error("Error searching problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setDifficultyFilter("all");
    setCurrentPage(1);
    loadProblems();
  };

  const currentProgress =
    activeTab === "leetcode" ? leetcodeProgress : codeforcesProgress;
  const currentProblems =
    activeTab === "leetcode" ? leetcodeProblems : codeforcesProblems;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Problem Sheets</h1>
            <p className="text-gray-600 mt-1">
              Track your progress on LeetCode and CodeForces problems
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  LeetCode Progress
                </CardTitle>
                <Code className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {userStats.leetcode.completed}/{userStats.leetcode.total}
                </div>
                <Progress
                  value={userStats.leetcode.percentage}
                  className="mt-2"
                />
                <p className="text-xs text-gray-600 mt-1">
                  {userStats.leetcode.percentage}% completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  CodeForces Progress
                </CardTitle>
                <Trophy className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.codeforces.completed}/{userStats.codeforces.total}
                </div>
                <Progress
                  value={userStats.codeforces.percentage}
                  className="mt-2"
                />
                <p className="text-xs text-gray-600 mt-1">
                  {userStats.codeforces.percentage}% completed
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search problems by name or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              {activeTab === "leetcode" && (
                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem Sheets Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Sheets</CardTitle>
            <CardDescription>
              Click on problem names to open them in a new tab. Use checkboxes
              to track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as "leetcode" | "codeforces");
                setCurrentPage(1);
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="leetcode"
                  className="flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  LeetCode
                </TabsTrigger>
                <TabsTrigger
                  value="codeforces"
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  CodeForces
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leetcode" className="mt-6">
                <ProblemSheet
                  platform="leetcode"
                  problems={currentProblems}
                  userProgress={currentProgress}
                  onStatusChange={handleStatusChange}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="codeforces" className="mt-6">
                <ProblemSheet
                  platform="codeforces"
                  problems={currentProblems}
                  userProgress={currentProgress}
                  onStatusChange={handleStatusChange}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
