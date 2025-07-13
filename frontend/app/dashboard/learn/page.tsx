'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  BookOpen, 
  Clock, 
  User,
  Star,
  Download,
  Eye
} from 'lucide-react';

const subjects = [
  'All Subjects',
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Machine Learning',
  'Web Development',
];

const topics = [
  'All Topics',
  'Arrays & Strings',
  'Linked Lists',
  'Trees & Graphs',
  'Dynamic Programming',
  'System Design',
  'SQL Queries',
  'Networking Protocols',
];

const notesData = [
  {
    id: 1,
    title: 'Introduction to Data Structures',
    subject: 'Data Structures',
    topic: 'Arrays & Strings',
    author: 'Dr. Sarah Johnson',
    lastUpdated: '2 days ago',
    duration: '15 min read',
    difficulty: 'Beginner',
    rating: 4.8,
    views: 1250,
    description: 'Comprehensive introduction to fundamental data structures including arrays, strings, and basic operations.',
    thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
  },
  {
    id: 2,
    title: 'Advanced Tree Algorithms',
    subject: 'Algorithms',
    topic: 'Trees & Graphs',
    author: 'Prof. Michael Chen',
    lastUpdated: '5 days ago',
    duration: '25 min read',
    difficulty: 'Advanced',
    rating: 4.9,
    views: 890,
    description: 'Deep dive into tree algorithms including AVL trees, B-trees, and advanced traversal techniques.',
    thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
  },
  {
    id: 3,
    title: 'Database Normalization Explained',
    subject: 'Database Systems',
    topic: 'SQL Queries',
    author: 'Dr. Emily Rodriguez',
    lastUpdated: '1 week ago',
    duration: '20 min read',
    difficulty: 'Intermediate',
    rating: 4.7,
    views: 654,
    description: 'Understanding database normalization forms and their practical applications in real-world scenarios.',
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
  },
  {
    id: 4,
    title: 'Dynamic Programming Patterns',
    subject: 'Algorithms',
    topic: 'Dynamic Programming',
    author: 'Prof. David Kim',
    lastUpdated: '3 days ago',
    duration: '30 min read',
    difficulty: 'Advanced',
    rating: 4.9,
    views: 2100,
    description: 'Master the common patterns in dynamic programming with practical examples and problem-solving strategies.',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
  },
  {
    id: 5,
    title: 'Operating System Concepts',
    subject: 'Operating Systems',
    topic: 'System Design',
    author: 'Dr. Lisa Wang',
    lastUpdated: '4 days ago',
    duration: '22 min read',
    difficulty: 'Intermediate',
    rating: 4.6,
    views: 1890,
    description: 'Fundamental concepts of operating systems including process management, memory allocation, and scheduling.',
    thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
  },
  {
    id: 6,
    title: 'Machine Learning Fundamentals',
    subject: 'Machine Learning',
    topic: 'ML Basics',
    author: 'Prof. Alex Thompson',
    lastUpdated: '6 days ago',
    duration: '35 min read',
    difficulty: 'Beginner',
    rating: 4.8,
    views: 3200,
    description: 'Introduction to machine learning concepts, algorithms, and practical applications in various domains.',
    thumbnail: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
  },
];

export default function NotesLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredNotes, setFilteredNotes] = useState(notesData);

  const handleSearch = () => {
    let filtered = notesData;

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (selectedTopic !== 'All Topics') {
      filtered = filtered.filter(note => note.topic === selectedTopic);
    }

    setFilteredNotes(filtered);
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Notes Library</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Explore curated notes from top CS educators and experts
            </p>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search notes, topics, or authors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-48">
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
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Controls */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredNotes.length} notes found
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredNotes.map((note) => (
            <Card key={note.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
              {viewMode === 'grid' ? (
                <>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={note.thumbnail}
                      alt={note.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={getDifficultyColor(note.difficulty)}>
                        {note.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {note.subject}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {note.rating}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {note.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {note.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {note.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {note.views}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={note.thumbnail}
                      alt={note.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {note.subject}
                          </Badge>
                          <Badge className={getDifficultyColor(note.difficulty)}>
                            {note.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {note.rating}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{note.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                        {note.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {note.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {note.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {note.views}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No notes found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Try adjusting your search criteria or browse all subjects
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All Subjects');
              setSelectedTopic('All Topics');
              setFilteredNotes(notesData);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}