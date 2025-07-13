'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  Clock,
  Shield,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  AlertTriangle,
  Eye,
  Play,
  Award,
} from 'lucide-react';

const upcomingExams = [
  {
    id: 1,
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    date: '2024-02-28',
    time: '10:00 AM',
    duration: '2 hours',
    totalMarks: 100,
    questions: 50,
    type: 'Multiple Choice',
    status: 'scheduled',
    proctored: true,
  },
  {
    id: 2,
    title: 'Database Management Systems',
    subject: 'Computer Science',
    date: '2024-03-05',
    time: '2:00 PM',
    duration: '1.5 hours',
    totalMarks: 75,
    questions: 40,
    type: 'Mixed',
    status: 'scheduled',
    proctored: true,
  },
  {
    id: 3,
    title: 'Operating Systems Concepts',
    subject: 'Computer Science',
    date: '2024-03-12',
    time: '11:00 AM',
    duration: '2.5 hours',
    totalMarks: 120,
    questions: 60,
    type: 'Descriptive',
    status: 'scheduled',
    proctored: true,
  },
];

const completedExams = [
  {
    id: 4,
    title: 'Computer Networks',
    subject: 'Computer Science',
    date: '2024-02-15',
    score: 85,
    totalMarks: 100,
    grade: 'A',
    status: 'completed',
  },
  {
    id: 5,
    title: 'Software Engineering',
    subject: 'Computer Science',
    date: '2024-02-08',
    score: 78,
    totalMarks: 100,
    grade: 'B+',
    status: 'completed',
  },
];

export default function ExamsLobby() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSubject, setSelectedSubject] = useState('all');

  const startExam = (examId: number) => {
    router.push(`/dashboard/exams/take/${examId}`);
  };

  const viewResults = (examId: number) => {
    router.push(`/dashboard/exams/results/${examId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const isExamAvailable = (exam: any) => {
    const examDate = new Date(exam.date);
    const now = new Date();
    const timeDiff = examDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    // Exam is available 30 minutes before scheduled time
    return hoursDiff <= 0.5 && hoursDiff >= -2;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-600" />
              Secure Exam Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              AI-proctored examinations with advanced security features
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Upcoming Exams</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{upcomingExams.length}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completedExams.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">81.5%</p>
                </div>
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Total Hours</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">12.5h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Exams */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Upcoming Exams
                </CardTitle>
                <CardDescription>
                  Your scheduled examinations with proctoring enabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <Card key={exam.id} className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">
                              {exam.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {exam.subject}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(exam.date).toLocaleDateString()} at {exam.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {exam.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {exam.questions} questions
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(exam.status)}>
                              {exam.status}
                            </Badge>
                            {exam.proctored && (
                              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <Shield className="h-3 w-3" />
                                Proctored
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Total Marks:</span> {exam.totalMarks} | 
                            <span className="font-medium"> Type:</span> {exam.type}
                          </div>
                          
                          <Button 
                            onClick={() => startExam(exam.id)}
                            disabled={!isExamAvailable(exam)}
                            className="flex items-center gap-2"
                          >
                            {isExamAvailable(exam) ? (
                              <>
                                <Play className="h-4 w-4" />
                                Start Exam
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4" />
                                Not Available
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {!isExamAvailable(exam) && (
                          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                              <AlertTriangle className="h-4 w-4" />
                              Exam will be available 30 minutes before the scheduled time
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Exams */}
            <Card className="border-0 shadow-md mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Results
                </CardTitle>
                <CardDescription>
                  Your completed examinations and scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {exam.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(exam.date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {exam.score}/{exam.totalMarks}
                          </div>
                          <div className={`text-sm font-medium ${getGradeColor(exam.grade)}`}>
                            Grade: {exam.grade}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewResults(exam.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar and Filters */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Exam Calendar</CardTitle>
                <CardDescription>
                  View upcoming exam dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>
                  Filter exams by subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Proctoring Info */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                  <Shield className="h-5 w-5" />
                  Proctoring Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    AI-powered monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Browser lockdown
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Screen recording
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Identity verification
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}