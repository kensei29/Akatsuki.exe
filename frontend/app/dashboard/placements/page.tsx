'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Building,
  Clock,
  TrendingUp,
  Users,
  Star,
  ExternalLink,
  Filter,
  BookOpen,
  FileText,
  Video,
} from 'lucide-react';

const jobListings = [
  {
    id: 1,
    title: 'Software Engineer Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Internship',
    salary: '$8,000/month',
    experience: 'Entry Level',
    remote: false,
    posted: '2 days ago',
    applicants: 245,
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    skills: ['Python', 'JavaScript', 'React', 'Node.js'],
    description: 'Join our team to work on cutting-edge technology that impacts billions of users worldwide.',
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$120k - $150k',
    experience: 'Mid Level',
    remote: true,
    posted: '1 week ago',
    applicants: 189,
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    skills: ['React', 'TypeScript', 'CSS', 'Azure'],
    description: 'Build amazing user experiences for Microsoft products used by millions of people.',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Amazon',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$130k - $180k',
    experience: 'Senior Level',
    remote: false,
    posted: '3 days ago',
    applicants: 156,
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    skills: ['Python', 'Machine Learning', 'SQL', 'AWS'],
    description: 'Use data to drive business decisions and improve customer experiences at scale.',
  },
  {
    id: 4,
    title: 'Mobile App Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'Full-time',
    salary: '$140k - $170k',
    experience: 'Mid Level',
    remote: true,
    posted: '5 days ago',
    applicants: 203,
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    skills: ['React Native', 'iOS', 'Android', 'JavaScript'],
    description: 'Build mobile applications that connect people around the world.',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    salary: '$125k - $160k',
    experience: 'Mid Level',
    remote: true,
    posted: '1 day ago',
    applicants: 98,
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Python'],
    description: 'Help scale our infrastructure to serve entertainment to millions of users globally.',
  },
  {
    id: 6,
    title: 'Backend Engineer',
    company: 'Spotify',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$115k - $145k',
    experience: 'Entry Level',
    remote: false,
    posted: '4 days ago',
    applicants: 167,
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    skills: ['Java', 'Spring', 'PostgreSQL', 'Microservices'],
    description: 'Build the backend systems that power music streaming for millions of users.',
  },
];

const quickActions = [
  {
    title: 'Job Search',
    description: 'Browse and apply to job opportunities',
    icon: Search,
    action: 'jobs',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Company Compare',
    description: 'Compare companies side by side',
    icon: Building,
    action: 'compare',
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Resume Builder',
    description: 'Create and optimize your resume',
    icon: FileText,
    action: 'resume',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'Interview Prep',
    description: 'Practice interviews and soft skills',
    icon: Video,
    action: 'interview',
    color: 'from-orange-500 to-red-600',
  },
];

export default function PlacementsHub() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobListings);

  const handleQuickAction = (action: string) => {
    router.push(`/dashboard/placements/${action}`);
  };

  const handleSearch = () => {
    let filtered = jobListings;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedExperience) {
      filtered = filtered.filter(job => job.experience === selectedExperience);
    }

    if (selectedType) {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    setFilteredJobs(filtered);
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Entry Level':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Mid Level':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Senior Level':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
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
              <Briefcase className="h-8 w-8 text-indigo-600" />
              Placements Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Your gateway to career opportunities and placement preparation
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Active Jobs</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{jobListings.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Applications</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">12</p>
                </div>
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Interviews</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">3</p>
                </div>
                <Video className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Response Rate</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">25%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access key placement preparation tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Search */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Job Opportunities
            </CardTitle>
            <CardDescription>
              Discover and apply to the latest job openings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search jobs, companies, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="california">California</SelectItem>
                      <SelectItem value="washington">Washington</SelectItem>
                      <SelectItem value="texas">Texas</SelectItem>
                      <SelectItem value="new york">New York</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="Entry Level">Entry Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {job.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {job.company}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Badge className={getExperienceColor(job.experience)}>
                              {job.experience}
                            </Badge>
                            {job.remote && (
                              <Badge variant="outline">Remote</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.posted}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {job.applicants} applicants
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No jobs found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Try adjusting your search criteria or browse all opportunities
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('');
                  setSelectedExperience('');
                  setSelectedType('');
                  setFilteredJobs(jobListings);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}