'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  Search,
  TrendingUp,
  Code,
  Brain,
  Smartphone,
  Shield,
  Database,
  Globe,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const trendingDomains = [
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence & Machine Learning',
    icon: Brain,
    description: 'Build intelligent systems that can learn and make decisions',
    trending: true,
    growth: '+45%',
    avgSalary: '$120k',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'web-dev',
    title: 'Full Stack Web Development',
    icon: Globe,
    description: 'Create modern web applications and digital experiences',
    trending: true,
    growth: '+38%',
    avgSalary: '$95k',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    icon: Smartphone,
    description: 'Develop native and cross-platform mobile applications',
    trending: false,
    growth: '+32%',
    avgSalary: '$105k',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: Shield,
    description: 'Protect digital assets and secure information systems',
    trending: true,
    growth: '+52%',
    avgSalary: '$130k',
    color: 'from-red-500 to-pink-600',
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    icon: Database,
    description: 'Extract insights from data to drive business decisions',
    trending: true,
    growth: '+41%',
    avgSalary: '$115k',
    color: 'from-orange-500 to-yellow-600',
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Engineering',
    icon: Cpu,
    description: 'Build and maintain scalable infrastructure and deployment pipelines',
    trending: false,
    growth: '+35%',
    avgSalary: '$125k',
    color: 'from-teal-500 to-blue-600',
  },
];

export default function CareerGuidance() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDomains, setShowDomains] = useState(false);
  const router = useRouter();

  const handleExplore = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if query mentions specific domain
    const mentionedDomain = trendingDomains.find(domain => 
      query.toLowerCase().includes(domain.title.toLowerCase().split(' ')[0].toLowerCase()) ||
      query.toLowerCase().includes(domain.id.replace('-', ' '))
    );
    
    if (mentionedDomain) {
      router.push(`/dashboard/career/domain/${mentionedDomain.id}`);
    } else {
      setShowDomains(true);
    }
    
    setIsLoading(false);
  };

  const handleDomainSelect = (domainId: string) => {
    router.push(`/dashboard/career/domain/${domainId}`);
  };

  if (showDomains) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Explore Career Domains
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Based on your interests, here are some trending domains in Computer Science. 
              Pick one to get a detailed roadmap and career insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDomains.map((domain) => (
              <Card 
                key={domain.id} 
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleDomainSelect(domain.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <domain.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                      {domain.title}
                    </h3>
                    {domain.trending && (
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {domain.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      {domain.growth} growth
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      Avg: {domain.avgSalary}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 group-hover:bg-slate-900 dark:group-hover:bg-slate-100 transition-colors duration-200">
                    Pick This Domain
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowDomains(false)}
              className="mt-4"
            >
              Start Over
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <Compass className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Career Guidance
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Let's explore your future in Computer Science & Engineering
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                What would you like to explore today?
              </CardTitle>
              <CardDescription>
                Tell us about your interests, goals, or any specific domain you're curious about
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="e.g., I'm interested in AI and machine learning, or I want to build mobile apps..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleExplore()}
                  className="pl-12 h-14 text-lg border-2 focus:border-indigo-500 transition-colors duration-200"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                onClick={handleExplore}
                disabled={!query.trim() || isLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing your interests...
                  </div>
                ) : (
                  <>
                    Explore Career Paths
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Not sure what to explore? Try these popular queries:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "I want to work in AI",
                    "Web development career",
                    "Cybersecurity jobs",
                    "Data science path"
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Code className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Personalized Roadmaps</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Get custom learning paths</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Market Insights</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Latest industry trends</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">AI-Powered Guidance</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Smart career recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}