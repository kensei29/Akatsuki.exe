'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Star,
  Download,
  Share,
  Bookmark,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import SubjectExpertChatDrawer from '@/components/chat/SubjectExpertChatDrawer';

const noteContent = `
# Introduction to Data Structures

Data structures are fundamental building blocks in computer science that help us organize and store data efficiently. Understanding data structures is crucial for writing efficient algorithms and solving complex computational problems.

## What are Data Structures?

A data structure is a particular way of organizing data in a computer so that it can be used effectively. Different kinds of data structures are suited to different kinds of applications.

### Key Characteristics

1. **Organization**: How data is arranged and accessed
2. **Operations**: What actions can be performed on the data
3. **Efficiency**: Time and space complexity considerations
4. **Use Cases**: When to use specific data structures

## Common Data Structures

### Arrays
Arrays are the simplest data structure, storing elements in contiguous memory locations.

**Advantages:**
- Fast access to elements using indices
- Memory efficient
- Simple to implement

**Disadvantages:**
- Fixed size (in most languages)
- Insertion and deletion can be expensive

### Linked Lists
A linked list is a linear data structure where elements are stored in nodes, and each node contains data and a reference to the next node.

**Types of Linked Lists:**
1. Singly Linked List
2. Doubly Linked List
3. Circular Linked List

### Stacks
A stack is a Last-In-First-Out (LIFO) data structure.

**Key Operations:**
- Push: Add element to top
- Pop: Remove element from top
- Peek/Top: View top element without removing

### Queues
A queue is a First-In-First-Out (FIFO) data structure.

**Key Operations:**
- Enqueue: Add element to rear
- Dequeue: Remove element from front
- Front: View front element without removing

## Mathematical Complexity

When analyzing data structures, we consider:

**Time Complexity:**
- Access: O(1) for arrays, O(n) for linked lists
- Search: O(n) for unsorted structures
- Insertion: Varies by structure and position
- Deletion: Varies by structure and position

**Space Complexity:**
- Additional memory required beyond the data itself
- Overhead for pointers, metadata, etc.

## Practical Applications

### Real-World Examples

1. **Web Browsers**: Stack for back button functionality
2. **Operating Systems**: Queue for process scheduling
3. **Databases**: B-trees for indexing
4. **Graphics**: Graphs for representing relationships

## Best Practices

1. **Choose the Right Structure**: Consider your use case
2. **Understand Trade-offs**: Time vs. space complexity
3. **Consider Future Modifications**: Will you need to resize or restructure?
4. **Test Performance**: Benchmark with real data

## Summary

Data structures are the foundation of efficient programming. By understanding when and how to use different structures, you can write more efficient and maintainable code.

**Key Takeaways:**
- Arrays for fast access and simple operations
- Linked lists for dynamic sizing
- Stacks for LIFO operations
- Queues for FIFO operations
- Always consider time and space complexity

Practice implementing these structures in your preferred programming language to solidify your understanding.
`;

export default function NoteDetail() {
  const params = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(75);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const noteData = {
    id: params.id,
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{noteData.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {noteData.author}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {noteData.duration}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {noteData.rating}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{noteData.subject}</Badge>
                <Badge className={getDifficultyColor(noteData.difficulty)}>
                  {noteData.difficulty}
                </Badge>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Updated {noteData.lastUpdated}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Reading Progress */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Reading Progress</span>
                <span className="text-sm font-medium">{readingProgress}%</span>
              </div>
              <Progress value={readingProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: noteContent.split('\n').map(line => {
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">${line.substring(2)}</h1>`;
                  } else if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-semibold mb-4 mt-8 text-slate-800 dark:text-slate-200">${line.substring(3)}</h2>`;
                  } else if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-medium mb-3 mt-6 text-slate-700 dark:text-slate-300">${line.substring(4)}</h3>`;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p class="font-semibold mb-2 text-slate-800 dark:text-slate-200">${line.substring(2, line.length - 2)}</p>`;
                  } else if (line.startsWith('- ')) {
                    return `<li class="mb-1 text-slate-700 dark:text-slate-300">${line.substring(2)}</li>`;
                  } else if (line.match(/^\d+\. /)) {
                    return `<li class="mb-1 text-slate-700 dark:text-slate-300">${line.substring(line.indexOf(' ') + 1)}</li>`;
                  } else if (line.trim() === '') {
                    return '<br>';
                  } else {
                    return `<p class="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">${line}</p>`;
                  }
                }).join('')
              }} />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous Note
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Next Note
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Floating Chat Button */}
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 z-40"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>

        {/* Chat Drawer */}
        <SubjectExpertChatDrawer
          open={chatOpen}
          onOpenChange={setChatOpen}
          subject={noteData.subject}
          topic={noteData.topic}
        />
      </div>
    </DashboardLayout>
  );
}