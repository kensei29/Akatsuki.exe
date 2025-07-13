'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  BrainCircuit,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Play,
  Star,
  Users,
  Zap,
} from 'lucide-react';

const subjects = [
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Machine Learning',
  'Web Development',
];

const topics = {
  'Data Structures': ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Hash Tables'],
  'Algorithms': ['Sorting & Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Graph Algorithms'],
  'Database Systems': ['SQL Queries', 'Normalization', 'Indexing', 'Transactions'],
  'Operating Systems': ['Process Management', 'Memory Management', 'File Systems', 'Scheduling'],
  'Computer Networks': ['TCP/IP', 'Network Security', 'Protocols', 'Network Architecture'],
  'Software Engineering': ['Design Patterns', 'Testing', 'SDLC', 'Architecture'],
  'Machine Learning': ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Deep Learning'],
  'Web Development': ['Frontend', 'Backend', 'Databases', 'APIs'],
};

const quizzes = [
  {
    id: 1,
    title: 'Data Structures Fundamentals',
    subject: 'Data Structures',
    topic: 'Arrays & Strings',
    difficulty: 'Beginner',
    questions: 15,
    duration: '20 min',
    participants: 1250,
    rating: 4.8,
    description: 'Test your understanding of basic data structures including arrays, strings, and their operations.',
  },
  {
    id: 2,
    title: 'Advanced Tree Algorithms',
    subject: 'Algorithms',
    topic: 'Trees & Graphs',
    difficulty: 'Advanced',
    questions: 25,
    duration: '35 min',
    participants: 890,
    rating: 4.9,
    description: 'Challenge yourself with complex tree algorithms and graph traversal techniques.',
  },
  {
    id: 3,
    title: 'SQL Query Optimization',
    subject: 'Database Systems',
    topic: 'SQL Queries',
    difficulty: 'Intermediate',
    questions: 20,
    duration: '30 min',
    participants: 654,
    rating: 4.7,
    description: 'Master SQL query optimization and understand database performance tuning.',
  },
  {
    id: 4,
    title: 'Dynamic Programming Mastery',
    subject: 'Algorithms',
    topic: 'Dynamic Programming',
    difficulty: 'Advanced',
    questions: 18,
    duration: '25 min',
    participants: 432,
    rating: 4.9,
    description: 'Solve complex dynamic programming problems with various patterns and techniques.',
  },
];

const recentScores = [
  { quiz: 'Arrays & Strings', score: 85, date: '2 days ago' },
  { quiz: 'Linked Lists', score: 92, date: '4 days ago' },
  { quiz: 'Binary Trees', score: 78, date: '1 week ago' },
];

export default function FlashQuizHome() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes);
  const router = useRouter();

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopic('');
    filterQuizzes(subject, '');
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    filterQuizzes(selectedSubject, topic);
  };

  const filterQuizzes = (subject: string, topic: string) => {
    let filtered = quizzes;
    
    if (subject) {
      filtered = filtered.filter(quiz => quiz.subject === subject);
    }
    
    if (topic) {
      filtered = filtered.filter(quiz => quiz.topic === topic);
    }
    
    setFilteredQuizzes(filtered);
  };

  const startQuiz = (quizId: number) => {
    router.push(`/dashboard/quiz/play/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
              FlashQuiz
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Test your knowledge with interactive quizzes and track your progress
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Quizzes</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">28</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">85%</p>
                </div>
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Study Streak</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">12 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Total Time</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">14h 32m</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Selection */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
                <CardDescription>Choose a subject and topic to get started</CardDescription>
                
                {/* Filters */}
                <div className="flex gap-4 pt-4">
                  <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={selectedTopic} 
                    onValueChange={handleTopicChange}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSubject && topics[selectedSubject as keyof typeof topics]?.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {filteredQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{quiz.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{quiz.subject}</Badge>
                              <Badge className={getDifficultyColor(quiz.difficulty)}>
                                {quiz.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <Button onClick={() => startQuiz(quiz.id)} className="flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Start Quiz
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <BrainCircuit className="h-4 w-4" />
                            {quiz.questions} questions
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quiz.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {quiz.participants.toLocaleString()} taken
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {quiz.rating}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredQuizzes.length === 0 && (
                    <div className="text-center py-8">
                      <BrainCircuit className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No quizzes found</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Try selecting a different subject or topic
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Scores */}
          <div>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recent Scores
                </CardTitle>
                <CardDescription>Your latest quiz performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentScores.map((score, index) => (
                    <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{score.quiz}</span>
                        <Badge variant="secondary">{score.score}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Progress value={score.score} className="flex-1 mr-2" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{score.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Results
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Start */}
            <Card className="border-0 shadow-md mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="text-indigo-900 dark:text-indigo-100">Quick Start</CardTitle>
                <CardDescription className="text-indigo-700 dark:text-indigo-300">
                  Jump into a recommended quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => startQuiz(1)}
                  >
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    Data Structures Fundamentals
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => startQuiz(3)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    SQL Query Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}