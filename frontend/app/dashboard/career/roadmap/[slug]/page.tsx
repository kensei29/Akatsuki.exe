'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  Download,
  Eye,
  Calendar,
  Target,
  BookOpen,
  Code,
  Trophy,
} from 'lucide-react';
import DetailedRoadmapModal from '@/components/career/DetailedRoadmapModal';

const roadmapData = {
  'ai-ml': {
    title: 'AI & Machine Learning Roadmap',
    totalDuration: '18-24 months',
    phases: [
      {
        phase: 'Foundation',
        duration: '3-4 months',
        level: 'Beginner',
        description: 'Build strong mathematical and programming foundations',
        topics: [
          'Python Programming Fundamentals',
          'Mathematics for ML (Linear Algebra, Calculus, Statistics)',
          'Data Structures & Algorithms',
          'Introduction to Data Science',
          'Basic SQL and Database Concepts'
        ],
        projects: [
          'Build a simple data analysis project',
          'Create basic Python programs',
          'Statistical analysis of a dataset'
        ],
        completed: true,
        progress: 100
      },
      {
        phase: 'Core Machine Learning',
        duration: '4-5 months',
        level: 'Intermediate',
        description: 'Master fundamental ML algorithms and techniques',
        topics: [
          'Supervised Learning (Regression, Classification)',
          'Unsupervised Learning (Clustering, Dimensionality Reduction)',
          'Model Evaluation and Validation',
          'Feature Engineering and Selection',
          'Scikit-learn and Pandas Mastery'
        ],
        projects: [
          'Predictive modeling project',
          'Customer segmentation analysis',
          'End-to-end ML pipeline'
        ],
        completed: false,
        progress: 65
      },
      {
        phase: 'Deep Learning',
        duration: '5-6 months',
        level: 'Advanced',
        description: 'Dive deep into neural networks and advanced architectures',
        topics: [
          'Neural Networks Fundamentals',
          'Convolutional Neural Networks (CNNs)',
          'Recurrent Neural Networks (RNNs)',
          'Transformers and Attention Mechanisms',
          'TensorFlow and PyTorch'
        ],
        projects: [
          'Image classification system',
          'Natural language processing application',
          'Time series forecasting model'
        ],
        completed: false,
        progress: 20
      },
      {
        phase: 'Specialization & Production',
        duration: '6-9 months',
        level: 'Expert',
        description: 'Specialize in specific domains and learn production deployment',
        topics: [
          'MLOps and Model Deployment',
          'Computer Vision or NLP Specialization',
          'Cloud Platforms (AWS, GCP, Azure)',
          'Model Monitoring and Maintenance',
          'AI Ethics and Responsible AI'
        ],
        projects: [
          'Deploy ML model to production',
          'Build a complete AI application',
          'Contribute to open-source ML project'
        ],
        completed: false,
        progress: 0
      }
    ]
  },
  'web-dev': {
    title: 'Full Stack Web Development Roadmap',
    totalDuration: '12-18 months',
    phases: [
      {
        phase: 'Frontend Fundamentals',
        duration: '3-4 months',
        level: 'Beginner',
        description: 'Master the building blocks of web development',
        topics: [
          'HTML5 & Semantic Markup',
          'CSS3 & Modern Layouts (Flexbox, Grid)',
          'JavaScript ES6+ Fundamentals',
          'Responsive Web Design',
          'Version Control with Git'
        ],
        projects: [
          'Personal portfolio website',
          'Responsive landing page',
          'Interactive JavaScript game'
        ],
        completed: true,
        progress: 100
      },
      {
        phase: 'Modern Frontend',
        duration: '4-5 months',
        level: 'Intermediate',
        description: 'Learn modern frontend frameworks and tools',
        topics: [
          'React.js Fundamentals',
          'State Management (Redux/Context)',
          'TypeScript',
          'Build Tools (Webpack, Vite)',
          'Testing (Jest, React Testing Library)'
        ],
        projects: [
          'React-based web application',
          'E-commerce frontend',
          'Real-time chat application'
        ],
        completed: false,
        progress: 75
      },
      {
        phase: 'Backend Development',
        duration: '3-4 months',
        level: 'Intermediate',
        description: 'Build robust server-side applications',
        topics: [
          'Node.js & Express.js',
          'Database Design (SQL & NoSQL)',
          'RESTful APIs & GraphQL',
          'Authentication & Authorization',
          'Server Security Best Practices'
        ],
        projects: [
          'RESTful API with authentication',
          'Database-driven web application',
          'Real-time API with WebSockets'
        ],
        completed: false,
        progress: 30
      },
      {
        phase: 'Full Stack & DevOps',
        duration: '2-5 months',
        level: 'Advanced',
        description: 'Integrate frontend and backend, learn deployment',
        topics: [
          'Full Stack Integration',
          'Cloud Deployment (AWS, Vercel, Netlify)',
          'Docker & Containerization',
          'CI/CD Pipelines',
          'Performance Optimization'
        ],
        projects: [
          'Complete full-stack application',
          'Deployed production application',
          'Microservices architecture project'
        ],
        completed: false,
        progress: 0
      }
    ]
  }
};

