"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, User, Bot, ChevronRight } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const suggestedQuestions = [
    "What career paths are available in AI and Machine Learning?",
    "How do I become a Full Stack Developer?",
    "What are the highest paying tech jobs in 2025?",
    "What skills do I need for a career in cybersecurity?",
    "How to transition into tech from another field?",
];

const mockResponses: { [key: string]: string } = {
    ai: `Here are the key career paths in AI and Machine Learning:

1. Machine Learning Engineer
   • Skills: Python, TensorFlow, PyTorch
   • Salary Range: $120,000 - $180,000
   • Key Areas: Deep Learning, NLP, Computer Vision
   • Companies: Google, OpenAI, Microsoft

2. AI Research Scientist
   • Skills: Advanced Math, Research Methods
   • Salary Range: $150,000 - $220,000
   • Focus: Developing new AI models
   • Required: PhD typically preferred

3. Data Scientist
   • Skills: Statistics, Python, ML
   • Salary Range: $100,000 - $160,000
   • Focus: Practical AI applications
   • Growth: High demand continues

4. AI Product Manager
   • Skills: Technical background + Business
   • Salary Range: $130,000 - $190,000
   • Role: Bridge technical and business
   • Trend: Increasingly important

The field is rapidly evolving with new specializations emerging regularly.`,

    "full stack": `Roadmap to becoming a Full Stack Developer:

1. Frontend Development
   • HTML, CSS, JavaScript
   • React/Vue/Angular
   • Responsive Design
   • TypeScript

2. Backend Development
   • Node.js/Python/Java
   • REST APIs
   • Database Management
   • Server Architecture

3. DevOps & Tools
   • Git Version Control
   • Docker & Kubernetes
   • CI/CD Pipelines
   • Cloud Platforms (AWS/Azure)

4. Recommended Learning Path
   • Start with HTML/CSS/JS
   • Move to a frontend framework
   • Learn backend basics
   • Add database knowledge
   • Master deployment

Estimated Timeline: 12-18 months of dedicated learning
Entry Level Salary: $70,000 - $100,000`,

    high: `Top Paying Tech Jobs in 2025:

1. AI/ML Architect
   • Salary: $180,000 - $250,000
   • High demand, limited talent pool
   • Leading AI initiatives

2. Cloud Solutions Architect
   • Salary: $160,000 - $220,000
   • Multi-cloud expertise
   • Enterprise architecture

3. Blockchain Developer
   • Salary: $150,000 - $200,000
   • Web3 and DeFi focus
   • Smart contract development

4. Security Engineer
   • Salary: $140,000 - $210,000
   • Zero-trust architecture
   • Threat modeling

5. DevOps Engineer
   • Salary: $130,000 - $180,000
   • Automation expertise
   • Platform engineering

Note: Salaries vary by location, experience, and company size.`,

    security: `Essential Skills for Cybersecurity Career:

1. Technical Foundation
   • Network Security
   • Operating Systems
   • Programming (Python, C++)
   • Cloud Security

2. Security Tools
   • Wireshark
   • Metasploit
   • Nmap
   • Burp Suite

3. Certifications
   • CompTIA Security+
   • CISSP
   • CEH
   • OSCP

4. Soft Skills
   • Analytical Thinking
   • Problem Solving
   • Communication
   • Continuous Learning

Career Paths:
• Security Analyst
• Penetration Tester
• Security Engineer
• Security Architect

Average Salary: $95,000 - $150,000`,

    transition: `Guide to Transitioning into Tech:

1. Choose Your Path
   • Web Development (Fastest)
   • Data Analysis (Good for analysts)
   • UX Design (Creative background)
   • Product Management (Business background)

2. Learning Strategy
   • Start with fundamentals
   • Take online courses
   • Build practical projects
   • Get certifications

3. Gaining Experience
   • Personal projects
   • Open source contributions
   • Freelance work
   • Internships

4. Networking
   • Tech meetups
   • LinkedIn connections
   • GitHub presence
   • Tech conferences

Timeline: 6-12 months
Success Rate: High with dedication
Starting Salary: $60,000 - $85,000`,

    programming: `Here are the top programming careers to consider:

1. Full-Stack Development
   • Languages: JavaScript, Python, Java
   • Average Salary: $95,000
   • Growth: High demand

2. Machine Learning Engineer
   • Skills: Python, TensorFlow, PyTorch
   • Average Salary: $120,000
   • Future Outlook: Excellent

3. Cloud Developer
   • Technologies: AWS, Azure, GCP
   • Average Salary: $105,000
   • Market: Rapidly growing

4. Mobile App Developer
   • Platforms: iOS, Android
   • Average Salary: $90,000
   • Opportunities: Abundant

Choose based on your interests and market demand!`,

    software: `Career paths in software development:

1. Frontend Development
   • Focus: User interfaces
   • Skills: HTML, CSS, JavaScript
   • Best for: Visual thinkers

2. Backend Development
   • Focus: Server logic
   • Skills: Python, Java, SQL
   • Best for: Problem solvers

3. DevOps Engineering
   • Focus: Infrastructure
   • Skills: Docker, Kubernetes
   • Best for: System thinkers

4. Quality Assurance
   • Focus: Testing
   • Skills: Automation, Testing frameworks
   • Best for: Detail-oriented minds`,

    data: `Data-focused career opportunities:

1. Data Scientist
   • Skills: Statistics, ML, Python
   • Projects: Predictive models
   • Impact: High business value

2. Data Engineer
   • Skills: SQL, ETL, Big Data
   • Focus: Data infrastructure
   • Growth: Very high demand

3. Business Intelligence
   • Tools: Tableau, Power BI
   • Focus: Data visualization
   • Role: Decision support

4. Data Analyst
   • Skills: SQL, Excel, Statistics
   • Focus: Insights generation
   • Entry: Good starting point`,

    salary: `Tech Career Salaries (2025):

Entry Level:
• Software Engineer: $70-90k
• Data Analyst: $65-85k
• UX Designer: $60-80k

Mid Level (3-5 years):
• Senior Developer: $120-160k
• Data Scientist: $130-170k
• DevOps Engineer: $125-165k

Senior Level (5+ years):
• Tech Lead: $160-200k
• Solutions Architect: $180-220k
• ML Engineer: $170-210k`,

    skills: `Essential Tech Skills for 2025:

1. Technical Skills
   • Programming Languages
   • Cloud Platforms
   • Version Control
   • Testing

2. Soft Skills
   • Problem Solving
   • Communication
   • Team Collaboration
   • Time Management

3. Industry Knowledge
   • Agile Methodologies
   • CI/CD
   • Security Best Practices
   • System Design

4. Tools & Platforms
   • Git
   • Docker
   • AWS/Azure
   • Jira`,
};

