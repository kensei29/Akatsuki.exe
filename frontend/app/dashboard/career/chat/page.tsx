"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const suggestedQueries = [
        "What career paths are available in AI and Machine Learning?",
        "How do I become a Full Stack Developer?",
        "What skills should I focus on for Cloud Computing?",
        "Tell me about career opportunities in Cybersecurity",
        "How can I transition into tech from another field?",
    ];

    const mockResponses: { [key: string]: string } = {
        "ai and machine learning": `Here are the exciting career paths in AI and Machine Learning:

1. Machine Learning Engineer
   • Core Skills: Python, TensorFlow, PyTorch
   • Salary Range: $120,000 - $180,000
   • Key Areas: Deep Learning, NLP, Computer Vision
   • Top Employers: Google, OpenAI, Microsoft, Meta

2. AI Research Scientist
   • Required: Advanced Math, PhD preferred
   • Salary Range: $150,000 - $220,000
   • Focus: Developing new AI models
   • Impact: Pushing AI boundaries

3. MLOps Engineer
   • Skills: ML + DevOps
   • Salary: $130,000 - $190,000
   • Role: ML model deployment
   • Growth: High demand

4. AI Product Manager
   • Background: Tech + Business
   • Salary: $140,000 - $200,000
   • Focus: AI product strategy
   • Key skill: Bridging technical & business

Latest Trends:
• Generative AI is booming
• Edge AI is growing
• AI Ethics is crucial
• AutoML is advancing

The field offers excellent growth potential and competitive compensation.`,

        "full stack developer": `Roadmap to becoming a Full Stack Developer:

1. Frontend Development
   • HTML5, CSS3, JavaScript ES6+
   • React or Next.js
   • TypeScript for type safety
   • UI/UX fundamentals

2. Backend Development
   • Node.js/Express
   • Database design
   • REST APIs
   • Authentication & Security

3. Essential Tools
   • Git version control
   • Docker containers
   • AWS/Vercel deployment
   • Testing frameworks

4. Best Practices
   • Clean code principles
   • Performance optimization
   • Responsive design
   • Security best practices

Learning Path:
1. Start with HTML/CSS/JS (2-3 months)
2. Move to React (2-3 months)
3. Learn backend (3-4 months)
4. Build projects (ongoing)

Success Tips:
• Build real projects
• Contribute to open source
• Join dev communities
• Keep learning new tools

You can be job-ready in 8-12 months with dedicated practice!`,

        "cloud computing": `Essential Cloud Computing Skills for 2025:

1. Core Cloud Platforms
   • AWS (Market Leader)
   • Microsoft Azure
   • Google Cloud
   • Multi-cloud strategies

2. Key Technologies
   • Containers (Docker)
   • Kubernetes
   • Serverless
   • Infrastructure as Code

3. Required Skills
   • Cloud Architecture
   • Security & Compliance
   • Cost Optimization
   • Performance Tuning

4. Certifications to Target
   • AWS Solutions Architect
   • Azure Administrator
   • Google Cloud Engineer
   • Kubernetes (CKA)

Career Paths:
• Cloud Architect: $150k+
• DevOps Engineer: $130k+
• Cloud Security: $140k+
• SRE: $145k+

The cloud market is growing rapidly with excellent career prospects!`,

        cybersecurity: `Career Opportunities in Cybersecurity:

1. Security Analyst
   • Role: Threat detection
   • Tools: SIEM, IDS/IPS
   • Salary: $90k - $130k
   • Entry point to security

2. Penetration Tester
   • Skills: Ethical hacking
   • Tools: Metasploit, Burp Suite
   • Salary: $100k - $160k
   • Certification: OSCP

3. Security Engineer
   • Focus: Security architecture
   • Skills: Cloud security, IAM
   • Salary: $120k - $180k
   • High demand role

4. Security Architect
   • Level: Senior role
   • Scope: Enterprise security
   • Salary: $150k - $200k
   • Strategic position

Key Requirements:
• Strong networking knowledge
• Programming skills
• Security certifications
• Analytical mindset

The cybersecurity field has 0% unemployment and growing demand!`,

        "transition into tech": `Guide for Transitioning into Tech:

1. Choose Your Path
   • Web Development (Fastest)
   • Data Analytics (Business background)
   • UX Design (Creative background)
   • Product Management (Any background)

2. Learning Strategy
   • Online courses (Udemy, Coursera)
   • Coding bootcamps (12-24 weeks)
   • Personal projects (Portfolio)
   • Tech certifications

3. Practical Steps
   • Start with basics
   • Build projects
   • Network in tech
   • Update LinkedIn

4. Timeline & Costs
   • Self-study: 6-12 months, $500-1000
   • Bootcamp: 3-6 months, $10k-15k
   • Part-time: 12-18 months
   • ROI: Usually within 1 year

Success Stories:
Many have successfully switched from:
• Teaching to Development
• Marketing to Product
• Finance to Data Science
• Sales to Tech Sales

You can do it with dedication and the right plan!`,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentInput = input.trim();
        if (!currentInput) return;

        // Add user message
        const userMessage = { role: "user" as const, content: currentInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find matching response
        const inputLower = currentInput.toLowerCase();
        let response =
            "I can help you with:\n• AI and Machine Learning careers\n• Full Stack Development path\n• Cloud Computing skills\n• Cybersecurity opportunities\n• Transitioning into tech\n\nPlease ask about any of these topics!";

        if (
            inputLower.includes("ai") ||
            inputLower.includes("machine learning")
        ) {
            response = mockResponses["ai and machine learning"];
        } else if (
            inputLower.includes("full stack") ||
            inputLower.includes("developer")
        ) {
            response = mockResponses["full stack developer"];
        } else if (inputLower.includes("cloud")) {
            response = mockResponses["cloud computing"];
        } else if (
            inputLower.includes("security") ||
            inputLower.includes("cyber")
        ) {
            response = mockResponses["cybersecurity"];
        } else if (
            inputLower.includes("transition") ||
            inputLower.includes("switch") ||
            inputLower.includes("change career")
        ) {
            response = mockResponses["transition into tech"];
        }

        // Add assistant response
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response },
        ]);
        setIsLoading(false);
    };

    const handleSuggestedQuery = (query: string) => {
        setInput(query);
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };

    return (
        <DashboardLayout>
            <div className="min-h-[80vh] p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Chat messages area */}
                    <div className="min-h-[60vh] bg-slate-50 dark:bg-slate-900 rounded-lg mb-4 flex flex-col">
                        <ScrollArea className="flex-1 p-4">
                            {messages.length === 0 ? (
                                <div className="text-center space-y-6 max-w-xl mx-auto py-12">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                                            <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                        Welcome to Career Guide!
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        I'm here to help you explore career
                                        opportunities and answer your questions.
                                        Try asking one of these:
                                    </p>
                                    <div className="grid gap-3">
                                        {suggestedQueries.map(
                                            (query, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    className="text-left h-auto p-4 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    onClick={() =>
                                                        handleSuggestedQuery(
                                                            query
                                                        )
                                                    }
                                                >
                                                    {query}
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex gap-3 text-sm",
                                                message.role === "user" &&
                                                    "flex-row-reverse"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "p-3 rounded-lg max-w-[80%]",
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    {message.role === "user" ? (
                                                        <User className="h-5 w-5" />
                                                    ) : (
                                                        <Bot className="h-5 w-5" />
                                                    )}
                                                    <span className="font-medium">
                                                        {message.role === "user"
                                                            ? "You"
                                                            : "Career Guide"}
                                                    </span>
                                                </div>
                                                <div className="whitespace-pre-wrap">
                                                    {message.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3">
                                            <div className="bg-muted p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Bot className="h-5 w-5" />
                                                    <span className="font-medium">
                                                        Career Guide
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input form */}
                        <div className="p-4 border-t border-border bg-background rounded-b-lg">
                            <form
                                onSubmit={handleSubmit}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your question here..."
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
