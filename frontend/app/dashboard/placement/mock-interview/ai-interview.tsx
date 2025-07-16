/**
 * AI-Powered Mock Interview Page
 * Clean interface with chat and code editor
 */

"use client";

import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  User,
  Bot,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Play,
  Square,
  MessageSquare,
  CheckCircle,
  Send,
  Code,
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { useApp } from "@/contexts/AppContext";

export default function AIMockInterview() {
  const router = useRouter();
  
  // Context state
  const {
    state: interviewState,
    createSession,
    startSession,
    sendMessage,
    endSession,
    resetSession,
  } = useInterview();
  const { state: appState } = useApp();

  // Local UI state
  const [currentMessage, setCurrentMessage] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [timeSpent, setTimeSpent] = useState(0);
  const [activeTab, setActiveTab] = useState<"chat" | "code">("chat");
  const [currentQuestion, setCurrentQuestion] = useState<{
    content: string;
    type: string;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Timer for tracking session time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (interviewState.sessionStarted && !interviewState.sessionCompleted) {
      timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewState.sessionStarted, interviewState.sessionCompleted]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interviewState.messages]);

  // Reset session on unmount
  useEffect(() => {
    return () => {
      if (interviewState.sessionStarted && !interviewState.sessionCompleted) {
        resetSession();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCreateSession = async () => {
    try {
      await createSession(selectedDifficulty);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleStartInterview = async () => {
    try {
      await startSession();
    } catch (error) {
      console.error("Failed to start interview:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      await sendMessage(currentMessage, "response");
      setCurrentMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendCode = async () => {
    if (!codeContent.trim()) return;

    try {
      await sendMessage(
        `Here's my code solution:\n\`\`\`\n${codeContent}\n\`\`\``,
        "code"
      );
    } catch (error) {
      console.error("Failed to send code:", error);
    }
  };

  const handleEndInterview = async () => {
    try {
      await endSession();
    } catch (error) {
      console.error("Failed to end interview:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentQuestion = () => {
    const questionMessages = interviewState.messages.filter(
      (msg) => msg.type === "question"
    );
    return questionMessages.length > 0
      ? questionMessages[questionMessages.length - 1]
      : null;
  };

  const progress =
    interviewState.totalQuestions > 0
      ? (interviewState.currentQuestionNumber / interviewState.totalQuestions) *
        100
      : 0;

  // Pre-interview setup screen
  if (!interviewState.session) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">AI Mock Interview</CardTitle>
              <CardDescription>
                Practice with our advanced AI interviewer - Chat and code your
                way to success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User must be logged in */}
              {!appState.isAuthenticated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please log in to start an interview session.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error display */}
              {interviewState.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{interviewState.error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What to expect:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Interactive chat with AI interviewer</li>
                  <li>• Built-in code editor for coding problems</li>
                  <li>• Real-time feedback and hints</li>
                  <li>• Personalized difficulty progression</li>
                  <li>• Performance analysis and suggestions</li>
                </ul>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Interview Difficulty
                </label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      Easy - Basic concepts and simple problems
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium - Intermediate algorithms and data structures
                    </SelectItem>
                    <SelectItem value="hard">
                      Hard - Advanced problem solving and system design
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateSession}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={!appState.isAuthenticated || interviewState.isLoading}
              >
                {interviewState.isLoading
                  ? "Creating Session..."
                  : "Create Interview Session"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Session created, waiting to start
  if (interviewState.session && !interviewState.sessionStarted) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                Interview Session Ready
              </CardTitle>
              <CardDescription>
                Session ID: {interviewState.session.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Session Details:
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>
                    • Difficulty:{" "}
                    <span className="font-medium capitalize">
                      {selectedDifficulty}
                    </span>
                  </li>
                  <li>• Type: DSA (Data Structures & Algorithms)</li>
                  <li>• Expected Duration: 30-45 minutes</li>
                  <li>• AI Interviewer: Ready</li>
                </ul>
              </div>

              {interviewState.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{interviewState.error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleStartInterview}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={interviewState.isLoading}
              >
                {interviewState.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Main interview interface
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/placement")}
                className="p-2 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  AI Mock Interview
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Question {interviewState.currentQuestionNumber} • Phase:{" "}
                  {interviewState.interviewPhase}
                  {interviewState.currentScore > 0 && (
                  <span className="ml-2">
                    • Score: {interviewState.currentScore}
                  </span>
                )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-lg font-semibold text-blue-600">
                  {formatTime(timeSpent)}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleEndInterview}
                disabled={interviewState.isLoading}
                className="text-red-600 hover:text-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                End Interview
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Chat Section */}
          <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-700">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Interview Chat
                </h2>
                <Badge variant="secondary">
                  {interviewState.messages.length} messages
                </Badge>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {interviewState.messages.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                  <p>Waiting for the interview to begin...</p>
                </div>
              ) : (
                interviewState.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-purple-100 dark:bg-purple-900"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[80%] ${
                        message.sender === "user" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                        {message.type && message.type !== "system" && (
                          <span className="ml-1">• {message.type}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message to the AI interviewer..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={
                    interviewState.isLoading || interviewState.sessionCompleted
                  }
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !currentMessage.trim() ||
                    interviewState.isLoading ||
                    interviewState.sessionCompleted
                  }
                  size="sm"
                >
                  {interviewState.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="w-1/2 flex flex-col">
            {/* Code Editor Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    Code Editor
                  </h2>
                  <Badge variant="secondary">{codeContent.length} chars</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCodeContent("")}
                    disabled={!codeContent.trim()}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleSendCode}
                    disabled={
                      !codeContent.trim() ||
                      interviewState.isLoading ||
                      interviewState.sessionCompleted
                    }
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Code
                  </Button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-4">
              <Textarea
                placeholder={`// Write your code solution here...
// You can use any programming language

function solution() {
    // Your implementation
}`}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full h-full resize-none font-mono text-sm border-2 focus:border-green-500"
                disabled={interviewState.sessionCompleted}
              />
            </div>

            {/* Code Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                💡 Write your solution and click "Submit Code" to share with the
                AI interviewer
              </div>
              {interviewState.suggestions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Suggestions:</strong>{" "}
                    {interviewState.suggestions.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Session Complete Overlay */}
        {interviewState.sessionCompleted && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Interview Completed!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Thank you for completing the interview. Your performance has
                  been saved.
                </p>
                <div className="flex gap-2">
                  <Button onClick={resetSession} className="flex-1">
                    Start New Interview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/dashboard")}
                    className="flex-1"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
