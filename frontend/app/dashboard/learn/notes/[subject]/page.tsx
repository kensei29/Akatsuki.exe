"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  StarOff,
  Calendar,
  Download,
  Share,
  BookOpen,
  MessageSquare,
  Clock,
  FileText,
  Tag,
  SortAsc,
  SortDesc,
  Eye,
  Archive,
  Bot,
  User,
} from "lucide-react";
import { notesData } from "../../notes";

// Mock saved chat sessions data
const mockSavedNotes = {
  DSA: [
    {
      id: "1",
      date: "2025-07-17",
      title: "Array and Linked List Concepts",
      sessionLength: 12,
      important: true,
      topics: ["Arrays", "Linked Lists", "Time Complexity"],
      conversations: [
        {
          userQuestion:
            "What's the difference between arrays and linked lists?",
          botResponse:
            "Arrays and linked lists differ in their memory allocation patterns. Arrays store elements in contiguous memory locations, allowing O(1) random access but requiring fixed size allocation. Linked lists use dynamic memory allocation with nodes connected via pointers, offering flexible size but O(n) access time.",
          timestamp: "10:30 AM",
          pageReference: 45,
        },
        {
          userQuestion: "Which is better for frequent insertions?",
          botResponse:
            "For frequent insertions, especially at the beginning or middle, linked lists are generally better with O(1) insertion time if you have the node reference. Arrays require O(n) time for insertions due to element shifting.",
          timestamp: "10:35 AM",
          pageReference: 47,
        },
      ],
    },
    {
      id: "2",
      date: "2025-07-16",
      title: "Hash Tables and Collision Handling",
      sessionLength: 8,
      important: false,
      topics: ["Hash Tables", "Collision Resolution", "Load Factor"],
      conversations: [
        {
          userQuestion: "How do hash tables handle collisions?",
          botResponse:
            "Hash tables handle collisions through several methods: 1) Chaining - storing multiple elements in linked lists at the same index, 2) Open addressing - finding alternative slots using linear/quadratic probing or double hashing.",
          timestamp: "2:15 PM",
          pageReference: 78,
        },
      ],
    },
    {
      id: "3",
      date: "2025-07-15",
      title: "Binary Search Trees",
      sessionLength: 15,
      important: true,
      topics: ["BST", "Tree Traversal", "Balancing"],
      conversations: [
        {
          userQuestion:
            "What are the advantages of BST over linear data structures?",
          botResponse:
            "BSTs provide efficient searching, insertion, and deletion operations with O(log n) average time complexity. They maintain sorted order naturally and support range queries efficiently.",
          timestamp: "4:20 PM",
          pageReference: 92,
        },
      ],
    },
  ],
  OOP: [
    {
      id: "4",
      date: "2025-07-17",
      title: "Inheritance and Polymorphism",
      sessionLength: 10,
      important: true,
      topics: ["Inheritance", "Polymorphism", "Method Overriding"],
      conversations: [
        {
          userQuestion:
            "What's the difference between method overloading and overriding?",
          botResponse:
            "Method overloading occurs when multiple methods have the same name but different parameters (compile-time polymorphism). Method overriding happens when a subclass provides a specific implementation of a method already defined in its parent class (runtime polymorphism).",
          timestamp: "11:15 AM",
          pageReference: 34,
        },
      ],
    },
  ],
  DBMS: [
    {
      id: "5",
      date: "2025-07-16",
      title: "SQL Joins and Normalization",
      sessionLength: 6,
      important: false,
      topics: ["SQL Joins", "Normalization", "Database Design"],
      conversations: [
        {
          userQuestion: "When should I use LEFT JOIN vs INNER JOIN?",
          botResponse:
            "Use INNER JOIN when you only want records that have matching values in both tables. Use LEFT JOIN when you want all records from the left table plus matched records from the right table, with NULL values for unmatched records.",
          timestamp: "1:30 PM",
          pageReference: 156,
        },
      ],
    },
  ],
};

interface SavedNote {
  id: string;
  date: string;
  title: string;
  sessionLength: number;
  important: boolean;
  topics: string[];
  conversations: {
    userQuestion: string;
    botResponse: string;
    timestamp: string;
    pageReference?: number;
  }[];
}

