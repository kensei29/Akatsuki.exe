'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Heart,
  Brain,
  Clock,
  Users,
  DollarSign,
  Dumbbell,
  Lightbulb,
  Send,
  Bot,
  User,
  ArrowLeft,
} from 'lucide-react';

const supportCategories = [
  {
    id: 'mental-health',
    title: 'Mental Health',
    icon: Brain,
    description: 'Stress management, anxiety, depression support',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-900 dark:text-purple-100',
  },
  {
    id: 'time-management',
    title: 'Time Management',
    icon: Clock,
    description: 'Study schedules, productivity, work-life balance',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-900 dark:text-blue-100',
  },
  {
    id: 'relationships',
    title: 'Relationships',
    icon: Users,
    description: 'Family, friends, romantic relationships, social skills',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    textColor: 'text-pink-900 dark:text-pink-100',
  },
  {
    id: 'finance',
    title: 'Financial Guidance',
    icon: DollarSign,
    description: 'Budgeting, student loans, financial planning',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-900 dark:text-green-100',
  },
  {
    id: 'fitness',
    title: 'Health & Fitness',
    icon: Dumbbell,
    description: 'Physical health, exercise, nutrition, wellness',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-900 dark:text-orange-100',
  },
  {
    id: 'startup',
    title: 'Startup Advice',
    icon: Lightbulb,
    description: 'Entrepreneurship, business ideas, startup guidance',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-900 dark:text-yellow-100',
  },
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function PersonalSupport() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    const category = supportCategories.find(c => c.id === categoryId);
    setSelectedCategory(categoryId);
    
    // Initialize conversation with a warm welcome
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello! I'm here to provide support and guidance about ${category?.title.toLowerCase()}. I understand that life as a student can be challenging, and I'm here to listen and help. What's on your mind today? 💙`,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate empathetic AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateEmpathethicResponse(input, selectedCategory),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateEmpathethicResponse = (userInput: string, category: string | null) => {
    const responses = {
      'mental-health': [
        "I hear you, and what you're feeling is completely valid. It's brave of you to reach out. Remember that seeking help is a sign of strength, not weakness. Would you like to talk about what specific thoughts or feelings are troubling you?",
        "Thank you for sharing that with me. Mental health challenges are more common than you might think, especially among students. You're not alone in this. Let's work together to find some strategies that might help you feel better.",
        "I can sense that you're going through a difficult time. It's important to remember that these feelings are temporary, even when they don't feel that way. What small step could we take today to help you feel a little bit better?"
      ],
      'time-management': [
        "Time management can feel overwhelming, especially when you have so many responsibilities. Let's break this down into manageable pieces. What's the biggest challenge you're facing with your schedule right now?",
        "I understand how stressful it can be when it feels like there aren't enough hours in the day. You're doing your best, and that matters. Let's explore some strategies that might help you feel more in control of your time.",
        "It sounds like you're juggling a lot right now. That's really challenging, and it's understandable that you're feeling overwhelmed. What would success look like for you in terms of managing your time better?"
      ],
      'relationships': [
        "Relationships can be one of the most rewarding and challenging aspects of life. Thank you for trusting me with this. Remember that healthy relationships require effort from all parties involved. What specific situation would you like to talk through?",
        "I can hear that this relationship situation is weighing on you. It's natural to have ups and downs in any relationship. You deserve to be treated with respect and kindness. How are you feeling about everything right now?",
        "Navigating relationships during your student years can be particularly complex. You're growing and changing, and so are the people around you. What's the most important thing you'd like to work on in your relationships?"
      ],
      'finance': [
        "Financial stress is incredibly common among students, and you're definitely not alone in feeling this way. Money worries can be overwhelming, but there are always steps we can take to improve the situation. What's your biggest financial concern right now?",
        "I understand how anxiety-provoking financial issues can be. It's smart of you to think about these things now rather than later. Let's look at this step by step and see what options might be available to you.",
        "Financial planning as a student is challenging, but you're being responsible by thinking about it. Every small step towards financial awareness counts. What aspect of your finances would you like to focus on first?"
      ],
      'fitness': [
        "Taking care of your physical health is so important, especially during stressful times like being a student. Your body and mind are connected, and caring for one helps the other. What's motivating you to focus on your health right now?",
        "It's wonderful that you're thinking about your health and wellness. Starting or maintaining healthy habits during your studies shows great self-awareness. What specific health goals are you hoping to work towards?",
        "Your health is your foundation for everything else you want to achieve. It's great that you're prioritizing this. Remember, small consistent changes often lead to the biggest improvements. What feels like a realistic first step for you?"
      ],
      'startup': [
        "Entrepreneurial thinking is exciting! It takes courage to consider starting something of your own. The fact that you're thinking about this shows initiative and creativity. What kind of business or startup idea has been on your mind?",
        "Starting a business while being a student can be both challenging and rewarding. You have the advantage of being in a learning environment with access to resources and mentors. What's the biggest question or concern you have about your startup idea?",
        "I love that you're thinking entrepreneurially! Some of the most successful companies were started by students. Your unique perspective and energy are valuable assets. What problem are you hoping to solve with your startup idea?"
      ]
    };

    const categoryResponses = responses[category as keyof typeof responses] || [
      "Thank you for sharing that with me. I'm here to listen and support you through whatever you're going through. You're not alone, and it's okay to ask for help. What would be most helpful for you right now?"
    ];

    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const selectedCategoryData = supportCategories.find(c => c.id === selectedCategory);

  if (selectedCategory) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Chat Header */}
          <div className={`p-4 border-b border-slate-200 dark:border-slate-700 ${selectedCategoryData?.bgColor}`}>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedCategory(null)}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${selectedCategoryData?.color}`}>
                  {selectedCategoryData?.icon && (
                    <selectedCategoryData.icon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${selectedCategoryData?.textColor}`}>
                    {selectedCategoryData?.title} Support
                  </h2>
                  <p className="text-sm opacity-75">
                    I'm here to listen and help with empathy and understanding
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-indigo-100' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-4 shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Input
                  placeholder="Share what's on your mind... I'm here to listen 💙"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                  className="flex-1 rounded-full border-2 focus:border-pink-300 dark:focus:border-pink-600"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!input.trim() || isTyping}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Personal Support Center
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your caring companion for life's challenges. I'm here to listen, support, and guide you through any situation with empathy and understanding.
          </p>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {supportCategories.map((category) => (
            <Card 
              key={category.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                  <category.icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {category.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {category.description}
                </p>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0">
                  Get Support
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">
            Why Choose Our Support?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Empathetic Listening</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Non-judgmental support that truly understands your feelings
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Practical Guidance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Actionable advice tailored to your specific situation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">24/7 Availability</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Always here when you need someone to talk to
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
            Crisis Resources
          </h3>
          <p className="text-red-800 dark:text-red-200 text-sm mb-4">
            If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for immediate help:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-red-900 dark:text-red-100">National Suicide Prevention Lifeline:</strong>
              <br />
              <span className="text-red-800 dark:text-red-200">988 (US) - Available 24/7</span>
            </div>
            <div>
              <strong className="text-red-900 dark:text-red-100">Crisis Text Line:</strong>
              <br />
              <span className="text-red-800 dark:text-red-200">Text HOME to 741741</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}