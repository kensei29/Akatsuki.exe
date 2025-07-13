'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Video,
  BarChart3,
  Code,
  FileText,
  Users,
  Trophy,
  TrendingUp,
  BookOpen,
  Zap,
} from 'lucide-react';

const roadmapItems = [
  {
    id: 1,
    title: 'Resume Building',
    description: 'Create a professional resume that stands out',
    completed: true,
    dueDate: '2024-01-15',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental DSA concepts',
    completed: true,
    dueDate: '2024-02-01',
    priority: 'high',
  },
  {
    id: 3,
    title: 'System Design Basics',
    description: 'Learn scalable system architecture',
    completed: false,
    dueDate: '2024-02-15',
    priority: 'high',
  },
  {
    id: 4,
    title: 'Mock Interviews',
    description: 'Practice with AI interviewer',
    completed: false,
    dueDate: '2024-02-20',
    priority: 'medium',
  },
  {
    id: 5,
    title: 'Company Research',
    description: 'Research target companies',
    completed: false,
    dueDate: '2024-02-25',
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Behavioral Questions',
    description: 'Prepare STAR method responses',
    completed: false,
    dueDate: '2024-03-01',
    priority: 'high',
  },
];

const practiceStats = [
  { platform: 'LeetCode', solved: 145, total: 200, difficulty: 'Medium', streak: 12 },
  { platform: 'HackerRank', solved: 89, total: 120, difficulty: 'Hard', streak: 8 },
  { platform: 'CodeForces', solved: 67, total: 100, difficulty: 'Easy', streak: 5 },
  { platform: 'GeeksforGeeks', solved: 234, total: 300, difficulty: 'Mixed', streak: 15 },
];

const upcomingInterviews = [
  {
    company: 'Google',
    position: 'Software Engineer Intern',
    date: '2024-02-28',
    time: '2:00 PM',
    type: 'Technical',
    round: 'Round 1',
  },
  {
    company: 'Microsoft',
    position: 'SDE Intern',
    date: '2024-03-05',
    time: '10:00 AM',
    type: 'Behavioral',
    round: 'Round 2',
  },
  {
    company: 'Amazon',
    position: 'Software Development Engineer',
    date: '2024-03-10',
    time: '3:30 PM',
    type: 'System Design',
    round: 'Final Round',
  },
];

export default function PlacementPrep() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('roadmap');

  const completedItems = roadmapItems.filter(item => item.completed).length;
  const progressPercentage = (completedItems / roadmapItems.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Target className="h-8 w-8 text-indigo-600" />
              Placement Preparation
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Your comprehensive preparation dashboard for landing your dream job
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Roadmap Progress</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{Math.round(progressPercentage)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Problems Solved</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">535</p>
                </div>
                <Code className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Mock Interviews</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">12</p>
                </div>
                <Video className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Applications</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">8</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-6">
            {/* Progress Overview */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Preparation Roadmap
                </CardTitle>
                <CardDescription>
                  Track your progress through essential placement preparation milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Overall Progress
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {completedItems} of {roadmapItems.length} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Roadmap Items */}
            <div className="space-y-4">
              {roadmapItems.map((item) => (
                <Card key={item.id} className={`border-0 shadow-md transition-all duration-200 ${
                  item.completed 
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500' 
                    : 'hover:shadow-lg'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {item.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-semibold ${
                            item.completed 
                              ? 'text-green-900 dark:text-green-100 line-through' 
                              : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {item.title}
                          </h3>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {!item.completed && (
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            {/* Practice Platforms */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Coding Practice Platforms
                </CardTitle>
                <CardDescription>
                  Track your progress across different coding platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {practiceStats.map((stat, index) => (
                    <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {stat.platform}
                        </h4>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                            <span className="text-sm font-medium">{stat.solved}/{stat.total}</span>
                          </div>
                          <Progress value={(stat.solved / stat.total) * 100} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Difficulty: </span>
                            <span className={`font-medium ${getDifficultyColor(stat.difficulty)}`}>
                              {stat.difficulty}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Streak: </span>
                            <span className="font-medium text-orange-600 dark:text-orange-400">
                              {stat.streak} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Practice */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Practice
                </CardTitle>
                <CardDescription>
                  Jump into practice sessions based on your weak areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 flex flex-col gap-2" variant="outline">
                    <Code className="h-5 w-5" />
                    <span className="text-sm">Arrays & Strings</span>
                  </Button>
                  <Button className="h-16 flex flex-col gap-2" variant="outline">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm">Dynamic Programming</span>
                  </Button>
                  <Button className="h-16 flex flex-col gap-2" variant="outline">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm">System Design</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            {/* Mock Interview */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  AI Mock Interview
                </CardTitle>
                <CardDescription>
                  Practice with our AI interviewer for realistic interview experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Last session: 85% performance score
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Recommended: Practice behavioral questions
                    </p>
                  </div>
                  <Button 
                    onClick={() => router.push('/dashboard/placement/mock-interview')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Start Mock Interview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>
                  Your scheduled interviews and preparation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview, index) => (
                    <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            {interview.company} - {interview.position}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {interview.type} Interview • {interview.round}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(interview.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="h-4 w-4" />
                          {interview.time}
                        </div>
                        <Button size="sm" variant="outline">
                          Prepare
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Analytics
                </CardTitle>
                <CardDescription>
                  Detailed insights into your preparation progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => router.push('/dashboard/placement/analytics')}
                  className="w-full"
                >
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}