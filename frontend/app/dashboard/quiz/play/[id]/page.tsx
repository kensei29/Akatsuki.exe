'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  userAnswer?: number;
  revealed?: boolean;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 0,
    explanation: "Array access by index is O(1) because arrays store elements in contiguous memory locations, allowing direct calculation of memory address using the index."
  },
  {
    id: 2,
    question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correct: 1,
    explanation: "A stack follows the LIFO principle where the last element added is the first one to be removed, like a stack of plates."
  },
  {
    id: 3,
    question: "What is the worst-case time complexity of searching in a binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 2,
    explanation: "In the worst case, a binary search tree can become completely unbalanced (like a linked list), resulting in O(n) search time."
  },
  {
    id: 4,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correct: 2,
    explanation: "Merge Sort has O(n log n) average-case time complexity and is stable, making it one of the most efficient comparison-based sorting algorithms."
  },
  {
    id: 5,
    question: "What is the space complexity of a recursive factorial function?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2,
    explanation: "Recursive factorial uses O(n) space due to the call stack, as each recursive call adds a new frame to the stack until the base case is reached."
  },
];

export default function QuizInterface() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState(mockQuestions);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit quiz when time runs out
          router.push(`/dashboard/quiz/results/${params.id}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [params.id, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].userAnswer = answerIndex;
    setQuestions(updatedQuestions);
  };

  const handleRevealAnswer = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].revealed = true;
    setQuestions(updatedQuestions);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      router.push(`/dashboard/quiz/results/${params.id}`);
    }
  };

  const handlePreviousQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Check if previous question was already revealed
      if (questions[currentQuestion - 1].revealed) {
        setShowExplanation(true);
      }
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = currentQ.userAnswer !== undefined;
  const isRevealed = currentQ.revealed;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Data Structures Fundamentals
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="outline">
              Beginner Level
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              <div className="grid gap-3">
                {currentQ.options.map((option, index) => {
                  let buttonClass = "p-4 text-left border-2 rounded-lg transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600";
                  
                  if (isRevealed) {
                    if (index === currentQ.correct) {
                      buttonClass += " border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100";
                    } else if (index === currentQ.userAnswer && index !== currentQ.correct) {
                      buttonClass += " border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100";
                    } else {
                      buttonClass += " border-slate-200 dark:border-slate-700";
                    }
                  } else if (currentQ.userAnswer === index) {
                    buttonClass += " border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
                  } else {
                    buttonClass += " border-slate-200 dark:border-slate-700";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !isRevealed && handleAnswerSelect(index)}
                      disabled={isRevealed}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {isRevealed && index === currentQ.correct && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {isRevealed && index === currentQ.userAnswer && index !== currentQ.correct && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Panel */}
              {showExplanation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Explanation
                      </h3>
                      <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {!isRevealed && isAnswered && (
              <Button
                onClick={handleRevealAnswer}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reveal Answer
              </Button>
            )}

            <Button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Question Navigator */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-2">
                Questions:
              </span>
              {questions.map((_, index) => {
                let buttonClass = "w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200";
                
                if (index === currentQuestion) {
                  buttonClass += " bg-indigo-600 text-white";
                } else if (questions[index].userAnswer !== undefined) {
                  buttonClass += " bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
                } else {
                  buttonClass += " bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";
                }

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setShowExplanation(questions[index].revealed || false);
                    }}
                    className={buttonClass}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}