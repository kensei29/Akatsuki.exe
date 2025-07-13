'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Camera,
  Mic,
  Clock,
  AlertTriangle,
  Save,
  Send,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const examData = {
  1: {
    title: 'Data Structures & Algorithms',
    duration: 120, // minutes
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        type: 'descriptive',
        question: 'Explain the difference between a stack and a queue. Provide examples of real-world applications for each data structure.',
        marks: 20,
        timeLimit: 25,
      },
      {
        id: 2,
        type: 'descriptive',
        question: 'Write an algorithm to find the shortest path between two nodes in a weighted graph. Explain the time and space complexity of your solution.',
        marks: 25,
        timeLimit: 30,
      },
      {
        id: 3,
        type: 'descriptive',
        question: 'Describe the concept of dynamic programming. Solve the following problem using dynamic programming: Find the maximum sum of non-adjacent elements in an array.',
        marks: 25,
        timeLimit: 30,
      },
      {
        id: 4,
        type: 'descriptive',
        question: 'Explain different tree traversal methods (in-order, pre-order, post-order). Write pseudocode for each method.',
        marks: 15,
        timeLimit: 20,
      },
      {
        id: 5,
        type: 'descriptive',
        question: 'What is the difference between linear and binary search? When would you use each algorithm? Analyze their time complexities.',
        marks: 15,
        timeLimit: 15,
      },
    ],
  },
};

export default function ExamInterface() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proctorStatus, setProctorStatus] = useState({
    camera: true,
    microphone: true,
    screenShare: true,
    tabSwitches: 0,
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [showWarning, setShowWarning] = useState(false);

  const exam = examData[params.id as keyof typeof examData];

  useEffect(() => {
    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }

    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-save answers
    const autoSave = setInterval(() => {
      setAutoSaveStatus('saving');
      setTimeout(() => setAutoSaveStatus('saved'), 1000);
    }, 30000);

    // Detect tab switches and other violations
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProctorStatus(prev => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1,
        }));
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      clearInterval(autoSave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
    setAutoSaveStatus('unsaved');
  };

  const handleSubmitExam = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    router.push(`/dashboard/exams/results/${params.id}`);
  };

  const currentQ = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.totalQuestions) * 100;
  const wordCount = answers[currentQ.id]?.split(' ').filter(word => word.length > 0).length || 0;

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Exam not found
          </h1>
          <Button onClick={() => router.push('/dashboard/exams')}>
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Proctoring Overlay */}
      <div className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Camera className={`h-4 w-4 ${proctorStatus.camera ? 'text-green-600' : 'text-red-600'}`} />
            <span className={proctorStatus.camera ? 'text-green-600' : 'text-red-600'}>
              Camera
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Mic className={`h-4 w-4 ${proctorStatus.microphone ? 'text-green-600' : 'text-red-600'}`} />
            <span className={proctorStatus.microphone ? 'text-green-600' : 'text-red-600'}>
              Mic
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600">Secure</span>
          </div>
        </div>
      </div>

      {/* Tab Switch Warning */}
      {showWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Warning: Tab switching detected!</span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Multiple violations may result in exam termination.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {exam.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Question {currentQuestion + 1} of {exam.totalQuestions}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Save className={`h-4 w-4 ${
                autoSaveStatus === 'saved' ? 'text-green-600' : 
                autoSaveStatus === 'saving' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <span className={`text-sm ${
                autoSaveStatus === 'saved' ? 'text-green-600' : 
                autoSaveStatus === 'saving' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {autoSaveStatus === 'saved' ? 'Auto-saved' : 
                 autoSaveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${timeLeft < 600 ? 'text-red-600' : 'text-orange-600'}`} />
              <span className={`font-mono text-lg font-semibold ${
                timeLeft < 600 ? 'text-red-600' : 'text-orange-600'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline">
                    Question {currentQuestion + 1}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    {currentQ.marks} marks
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                    {currentQ.timeLimit} min suggested
                  </Badge>
                </div>
                
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              {/* Answer Area */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Your Answer</h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Word count: {wordCount}
                  </div>
                </div>
                
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="min-h-[300px] resize-none border-2 focus:border-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              
              {currentQuestion === exam.totalQuestions - 1 ? (
                <Button 
                  onClick={handleSubmitExam}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Exam
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(Math.min(exam.totalQuestions - 1, currentQuestion + 1))}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <Card className="border-0 shadow-md mt-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-2">
                  Questions:
                </span>
                {exam.questions.map((_, index) => {
                  let buttonClass = "w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200";
                  
                  if (index === currentQuestion) {
                    buttonClass += " bg-indigo-600 text-white";
                  } else if (answers[exam.questions[index].id]) {
                    buttonClass += " bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
                  } else {
                    buttonClass += " bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={buttonClass}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Violations Counter */}
          {proctorStatus.tabSwitches > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Violations detected: {proctorStatus.tabSwitches} tab switch(es)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}