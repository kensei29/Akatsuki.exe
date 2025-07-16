'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  MapPin,
  Users,
  Clock,
  Star,
  ExternalLink,
  Download,
  Route,
} from 'lucide-react';

const domainData = {
  'ai-ml': {
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Build intelligent systems that can learn, reason, and make decisions',
    growth: '+45%',
    avgSalary: '$120k',
    demandLevel: 'Very High',
    whatToMaster: [
      {
        category: 'Programming Languages',
        skills: ['Python', 'R', 'Julia', 'Scala', 'SQL'],
        description: 'Core languages for AI/ML development and data manipulation'
      },
      {
        category: 'Machine Learning Frameworks',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost'],
        description: 'Essential tools for building and training ML models'
      },
      {
        category: 'Mathematics & Statistics',
        skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability', 'Optimization'],
        description: 'Mathematical foundations crucial for understanding ML algorithms'
      },
      {
        category: 'Data Processing',
        skills: ['Pandas', 'NumPy', 'Apache Spark', 'Hadoop', 'ETL Pipelines'],
        description: 'Tools for handling and processing large datasets'
      },
      {
        category: 'Deep Learning',
        skills: ['Neural Networks', 'CNNs', 'RNNs', 'Transformers', 'GANs'],
        description: 'Advanced architectures for complex AI applications'
      }
    ],
    jobOpportunities: [
      { position: 'Machine Learning Engineer', skills: 'Python, TensorFlow, MLOps', salary: '$130k - $180k', demand: 'Very High' },
      { position: 'Data Scientist', skills: 'Python, R, Statistics, SQL', salary: '$110k - $160k', demand: 'High' },
      { position: 'AI Research Scientist', skills: 'Deep Learning, Research, Publications', salary: '$150k - $250k', demand: 'High' },
      { position: 'Computer Vision Engineer', skills: 'OpenCV, CNNs, Image Processing', salary: '$120k - $170k', demand: 'High' },
      { position: 'NLP Engineer', skills: 'Transformers, BERT, Language Models', salary: '$125k - $175k', demand: 'Very High' },
      { position: 'MLOps Engineer', skills: 'Docker, Kubernetes, CI/CD, Cloud', salary: '$115k - $165k', demand: 'Very High' }
    ],
    futureScope: `The AI and Machine Learning field is experiencing unprecedented growth, with applications spanning every industry from healthcare to finance, autonomous vehicles to entertainment. 

The future holds immense opportunities as AI becomes more integrated into daily life. Emerging areas like Generative AI, Large Language Models, and AI Ethics are creating new career paths. The demand for AI professionals is expected to grow by 45% over the next 5 years.

Key trends shaping the future:
• Generative AI and Large Language Models revolutionizing content creation
• AI in healthcare for drug discovery and personalized medicine
• Autonomous systems in transportation and robotics
• AI-powered climate solutions and sustainability
• Ethical AI and responsible AI development
• Edge AI and mobile AI applications

Companies are investing heavily in AI transformation, creating opportunities for specialists in AI strategy, implementation, and governance. The field offers excellent career progression from individual contributor roles to AI leadership positions.`
  },
  'web-dev': {
    title: 'Full Stack Web Development',
    description: 'Create modern web applications and digital experiences',
    growth: '+38%',
    avgSalary: '$95k',
    demandLevel: 'Very High',
    whatToMaster: [
      {
        category: 'Frontend Technologies',
        skills: ['React', 'Vue.js', 'Angular', 'TypeScript', 'HTML5/CSS3'],
        description: 'Modern frameworks and languages for building user interfaces'
      },
      {
        category: 'Backend Technologies',
        skills: ['Node.js', 'Python/Django', 'Java/Spring', 'C#/.NET', 'Go'],
        description: 'Server-side technologies for building robust APIs and services'
      },
      {
        category: 'Databases',
        skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'GraphQL'],
        description: 'Data storage and retrieval systems for web applications'
      },
      {
        category: 'DevOps & Deployment',
        skills: ['Docker', 'AWS/Azure', 'CI/CD', 'Nginx', 'Git'],
        description: 'Tools for deploying and maintaining web applications'
      },
      {
        category: 'Web Performance',
        skills: ['Webpack', 'Performance Optimization', 'SEO', 'PWAs', 'Testing'],
        description: 'Techniques for building fast, accessible, and reliable web apps'
      }
    ],
    jobOpportunities: [
      { position: 'Full Stack Developer', skills: 'React, Node.js, Databases', salary: '$85k - $130k', demand: 'Very High' },
      { position: 'Frontend Developer', skills: 'React, TypeScript, CSS', salary: '$75k - $120k', demand: 'High' },
      { position: 'Backend Developer', skills: 'Node.js, APIs, Databases', salary: '$80k - $125k', demand: 'High' },
      { position: 'Web Architect', skills: 'System Design, Microservices', salary: '$120k - $180k', demand: 'High' },
      { position: 'DevOps Engineer', skills: 'AWS, Docker, CI/CD', salary: '$100k - $150k', demand: 'Very High' },
      { position: 'UI/UX Developer', skills: 'Design Systems, Figma, React', salary: '$70k - $115k', demand: 'High' }
    ],
    futureScope: `Web development continues to evolve rapidly with new frameworks, tools, and paradigms emerging regularly. The shift towards modern web applications, progressive web apps, and serverless architectures is creating exciting opportunities.

The future of web development includes:
• Serverless and edge computing for better performance
• JAMstack architecture for faster, more secure sites
• WebAssembly for high-performance web applications
• AI-powered development tools and code generation
• Web3 and blockchain integration
• Advanced PWAs with native-like capabilities

The demand for skilled web developers remains consistently high across all industries as businesses continue their digital transformation. Career growth opportunities range from technical leadership to product management and entrepreneurship.`
  }
};

export default function DomainDeepDive() {
  const params = useParams();
  const router = useRouter();
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  
  const domain = domainData[params.slug as keyof typeof domainData];

  if (!domain) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Domain not found
          </h1>
          <Button onClick={() => router.push('/dashboard/career')}>
            Back to Career Guidance
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push(`/dashboard/career/roadmap/${params.slug}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/dashboard/career')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {domain.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {domain.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{domain.growth}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Job Growth</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{domain.avgSalary}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Avg Salary</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{domain.demandLevel}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Market Demand</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">2-4 Years</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Learning Time</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - What to Master */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>What to Master</CardTitle>
                <CardDescription>
                  Essential skills and technologies for success in {domain.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {domain.whatToMaster.map((category, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-semibold">{category.category}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {category.skills.length} skills to learn
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {category.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Job Opportunities */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Job Opportunities</CardTitle>
                <CardDescription>
                  Popular career paths and their requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {domain.jobOpportunities.map((job, index) => (
                    <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {job.position}
                        </h4>
                        <Badge 
                          className={
                            job.demand === 'Very High' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          }
                        >
                          {job.demand} Demand
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Key Skills: {job.skills}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {job.salary}
                        </span>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Jobs
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Future Scope */}
          <div>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Future Scope</CardTitle>
                <CardDescription>
                  Industry trends and growth opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {domain.futureScope.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generate Roadmap Button */}
        <div className="text-center">
          <Button 
            onClick={handleGenerateRoadmap}
            disabled={isGeneratingRoadmap}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            {isGeneratingRoadmap ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Personalized Roadmap...
              </div>
            ) : (
              <>
                <Route className="h-5 w-5 mr-2" />
                Generate Personalized Roadmap
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}