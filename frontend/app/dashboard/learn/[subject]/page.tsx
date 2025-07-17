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
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Send,
  Bot,
  User,
  BookOpen,
  MessageSquare,
  History,
  Search,
  Download,
  Share,
  Star,
  StarOff,
} from "lucide-react";
import { notesData } from "../notes";

// Mock PDF data
const mockPDFs = {
  DSA: {
    title: "Data Structures & Algorithms Master Notes",
    url: "/api/pdf/dsa-notes.pdf", // Mock URL
    totalPages: 156,
    author: "Dr. Sarah Johnson",
  },
  OOP: {
    title: "OOP Principles and Design Patterns",
    url: "/api/pdf/oop-notes.pdf",
    totalPages: 142,
    author: "Prof. Michael Chen",
  },
  DBMS: {
    title: "DBMS Essentials and SQL Guide",
    url: "/api/pdf/dbms-notes.pdf",
    totalPages: 198,
    author: "Dr. Emily Rodriguez",
  },
  CN: {
    title: "Computer Networks and Protocols",
    url: "/api/pdf/networks-notes.pdf",
    totalPages: 178,
    author: "Prof. David Kim",
  },
  OS: {
    title: "Operating System Internals",
    url: "/api/pdf/os-notes.pdf",
    totalPages: 234,
    author: "Dr. Lisa Wang",
  },
  ML: {
    title: "Machine Learning Foundations",
    url: "/api/pdf/ml-notes.pdf",
    totalPages: 167,
    author: "Prof. Alex Thompson",
  },
  DL: {
    title: "Deep Learning and Neural Networks",
    url: "/api/pdf/dl-notes.pdf",
    totalPages: 289,
    author: "Dr. Sophia Patel",
  },
  CC: {
    title: "Cloud Computing Essentials",
    url: "/api/pdf/cloud-notes.pdf",
    totalPages: 156,
    author: "Dr. Priya Natarajan",
  },
};

// Mock AI responses based on subject
const getAIResponse = (subject: string, message: string) => {
  const responses: Record<string, string[]> = {
    DSA: [
      "Great question about data structures! Let me explain...",
      "For algorithms, the time complexity is crucial. Here's why...",
      "Arrays and linked lists differ in their memory allocation patterns...",
      "The best approach for this problem would be to use a hash table because...",
    ],
    OOP: [
      "Inheritance is a fundamental OOP concept that allows...",
      "Polymorphism enables objects of different types to be treated uniformly...",
      "Encapsulation helps in data hiding and maintaining code integrity...",
      "Design patterns provide reusable solutions to common problems...",
    ],
    DBMS: [
      "SQL joins are used to combine data from multiple tables...",
      "Normalization helps eliminate data redundancy and improve data integrity...",
      "Indexing can significantly improve query performance by...",
      "ACID properties ensure database transactions are processed reliably...",
    ],
    // Add more subject-specific responses...
  };

  const subjectResponses = responses[subject] || [
    "That's an interesting question! Let me help you understand this concept better...",
    "Based on the PDF content, here's what you need to know...",
    "This is a common topic that students often ask about...",
  ];

  return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
};

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  pageReference?: number;
  isImportant?: boolean;
}

