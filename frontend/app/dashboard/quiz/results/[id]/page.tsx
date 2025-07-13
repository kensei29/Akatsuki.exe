'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Share,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const quizResults = {
  score: 85,
  totalQuestions: 15,
  correctAnswers: 13,
  timeSpent: '18:45',
  accuracy: 87,
  rank: 'Top 15%',
  avgScore: 72,
};

const topicPerformance = [
  { topic: 'Arrays', correct: 4, total: 5, percentage: 80 },
  { topic: 'Linked Lists', correct: 3, total: 4, percentage: 75 },
  { topic: 'Stacks', correct: 3, total: 3, percentage: 100 },
  { topic: 'Queues', correct: 3, total: 3, percentage: 100 },
];

const strengthsWeaknesses = [
  { name: 'Arrays', value: 80, color: '#10B981' },
  { name: 'Linked Lists', value: 75, color: '#F59E0B' },
  { name: 'Stacks', value: 100, color: '#059669' },
  { name: 'Queues', value: 100, color: '#059669' },
];

const questionReview = [
  {
    id: 1,
    question: "What is the time complexity of accessing an element in an array by index?",
    userAnswer: "O(1)",
    correctAnswer: "O(1)",
    isCorrect: true,
    explanation: "Array access by index is O(1) because arrays store elements in contiguous memory locations."
  },
  {
    id: 2,
    question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    userAnswer: "Stack",
    correctAnswer: "Stack",
    isCorrect: true,
    explanation: "A stack follows the LIFO principle where the last element added is the first one to be removed."
  },
  {
    id: 3,
    question: "What is the worst-case time complexity of searching in a binary search tree?",
    userAnswer: "O(log n)",
    correctAnswer: "O(n)",
    isCorrect: false,
    explanation: "In the worst case, a binary search tree can become completely unbalanced, resulting in O(n) search time."
  },
];

export default function QuizResults() {
  const params = useParams();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
    if (score >= 80) return { text: 'Good', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' };
    if (score >= 60) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' };
  };

  const scoreBadge = getScoreBadge(quizResults.score);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Quiz Complete!
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Data Structures Fundamentals • Beginner Level
          </p>
        </div>

        {/* Score Overview */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor(quizResults.score)}`}>
                {quizResults.score}%
              </div>
              <Badge className={scoreBadge.color}>{scoreBadge.text}</Badge>
              <p className="text-slate-600 dark:text-slate-400">
                You scored {quizResults.correctAnswers} out of {quizResults.totalQuestions} questions correctly
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quizResults.correctAnswers}/{quizResults.totalQuestions}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quizResults.timeSpent}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quizResults.accuracy}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quizResults.rank}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Global Rank</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share Results
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="review">Review Answers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance by Topic */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Performance by Topic</CardTitle>
                  <CardDescription>Your accuracy across different topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicPerformance.map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {topic.topic}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {topic.correct}/{topic.total} ({topic.percentage}%)
                          </span>
                        </div>
                        <Progress value={topic.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comparison */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>How you compare to other students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <div className="font-semibold text-green-900 dark:text-green-100">Your Score</div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{quizResults.score}%</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Average Score</div>
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{quizResults.avgScore}%</div>
                      </div>
                      <Target className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                    </div>

                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">You performed</div>
                      <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {quizResults.score - quizResults.avgScore}% better
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">than average</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths & Weaknesses Chart */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Strengths & Weaknesses</CardTitle>
                  <CardDescription>Topic-wise performance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topicPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>Visual breakdown of your performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={strengthsWeaknesses}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {strengthsWeaknesses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {strengthsWeaknesses.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Suggestions */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>Personalized recommendations based on your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Focus Areas</h4>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                      <li>• Review binary search tree operations and complexity analysis</li>
                      <li>• Practice more problems on linked list traversal</li>
                      <li>• Study balanced tree structures (AVL, Red-Black trees)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Strengths</h4>
                    <ul className="space-y-1 text-green-800 dark:text-green-200">
                      <li>• Excellent understanding of stack and queue operations</li>
                      <li>• Strong grasp of array time complexity concepts</li>
                      <li>• Good knowledge of basic data structure principles</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
                <CardDescription>Review all questions with explanations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questionReview.map((question, index) => (
                    <div key={question.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {question.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Question {index + 1}
                          </h4>
                          <p className="text-slate-700 dark:text-slate-300 mb-3">
                            {question.question}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Your Answer:</span>
                              <div className={`p-2 rounded ${question.isCorrect 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                              }`}>
                                {question.userAnswer}
                              </div>
                            </div>
                            {!question.isCorrect && (
                              <div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Correct Answer:</span>
                                <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                                  {question.correctAnswer}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Explanation:</span>
                            <p className="text-blue-800 dark:text-blue-200 mt-1">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}