export default function RoadmapView() {
  const params = useParams();
  const router = useRouter();
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  
  const roadmap = roadmapData[params.slug as keyof typeof roadmapData];

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Roadmap not found
          </h1>
          <Button onClick={() => router.push('/dashboard/career')}>
            Back to Career Guidance
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const overallProgress = roadmap.phases.reduce((acc, phase) => acc + phase.progress, 0) / roadmap.phases.length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push(`/dashboard/career/domain/${params.slug}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {roadmap.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {roadmap.totalDuration}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {Math.round(overallProgress)}% Complete
              </div>
            </div>
          </div>
          <Button onClick={() => setShowDetailedModal(true)} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Detailed Roadmap
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                Overall Progress
              </h3>
              <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {roadmap.phases.filter(p => p.completed).length}
                </div>
                <div className="text-sm text-indigo-700 dark:text-indigo-300">Phases Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {roadmap.phases.length - roadmap.phases.filter(p => p.completed).length}
                </div>
                <div className="text-sm text-indigo-700 dark:text-indigo-300">Phases Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {roadmap.totalDuration}
                </div>
                <div className="text-sm text-indigo-700 dark:text-indigo-300">Total Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-6">
          {roadmap.phases.map((phase, index) => (
            <Card key={index} className={`border-0 shadow-md transition-all duration-200 ${
              phase.completed 
                ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500' 
                : phase.progress > 0 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                  : 'bg-slate-50 dark:bg-slate-800 border-l-4 border-l-slate-300 dark:border-l-slate-600'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {phase.completed ? (
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    ) : phase.progress > 0 ? (
                      <div className="relative">
                        <Circle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        </div>
                      </div>
                    ) : (
                      <Circle className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Phase {index + 1}: {phase.phase}
                      </h3>
                      <Badge className={
                        phase.level === 'Beginner' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : phase.level === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : phase.level === 'Advanced'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }>
                        {phase.level}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                        {phase.duration}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {phase.description}
                    </p>
                    
                    {!phase.completed && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Progress
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {phase.progress}%
                          </span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Topics to Learn
                        </h4>
                        <ul className="space-y-2">
                          {phase.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Projects to Build
                        </h4>
                        <ul className="space-y-2">
                          {phase.projects.map((project, projectIndex) => (
                            <li key={projectIndex} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setShowDetailedModal(true)} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Detailed Roadmap
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Set Study Schedule
          </Button>
        </div>

        {/* Detailed Roadmap Modal */}
        <DetailedRoadmapModal 
          open={showDetailedModal}
          onOpenChange={setShowDetailedModal}
          roadmapData={roadmap}
          domainSlug={params.slug as string}
        />
      </div>
    </DashboardLayout>
  );
}