export default function SubjectNotesPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string;

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNoteText, setQuickNoteText] = useState("");

  // Get subject data
  const subjectNote = notesData.find((note) => note.subject === subject);
  const pdfData = mockPDFs[subject as keyof typeof mockPDFs];

  useEffect(() => {
    if (!subjectNote || !pdfData) {
      router.push("/dashboard/learn");
      return;
    }

    // Initialize with welcome message
    setChatMessages([
      {
        id: "welcome",
        type: "ai",
        content: `Hello! I'm your AI tutor for ${subject}. I'm here to help you understand the concepts in this PDF. Feel free to ask me any questions about the material!`,
        timestamp: new Date(),
      },
    ]);
  }, [subject, subjectNote, pdfData, router]);

  // PDF Controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, pdfData?.totalPages || 1));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Chat functionality
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(subject, newMessage),
        timestamp: new Date(),
        pageReference: Math.random() > 0.7 ? currentPage : undefined,
      };

      setChatMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);

      // Simulate saving conversation to backend
      // In real implementation, this would be an API call
      saveConversationToNotes(userMessage, aiResponse);
    }, 1500);
  };

  const saveConversationToNotes = (
    userMessage: ChatMessage,
    aiMessage: ChatMessage
  ) => {
    // Mock function to simulate saving conversation to backend
    const noteData = {
      subject,
      userQuestion: userMessage.content,
      botResponse: aiMessage.content,
      timestamp: new Date().toISOString(),
      pageReference: aiMessage.pageReference,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      isImportant: aiMessage.isImportant || false,
    };

    console.log("Saving conversation to notes:", noteData);
    // This would typically be: await fetch('/api/notes', { method: 'POST', body: JSON.stringify(noteData) })
  };

  const toggleMessageImportant = (messageId: string) => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isImportant: !msg.isImportant } : msg
      )
    );
    // In real implementation, also update backend
    console.log("Toggled important status for message:", messageId);
  };

  const saveQuickNote = () => {
    if (!quickNoteText.trim()) return;

    const noteData = {
      subject,
      type: "manual_note",
      content: quickNoteText,
      pageReference: currentPage,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
    };

    console.log("Saving quick note:", noteData);
    setQuickNoteText("");
    setShowQuickNote(false);
    // Show confirmation or add to chat as a special message type
  };

  if (!subjectNote || !pdfData) {
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
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Learn</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold">{pdfData.title}</h1>
              <p className="text-sm text-gray-500">by {pdfData.author}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{subject}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/learn/notes/${subject}`)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Notes
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* PDF Viewer Column */}
          <div
            className={`${
              isFullscreen ? "w-full" : "w-1/2"
            } border-r bg-gray-50 flex flex-col`}
          >
            {/* PDF Controls */}
            <div className="flex items-center justify-between p-3 bg-white border-b">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">{zoom}%</span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {pdfData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === pdfData.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* PDF Display Area */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <div
                className="bg-white shadow-lg border rounded-lg overflow-hidden"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center",
                  width: "595px",
                  height: "842px", // A4 aspect ratio
                }}
              >
                {/* Mock PDF Content */}
                <div className="w-full h-full p-8 text-sm leading-relaxed">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">{pdfData.title}</h2>
                    <p className="text-gray-600">Page {currentPage}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Chapter {Math.ceil(currentPage / 10)}: Core Concepts
                    </h3>
                    <p>
                      This is mock content for {subject}. In a real
                      implementation, this would be an actual PDF viewer
                      component showing the real PDF content.
                    </p>
                    <p>
                      The PDF viewer would integrate with libraries like
                      react-pdf or pdf.js to display actual PDF documents
                      fetched from your backend.
                    </p>
                    <div className="bg-gray-100 p-4 rounded">
                      <h4 className="font-medium mb-2">Key Points:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Concept explanation for {subject}</li>
                        <li>Practical examples and use cases</li>
                        <li>Implementation details</li>
                        <li>Best practices and common pitfalls</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface Column */}
          {!isFullscreen && (
            <div className="w-1/2 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Tutor</h3>
                      <p className="text-sm text-gray-500">
                        Specialized in {subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500">
                      {chatMessages.filter((msg) => msg.isImportant).length}{" "}
                      important
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChatHistory(!showChatHistory)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      } ${message.isImportant ? "ring-2 ring-yellow-400" : ""}`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "ai" && (
                          <Bot className="w-4 h-4 mt-1 text-blue-600" />
                        )}
                        {message.type === "user" && (
                          <User className="w-4 h-4 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          {message.pageReference && (
                            <p className="text-xs mt-1 opacity-75">
                              📄 Reference: Page {message.pageReference}
                            </p>
                          )}
                          <p className="text-xs mt-1 opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Important toggle button */}
                      {message.type === "ai" && (
                        <button
                          onClick={() => toggleMessageImportant(message.id)}
                          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-lg"
                        >
                          {message.isImportant ? (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                {showQuickNote && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        Quick Note - Page {currentPage}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuickNote(false)}
                      >
                        ×
                      </Button>
                    </div>
                    <Input
                      value={quickNoteText}
                      onChange={(e) => setQuickNoteText(e.target.value)}
                      placeholder="Add a note about what you're reading..."
                      className="mb-2"
                      onKeyPress={(e) => e.key === "Enter" && saveQuickNote()}
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveQuickNote}>
                        Save Note
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQuickNote(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask me anything about this material..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Current page: {currentPage} • Ask about specific concepts
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuickNote(true)}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Quick Note
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Search className="w-3 h-3 mr-1" />
                      Search PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
