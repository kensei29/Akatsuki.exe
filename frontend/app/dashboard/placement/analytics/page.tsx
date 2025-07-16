"use client";

import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Target,
  Code,
  Video,
  Calendar,
  Trophy,
} from "lucide-react";

const analyticsData = {
  weeklyProgress: [
    { day: "Mon", problems: 5, interviews: 0 },
    { day: "Tue", problems: 8, interviews: 1 },
    { day: "Wed", problems: 3, interviews: 0 },
    { day: "Thu", problems: 12, interviews: 0 },
    { day: "Fri", problems: 7, interviews: 1 },
    { day: "Sat", problems: 15, interviews: 0 },
    { day: "Sun", problems: 4, interviews: 1 },
  ],
  skillProgress: [
    { skill: "Arrays & Strings", progress: 85, problems: 45 },
    { skill: "Dynamic Programming", progress: 65, problems: 32 },
    { skill: "Trees & Graphs", progress: 78, problems: 38 },
    { skill: "System Design", progress: 45, problems: 18 },
    { skill: "Database Design", progress: 72, problems: 25 },
  ],
  platformStats: [
    { platform: "LeetCode", solved: 145, total: 200, streak: 12 },
    { platform: "CodeForces", solved: 67, total: 100, streak: 5 },
    { platform: "HackerRank", solved: 89, total: 120, streak: 8 },
  ],
};

export default function AnalyticsPage() {
  const router = useRouter();

  const totalProblemsThisWeek = analyticsData.weeklyProgress.reduce(
    (sum, day) => sum + day.problems,
    0
  );
  const totalInterviewsThisWeek = analyticsData.weeklyProgress.reduce(
    (sum, day) => sum + day.interviews,
    0
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/placement")}
            className="mb-4 p-2 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Placement
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your placement preparation progress and performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Code className="h-4 w-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProblemsThisWeek}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Problems solved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalInterviewsThisWeek}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                82%
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Days active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>
              Your daily problem solving and interview practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {analyticsData.weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {day.day}
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">
                        {day.problems}
                      </div>
                      <div className="text-xs text-blue-600">Problems</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-600">
                        {day.interviews}
                      </div>
                      <div className="text-xs text-purple-600">Interviews</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skill Progress
            </CardTitle>
            <CardDescription>
              Your mastery level across different technical areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analyticsData.skillProgress.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {skill.skill}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {skill.progress}%
                      </span>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {skill.problems} problems
                      </div>
                    </div>
                  </div>
                  <Progress value={skill.progress} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Platform Statistics
            </CardTitle>
            <CardDescription>
              Your progress across different coding platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analyticsData.platformStats.map((platform, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {platform.platform}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="text-sm font-medium">
                          {platform.solved}/{platform.total}
                        </span>
                      </div>
                      <Progress
                        value={(platform.solved / platform.total) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Current Streak
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {platform.streak} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