export default function SubjectNotesPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string;

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showOnlyImportant, setShowOnlyImportant] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Get subject data and notes
  const subjectNote = notesData.find((note) => note.subject === subject);
  const savedNotes =
    mockSavedNotes[subject as keyof typeof mockSavedNotes] || [];

  // Filter and sort notes
  const filteredNotes = savedNotes
    .filter((note) => {
      if (
        searchQuery &&
        !note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !note.topics.some((topic) =>
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }
      if (selectedDate && note.date !== selectedDate) return false;
      if (showOnlyImportant && !note.important) return false;
      if (
        selectedTopics.length > 0 &&
        !selectedTopics.some((topic) => note.topics.includes(topic))
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  // Get unique dates and topics for filters
  const uniqueDates = Array.from(
    new Set(savedNotes.map((note) => note.date))
  ).sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime()
  );
  const allTopics = Array.from(
    new Set(savedNotes.flatMap((note) => note.topics))
  );

  // Group notes by date
  const notesByDate = filteredNotes.reduce((acc, note) => {
    const date = note.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {} as Record<string, SavedNote[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleImportant = (noteId: string) => {
    // In real implementation, this would call an API
    console.log(`Toggle important for note ${noteId}`);
  };

  const exportNotes = () => {
    // In real implementation, this would generate and download a file
    console.log("Exporting notes for", subject);
  };

  useEffect(() => {
    if (!subjectNote) {
      router.push("/dashboard/learn");
      return;
    }
  }, [subject, subjectNote, router]);

  if (!subjectNote) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/learn/${subject}`)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {subject}</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Notes - {subject}</h1>
              <p className="text-sm text-gray-500">
                {savedNotes.length} study sessions •{" "}
                {savedNotes.reduce((acc, note) => acc + note.sessionLength, 0)}{" "}
                total interactions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{subject}</Badge>
            <Button variant="outline" size="sm" onClick={exportNotes}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes by title or topic..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>

              <Button
                variant={showOnlyImportant ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyImportant(!showOnlyImportant)}
              >
                <Star className="w-4 h-4 mr-2" />
                Important
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
              >
                {sortOrder === "desc" ? (
                  <SortDesc className="w-4 h-4" />
                ) : (
                  <SortAsc className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Topic Filter */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {allTopics.map((topic) => (
                <Button
                  key={topic}
                  variant={
                    selectedTopics.includes(topic) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setSelectedTopics((prev) =>
                      prev.includes(topic)
                        ? prev.filter((t) => t !== topic)
                        : [...prev, topic]
                    );
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notes found
              </h3>
              <p className="text-gray-500 mb-4">
                {savedNotes.length === 0
                  ? `Start learning ${subject} to create your first notes!`
                  : "Try adjusting your search or filters to find notes."}
              </p>
              <Button
                onClick={() => router.push(`/dashboard/learn/${subject}`)}
                className="mx-auto"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Go to {subject} Study
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(notesByDate).map(([date, notes]) => (
                <div key={date} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {formatDate(date)}
                    </h2>
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <Badge variant="secondary">{notes.length} sessions</Badge>
                  </div>

                  {/* Notes for this date */}
                  <div className="grid gap-4">
                    {notes.map((note) => (
                      <Card
                        key={note.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <CardTitle className="text-lg">
                                  {note.title}
                                </CardTitle>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleImportant(note.id)}
                                >
                                  {note.important ? (
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  ) : (
                                    <StarOff className="w-4 h-4 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{note.sessionLength} interactions</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {note.conversations[0]?.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedNote(
                                  expandedNote === note.id ? null : note.id
                                )
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          {/* Topics */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {note.topics.map((topic) => (
                              <Badge
                                key={topic}
                                variant="outline"
                                className="text-xs"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          {/* Conversation Preview */}
                          <div className="space-y-3">
                            {note.conversations
                              .slice(
                                0,
                                expandedNote === note.id ? undefined : 1
                              )
                              .map((conv, idx) => (
                                <div
                                  key={idx}
                                  className="border-l-4 border-blue-200 pl-4 space-y-2"
                                >
                                  <div className="flex items-start space-x-2">
                                    <User className="w-4 h-4 mt-1 text-blue-600" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        Q: {conv.userQuestion}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <Bot className="w-4 h-4 mt-1 text-green-600" />
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-700">
                                        {conv.botResponse}
                                      </p>
                                      {conv.pageReference && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          📄 Reference: Page{" "}
                                          {conv.pageReference}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                            {note.conversations.length > 1 &&
                              expandedNote !== note.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedNote(note.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  View {note.conversations.length - 1} more
                                  interactions...
                                </Button>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
