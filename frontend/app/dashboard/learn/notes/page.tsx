"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  Calendar,
  Download,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  FileText,
  Tag,
  BarChart3,
  Brain,
} from "lucide-react";

// Mock aggregated notes data across all subjects
const allSubjectsNotes = {
  DSA: {
    subject: "DSA",
    totalSessions: 5,
    totalInteractions: 35,
    lastStudied: "2025-07-17",
    importantNotes: 2,
    topics: ["Arrays", "Linked Lists", "Hash Tables", "BST"],
    recentSession: "Array and Linked List Concepts",
  },
  OOP: {
    subject: "OOP",
    totalSessions: 3,
    totalInteractions: 20,
    lastStudied: "2025-07-17",
    importantNotes: 1,
    topics: ["Inheritance", "Polymorphism", "Encapsulation"],
    recentSession: "Inheritance and Polymorphism",
  },
  DBMS: {
    subject: "DBMS",
    totalSessions: 2,
    totalInteractions: 14,
    lastStudied: "2025-07-16",
    importantNotes: 0,
    topics: ["SQL Joins", "Normalization", "Indexing"],
    recentSession: "SQL Joins and Normalization",
  },
  CN: {
    subject: "CN",
    totalSessions: 1,
    totalInteractions: 8,
    lastStudied: "2025-07-15",
    importantNotes: 0,
    topics: ["TCP/IP", "Network Protocols"],
    recentSession: "Network Protocol Basics",
  },
  OS: {
    subject: "OS",
    totalSessions: 2,
    totalInteractions: 16,
    lastStudied: "2025-07-15",
    importantNotes: 1,
    topics: ["Process Management", "Memory Management"],
    recentSession: "Process Scheduling Algorithms",
  },
  ML: {
    subject: "ML",
    totalSessions: 1,
    totalInteractions: 12,
    lastStudied: "2025-07-14",
    importantNotes: 1,
    topics: ["Supervised Learning", "Feature Selection"],
    recentSession: "Introduction to Supervised Learning",
  },
};

export default function AllNotesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "sessions" | "interactions">(
    "recent"
  );

  const subjects = Object.values(allSubjectsNotes);

  // Calculate overall stats
  const totalSessions = subjects.reduce(
    (acc, subject) => acc + subject.totalSessions,
    0
  );
  const totalInteractions = subjects.reduce(
    (acc, subject) => acc + subject.totalInteractions,
    0
  );
  const totalImportant = subjects.reduce(
    (acc, subject) => acc + subject.importantNotes,
    0
  );
  const activeSubjects = subjects.filter(
    (subject) => subject.totalSessions > 0
  ).length;

  // Filter and sort subjects
  const filteredSubjects = subjects
    .filter(
      (subject) =>
        subject.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.topics.some((topic) =>
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "sessions":
          return b.totalSessions - a.totalSessions;
        case "interactions":
          return b.totalInteractions - a.totalInteractions;
        case "recent":
        default:
          return (
            new Date(b.lastStudied).getTime() -
            new Date(a.lastStudied).getTime()
          );
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/learn")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Learning Hub</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Study Notes</h1>
              <p className="text-sm text-gray-500">
                Your complete learning journey across all subjects
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalSessions}
              </div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalInteractions}
              </div>
              <div className="text-sm text-gray-600">Total Interactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {activeSubjects}
              </div>
              <div className="text-sm text-gray-600">Active Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalImportant}
              </div>
              <div className="text-sm text-gray-600">Important Notes</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects or topics..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="sessions">Most Sessions</option>
                <option value="interactions">Most Interactions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No study notes found
              </h3>
              <p className="text-gray-500 mb-4">
                Start learning to create your first notes!
              </p>
              <Button onClick={() => router.push("/dashboard/learn")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Subjects
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <Card
                  key={subject.subject}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/learn/notes/${subject.subject}`)
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {subject.subject}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        {subject.importantNotes > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">
                              {subject.importantNotes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {subject.recentSession}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">
                          {subject.totalSessions}
                        </div>
                        <div className="text-xs text-gray-500">Sessions</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {subject.totalInteractions}
                        </div>
                        <div className="text-xs text-gray-500">Q&As</div>
                      </div>
                    </div>

                    {/* Topics */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Recent Topics:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {subject.topics.slice(0, 3).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                        {subject.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{subject.topics.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Last Studied */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Last studied</span>
                      </div>
                      <span>{formatDate(subject.lastStudied)}</span>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/dashboard/learn/notes/${subject.subject}`
                        );
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Notes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
