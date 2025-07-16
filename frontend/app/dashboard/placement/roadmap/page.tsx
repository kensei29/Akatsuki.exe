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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Target,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";

const roadmapItems = [
  {
    id: 1,
    title: "Resume Building",
    description: "Create a professional resume that stands out",
    completed: true,
    dueDate: "2024-01-15",
    priority: "high",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Master fundamental DSA concepts",
    completed: true,
    dueDate: "2024-02-01",
    priority: "high",
  },
  {
    id: 3,
    title: "System Design Basics",
    description: "Learn scalable system architecture",
    completed: false,
    dueDate: "2024-02-15",
    priority: "high",
  },
  {
    id: 4,
    title: "Mock Interviews",
    description: "Practice with AI interviewer",
    completed: false,
    dueDate: "2024-02-20",
    priority: "medium",
  },
  {
    id: 5,
    title: "Company Research",
    description: "Research target companies",
    completed: false,
    dueDate: "2024-02-25",
    priority: "medium",
  },
  {
    id: 6,
    title: "Behavioral Questions",
    description: "Prepare STAR method responses",
    completed: false,
    dueDate: "2024-03-01",
    priority: "high",
  },
];

export default function RoadmapPage() {
  const router = useRouter();

  const completedItems = roadmapItems.filter((item) => item.completed).length;
  const progressPercentage = (completedItems / roadmapItems.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

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
            <Target className="h-8 w-8 text-blue-600" />
            Placement Roadmap
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress through essential placement preparation milestones
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Progress
            </CardTitle>
            <CardDescription>
              Your journey towards placement readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completedItems} of {roadmapItems.length} completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(progressPercentage)}%
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  Complete
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Items */}
        <div className="space-y-4">
          {roadmapItems.map((item) => (
            <Card
              key={item.id}
              className={`transition-all duration-200 ${
                item.completed
                  ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500"
                  : "hover:shadow-lg border-l-4 border-l-gray-200 dark:border-l-gray-700"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`text-lg font-semibold ${
                          item.completed
                            ? "text-green-900 dark:text-green-100 line-through"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority} priority
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {!item.completed && (
                      <Button variant="outline" className="mr-2">
                        Start
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