const defaultResponse = `I can help you with career guidance in tech! Ask me about:

• Programming and software development careers
• Data science and analytics paths
• Industry salary expectations
• Essential skills and technologies
• Learning resources and roadmaps

What would you like to know more about?`;

export default function CareerGuidanceChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hello! I'm your career guidance assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        let response = defaultResponse;

        if (
            inputLower.includes("ai") ||
            inputLower.includes("machine learning")
        ) {
            response = mockResponses["ai"];
        } else if (
            inputLower.includes("full stack") ||
            inputLower.includes("full-stack")
        ) {
            response = mockResponses["full stack"];
        } else if (
            inputLower.includes("high") ||
            inputLower.includes("salary") ||
            inputLower.includes("paying")
        ) {
            response = mockResponses["high"];
        } else if (
            inputLower.includes("security") ||
            inputLower.includes("cyber")
        ) {
            response = mockResponses["security"];
        } else if (
            inputLower.includes("transition") ||
            inputLower.includes("switch") ||
            inputLower.includes("change career")
        ) {
            response = mockResponses["transition"];
        }

        // Add assistant response
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response },
        ]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-background">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-3 text-sm",
                                message.role === "user" && "flex-row-reverse"
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

                    {/* Show suggestions only when no messages except initial */}
                    {messages.length === 1 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Suggested questions:
                            </p>
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
                                    onClick={() => {
                                        setInput(question);
                                        handleSubmit(
                                            new Event("submit") as any
                                        );
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question here..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
