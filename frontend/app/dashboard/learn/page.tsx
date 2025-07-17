"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Grid3X3,
  List,
  User,
  BookOpen,
  FileText,
  Calendar,
  Star,
} from "lucide-react";
import { notesData } from "./notes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotesLibrary() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredNotes] = useState(notesData);

  // Mock my notes summary data
  const myNotesStats = {
    totalSessions: 15,
    totalNotes: 42,
    lastStudyDate: "2025-07-17",
    favoriteSubjects: ["DSA", "OOP", "DBMS"],
  };

  const recentNotes = [
    {
      subject: "DSA",
      title: "Array and Linked List Concepts",
      date: "2025-07-17",
      interactions: 12,
    },
    {
      subject: "OOP",
      title: "Inheritance and Polymorphism",
      date: "2025-07-17",
      interactions: 10,
    },
    {
      subject: "DBMS",
      title: "SQL Joins and Normalization",
      date: "2025-07-16",
      interactions: 6,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Learning Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Access master notes, track your progress, and build your personal
              study collection
            </p>
          </div>

          {/* View Controls */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredNotes.length} notes available
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* My Notes Overview Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>My Study Notes</span>
                </CardTitle>
                <CardDescription>
                  Your personalized learning progress and saved conversations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/learn/notes")}
              >
                View All Notes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {myNotesStats.totalSessions}
                </div>
                <div className="text-sm text-gray-600">Study Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {myNotesStats.totalNotes}
                </div>
                <div className="text-sm text-gray-600">Total Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(myNotesStats.lastStudyDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Last Study</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {myNotesStats.favoriteSubjects.length}
                </div>
                <div className="text-sm text-gray-600">Active Subjects</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Recent Study Sessions</span>
              </h4>
              <div className="space-y-2">
                {recentNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/learn/notes/${note.subject}`)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{note.title}</div>
                        <div className="text-sm text-gray-500">
                          {note.subject} • {note.interactions} interactions
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{note.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 group cursor-pointer"
            >
              {viewMode === "grid" ? (
                <>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={note.thumbnail}
                      alt={note.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={getDifficultyColor(note.difficulty)}>
                        {note.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    {/* <div className="flex justify-between items-start mb-2">
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {note.subject}
                                            </Badge>
                                        </div> */}
                    <CardTitle className="text-lg line-clamp-2">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {note.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {note.author}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/dashboard/learn/${note.subject}`,
                            "_blank"
                          )
                        }
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Master Notes
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/dashboard/learn/notes/${note.subject}`,
                            "_blank"
                          )
                        }
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Notes
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={note.thumbnail}
                      alt={note.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {note.subject}
                          </Badge>
                          <Badge
                            className={getDifficultyColor(note.difficulty)}
                          >
                            {note.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">
                        {note.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                        {note.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {note.author}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/dashboard/learn/${note.subject}`,
                              "_blank"
                            )
                          }
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Master Notes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/dashboard/learn/notes/${note.subject}`,
                              "_blank"
                            )
                          }
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          My Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No notes available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Check back later for new notes
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
