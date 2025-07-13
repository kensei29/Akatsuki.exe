'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Clock,
  User,
  Bot,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

const interviewQuestions = [
  {
    id: 1,
    type: 'behavioral',
    question: "Tell me about yourself and why you're interested in this position.",
    timeLimit: 180, // 3 minutes
    tips: "Keep it concise, focus on relevant experiences, and connect to the role."
  },
  {
    id: 2,
    type: 'technical',
    question: "Explain the difference between a stack and a queue. When would you use each?",
    timeLimit: 300, // 5 minutes
    tips: "Provide clear definitions, examples, and real-world use cases."
  },
  {
    id: 3,
    type: 'behavioral',
    question: "Describe a challenging project you worked on. How did you overcome the difficulties?",
    timeLimit: 240, // 4 minutes
    tips: "Use the STAR method: Situation, Task, Action, Result."
  },
  {
    id: 4,
    type: 'technical',
    question: "How would you design a URL shortener like bit.ly? Walk me through your approach.",
    timeLimit: 600, // 10 minutes
    tips: "Think about scalability, database design, and system architecture."
  },
  {
    id: 5,
    type: 'behavioral',
    question: "Tell me about a time when you had to work with a difficult team member.",
    timeLimit: 180, // 3 minutes
    tips: "Focus on conflict resolution and positive outcomes."
  }
];

export default function MockInterview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(interviewQuestions[0].timeLimit);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setIsRecording(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(interviewQuestions[currentQuestion + 1].timeLimit);
      setAnswer('');
      setShowFeedback(false);
      setIsRecording(true);
    } else {
      // Interview completed
      setIsRecording(false);
      setShowFeedback(true);
    }
  };

  const generateFeedback = () => {
    const feedbacks = [
      "Great job! Your answer was well-structured and showed good understanding of the concept. Consider adding more specific examples to strengthen your response.",
      "Good response! You covered the main points effectively. Try to be more concise in your explanation and focus on the most important aspects.",
      "Excellent use of the STAR method! Your answer was clear and demonstrated strong problem-solving skills. Keep up the good work.",
      "Your technical explanation was accurate. Consider discussing potential trade-offs and alternative approaches to show deeper understanding.",
      "Well articulated! You showed good self-awareness and conflict resolution skills. Adding metrics or specific outcomes would make it even stronger."
    ];
    return feedbacks[currentQuestion] || feedbacks[0];
  };

  const currentQ = interviewQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / interviewQuestions.length) * 100;

  if (!interviewStarted) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl">
                  <Video className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">AI Mock Interview</CardTitle>
              <CardDescription>
                Practice your interview skills with our AI interviewer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What to expect:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• 5 questions covering behavioral and technical topics</li>
                  <li>• Timed responses with real-time feedback</li>
                  <li>• AI analysis of your communication skills</li>
                  <li>• Detailed performance report at the end</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Video className={`h-5 w-5 ${videoEnabled ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">Camera: {videoEnabled ? 'On' : 'Off'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Mic className={`h-5 w-5 ${micEnabled ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">Mic: {micEnabled ? 'On' : 'Off'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMicEnabled(!micEnabled)}
                  >
                    {micEnabled ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={startInterview}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={!micEnabled && !videoEnabled}
              >
                Start Mock Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Mock Interview Session
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Question {currentQuestion + 1} of {interviewQuestions.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className={`font-mono text-lg font-semibold ${
                  timeLeft < 30 ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className={`w-3 h-3 rounded-full ${videoEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Video Section */}
          <div className="w-1/3 bg-slate-100 dark:bg-slate-800 p-4">
            <div className="space-y-4">
              {/* AI Interviewer */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Interviewer</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Senior Software Engineer</p>
                    </div>
                  </div>
                  <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                    <Bot className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Your Video */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">You</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Candidate</p>
                    </div>
                  </div>
                  <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    {videoEnabled ? (
                      <div className="text-slate-500 dark:text-slate-400 text-sm">Camera Feed</div>
                    ) : (
                      <VideoOff className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Question and Answer Section */}
          <div className="flex-1 flex flex-col">
            {/* Question */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={
                  currentQ.type === 'technical' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }>
                  {currentQ.type === 'technical' ? 'Technical' : 'Behavioral'}
                </Badge>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {formatTime(currentQ.timeLimit)} time limit
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {currentQ.question}
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Tip: {currentQ.tips}
                </p>
              </div>
            </div>

            {/* Answer Area */}
            <div className="flex-1 p-6">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Your Answer</h3>
                  <div className="flex items-center gap-2">
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm">Recording</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Textarea
                  placeholder="Type your answer here or speak aloud if using voice recording..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="flex-1 resize-none border-2 focus:border-indigo-500"
                  disabled={!isRecording}
                />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {answer.length} characters
                  </div>
                  
                  <div className="flex gap-3">
                    {isRecording ? (
                      <Button 
                        onClick={() => setIsRecording(false)}
                        variant="outline"
                      >
                        Finish Answer
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => setIsRecording(true)}
                          variant="outline"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Re-record
                        </Button>
                        <Button onClick={nextQuestion}>
                          {currentQuestion === interviewQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Feedback Panel */}
            {!isRecording && answer && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="ghost"
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="w-full p-4 justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Interviewer Feedback
                  </span>
                  {showFeedback ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {showFeedback && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {generateFeedback()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}