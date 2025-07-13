'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  BrainCircuit,
  Target,
  TrendingUp,
  Clock,
  Award,
  Users,
  Star,
  Calendar,
  CheckCircle,
} from 'lucide-react';

const statsData = [
  {
    title: 'Notes Completed',
    value: 42,
    total: 60,
    percentage: 70,
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    title: 'Quizzes Taken',
    value: 28,
    total: 35,
    percentage: 80,
    icon: BrainCircuit,
    color: 'bg-green-500',
  },
  {
    title: 'Roadmap Progress',
    value: 15,
    total: 25,
    percentage: 60,
    icon: Target,
    color: 'bg-purple-500',
  },
  {
    title: 'Streak Days',
    value: 12,
    total: 30,
    percentage: 40,
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'quiz',
    title: 'Completed Data Structures Quiz',
    score: '85%',
    time: '2 hours ago',
    icon: BrainCircuit,
  },
  {
    id: 2,
    type: 'note',
    title: 'Read: Advanced Algorithms',
    time: '4 hours ago',
    icon: BookOpen,
  },
  {
    id: 3,
    type: 'roadmap',
    title: 'Updated ML Roadmap Progress',
    time: '1 day ago',
    icon: Target,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Mock Interview Session',
    date: 'Tomorrow',
    time: '2:00 PM',
    type: 'interview',
  },
  {
    id: 2,
    title: 'Data Structures Exam',
    date: 'Dec 28',
    time: '10:00 AM',
    type: 'exam',
  },
  {
    id: 3,
    title: 'Career Guidance Workshop',
    date: 'Dec 30',
    time: '3:00 PM',
    type: 'workshop',
  },
];

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Alex! 👋</h1>
              <p className="text-indigo-100 mb-4">Ready to continue your learning journey?</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">12-day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Level 5 Learner</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm text-indigo-100">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {stat.value}/{stat.total}
                </div>
                <Progress value={stat.percentage} className="mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {stat.percentage}% complete
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                      <activity.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{activity.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <Badge variant="secondary">{activity.score}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming
              </CardTitle>
              <CardDescription>Your scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">{event.title}</h4>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into your favorite activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <BrainCircuit className="h-5 w-5" />
                <span className="text-sm">Take Quiz</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Browse Notes</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span className="text-sm">View Roadmap</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Join Study Group</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Celebrate your milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Quiz Master</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Completed 25+ quizzes</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">Streak Champion</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">10+ day learning streak</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Knowledge Seeker</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Read 50+ notes</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}