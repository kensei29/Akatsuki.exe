"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Brain,
    Heart,
    Smile,
    Battery,
    Sun,
    Moon,
    Coffee,
    MessageCircle,
    Send,
    Sparkles,
    Clock,
    Users,
    DollarSign,
    Dumbbell,
    Lightbulb,
    ArrowLeft,
    User,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const supportCategories = [
    {
        id: "mental-health",
        title: "Mental Health",
        icon: Brain,
        description: "Stress management, anxiety, depression support",
        color: "from-purple-500 to-indigo-600",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        textColor: "text-purple-900 dark:text-purple-100",
    },
    {
        id: "time-management",
        title: "Time Management",
        icon: Clock,
        description: "Study schedules, productivity, work-life balance",
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-900 dark:text-blue-100",
    },
    {
        id: "relationships",
        title: "Relationships",
        icon: Users,
        description: "Family, friends, romantic relationships, social skills",
        color: "from-pink-500 to-rose-600",
        bgColor: "bg-pink-50 dark:bg-pink-900/20",
        textColor: "text-pink-900 dark:text-pink-100",
    },
    {
        id: "finance",
        title: "Financial Guidance",
        icon: DollarSign,
        description: "Budgeting, student loans, financial planning",
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        textColor: "text-green-900 dark:text-green-100",
    },
    {
        id: "fitness",
        title: "Health & Fitness",
        icon: Dumbbell,
        description: "Physical health, exercise, nutrition, wellness",
        color: "from-orange-500 to-red-600",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        textColor: "text-orange-900 dark:text-orange-100",
    },
    {
        id: "startup",
        title: "Startup Advice",
        icon: Lightbulb,
        description: "Entrepreneurship, business ideas, startup guidance",
        color: "from-yellow-500 to-orange-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        textColor: "text-yellow-900 dark:text-yellow-100",
    },
];

const wellnessCategories = [
    {
        icon: Brain,
        title: "Mental Wellness",
        description:
            "Tips for maintaining mental clarity and emotional balance",
        tips: [
            "Practice mindfulness meditation",
            "Set realistic goals and expectations",
            "Take regular breaks during study",
            "Maintain a thought journal",
        ],
    },
    {
        icon: Battery,
        title: "Stress Management",
        description: "Techniques to handle academic and personal stress",
        tips: [
            "Break large tasks into smaller ones",
            "Practice deep breathing exercises",
            "Take regular exercise breaks",
            "Use time management tools",
        ],
    },
    {
        icon: Sun,
        title: "Daily Routine",
        description: "Establish a healthy daily schedule",
        tips: [
            "Maintain consistent sleep schedule",
            "Plan study sessions effectively",
            "Include physical activity",
            "Make time for hobbies",
        ],
    },
    {
        icon: Heart,
        title: "Self-Care",
        description: "Taking care of your physical and emotional needs",
        tips: [
            "Stay hydrated throughout the day",
            "Eat nutritious meals regularly",
            "Take time for activities you enjoy",
            "Connect with friends and family",
        ],
    },
];

const mockResponses = {
    "feeling stressed":
        "I understand that you're feeling stressed. Remember that it's completely normal, especially during academic life. Here are some immediate steps you can take:\n\n1. Take deep breaths - try the 4-7-8 technique\n2. Go for a short walk\n3. Talk to a friend or family member\n4. Break down your tasks into smaller, manageable parts\n\nWould you like to discuss what's causing your stress?",
    "can't sleep":
        "Having trouble sleeping can be really frustrating. Here are some evidence-based tips that might help:\n\n1. Stick to a regular sleep schedule\n2. Avoid screens 1 hour before bed\n3. Try some light stretching or meditation\n4. Keep your room cool and dark\n5. Avoid caffeine after 2 PM\n\nWould you like to explore more relaxation techniques?",
    default:
        "I'm here to listen and support you. Could you tell me more about what's on your mind? Remember, it's okay to not be okay, and reaching out is a sign of strength.",
};

interface Message {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function PersonalSupport() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleCategorySelect = (categoryId: string) => {
        const category = supportCategories.find((c) => c.id === categoryId);
        setSelectedCategory(categoryId);

        // Initialize conversation with a warm welcome
        const welcomeMessage: Message = {
            id: "1",
            content: `Hello! I'm here to provide support and guidance about ${category?.title.toLowerCase()}. I understand that life as a student can be challenging, and I'm here to listen and help. What's on your mind today? 💙`,
            sender: "bot",
            timestamp: new Date(),
        };

        setMessages([welcomeMessage]);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate empathetic AI response
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: generateEmpathethicResponse(input, selectedCategory),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const generateEmpathethicResponse = (
        userInput: string,
        category: string | null
    ) => {
        const responses = {
            "mental-health": [
                "I hear you, and what you're feeling is completely valid. It's brave of you to reach out. Remember that seeking help is a sign of strength, not weakness. Would you like to talk about what specific thoughts or feelings are troubling you?",
                "Thank you for sharing that with me. Mental health challenges are more common than you might think, especially among students. You're not alone in this. Let's work together to find some strategies that might help you feel better.",
                "I can sense that you're going through a difficult time. It's important to remember that these feelings are temporary, even when they don't feel that way. What small step could we take today to help you feel a little bit better?",
            ],
            "time-management": [
                "Time management can feel overwhelming, especially when you have so many responsibilities. Let's break this down into manageable pieces. What's the biggest challenge you're facing with your schedule right now?",
                "I understand how stressful it can be when it feels like there aren't enough hours in the day. You're doing your best, and that matters. Let's explore some strategies that might help you feel more in control of your time.",
                "It sounds like you're juggling a lot right now. That's really challenging, and it's understandable that you're feeling overwhelmed. What would success look like for you in terms of managing your time better?",
            ],
            relationships: [
                "Relationships can be one of the most rewarding and challenging aspects of life. Thank you for trusting me with this. Remember that healthy relationships require effort from all parties involved. What specific situation would you like to talk through?",
                "I can hear that this relationship situation is weighing on you. It's natural to have ups and downs in any relationship. You deserve to be treated with respect and kindness. How are you feeling about everything right now?",
                "Navigating relationships during your student years can be particularly complex. You're growing and changing, and so are the people around you. What's the most important thing you'd like to work on in your relationships?",
            ],
            finance: [
                "Financial stress is incredibly common among students, and you're definitely not alone in feeling this way. Money worries can be overwhelming, but there are always steps we can take to improve the situation. What's your biggest financial concern right now?",
                "I understand how anxiety-provoking financial issues can be. It's smart of you to think about these things now rather than later. Let's look at this step by step and see what options might be available to you.",
                "Financial planning as a student is challenging, but you're being responsible by thinking about it. Every small step towards financial awareness counts. What aspect of your finances would you like to focus on first?",
            ],
            fitness: [
                "Taking care of your physical health is so important, especially during stressful times like being a student. Your body and mind are connected, and caring for one helps the other. What's motivating you to focus on your health right now?",
                "It's wonderful that you're thinking about your health and wellness. Starting or maintaining healthy habits during your studies shows great self-awareness. What specific health goals are you hoping to work towards?",
                "Your health is your foundation for everything else you want to achieve. It's great that you're prioritizing this. Remember, small consistent changes often lead to the biggest improvements. What feels like a realistic first step for you?",
            ],
            startup: [
                "Entrepreneurial thinking is exciting! It takes courage to consider starting something of your own. The fact that you're thinking about this shows initiative and creativity. What kind of business or startup idea has been on your mind?",
                "Starting a business while being a student can be both challenging and rewarding. You have the advantage of being in a learning environment with access to resources and mentors. What's the biggest question or concern you have about your startup idea?",
                "I love that you're thinking entrepreneurially! Some of the most successful companies were started by students. Your unique perspective and energy are valuable assets. What problem are you hoping to solve with your startup idea?",
            ],
        };

        const categoryResponses = responses[
            category as keyof typeof responses
        ] || [
            "Thank you for sharing that with me. I'm here to listen and support you through whatever you're going through. You're not alone, and it's okay to ask for help. What would be most helpful for you right now?",
        ];

        return categoryResponses[
            Math.floor(Math.random() * categoryResponses.length)
        ];
    };

    const selectedCategoryData = supportCategories.find(
        (c) => c.id === selectedCategory
    );

    if (selectedCategory) {
        return (
            <DashboardLayout>
                <div className="h-[calc(100vh-4rem)] flex flex-col">
                    {/* Chat Header */}
                    <div
                        className={`p-4 border-b border-slate-200 dark:border-slate-700 ${selectedCategoryData?.bgColor}`}
                    >
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
                                <div
                                    className={`p-3 rounded-2xl bg-gradient-to-r ${selectedCategoryData?.color}`}
                                >
                                    {selectedCategoryData?.icon && (
                                        <selectedCategoryData.icon className="h-6 w-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2
                                        className={`text-xl font-semibold ${selectedCategoryData?.textColor}`}
                                    >
                                        {selectedCategoryData?.title} Support
                                    </h2>
                                    <p className="text-sm opacity-75">
                                        I'm here to listen and help with empathy
                                        and understanding
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
                                    className={`flex gap-4 ${
                                        message.sender === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {message.sender === "bot" && (
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                                <Heart className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                                            message.sender === "user"
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md border border-slate-200 dark:border-slate-700"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">
                                            {message.content}
                                        </p>
                                        <p
                                            className={`text-xs mt-2 ${
                                                message.sender === "user"
                                                    ? "text-indigo-100"
                                                    : "text-slate-500 dark:text-slate-400"
                                            }`}
                                        >
                                            {message.timestamp.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>
                                    </div>

                                    {message.sender === "user" && (
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
                                            <div
                                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.1s",
                                                }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            ></div>
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
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
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
                        Your caring companion for life's challenges. I'm here to
                        listen, support, and guide you through any situation
                        with empathy and understanding.
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
                                <div
                                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200`}
                                >
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

                {/* Wellness Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wellnessCategories.map((category, index) => (
                        <Card key={index} className="border-0 shadow-md">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                        <category.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <CardTitle>{category.title}</CardTitle>
                                        <CardDescription>
                                            {category.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {category.tips.map((tip, tipIndex) => (
                                        <li
                                            key={tipIndex}
                                            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Chat Section */}
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-indigo-600" />
                            Personal Support Chat
                        </CardTitle>
                        <CardDescription>
                            Share your thoughts or concerns in a safe,
                            judgment-free space
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-[300px] border rounded-lg p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900/50">
                                {messages.length === 0 ? (
                                    <div className="text-center text-slate-500 dark:text-slate-400 mt-20">
                                        <Smile className="h-8 w-8 mx-auto mb-2" />
                                        <p>
                                            How are you feeling today? I'm here
                                            to listen and help.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                msg.sender === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${
                                                    msg.sender === "user"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                                }`}
                                            >
                                                <p className="text-sm whitespace-pre-line">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Share what's on your mind..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                    className="flex-1"
                                />
                                <Button onClick={handleSendMessage} size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
