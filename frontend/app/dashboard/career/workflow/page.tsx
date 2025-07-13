"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Route } from "lucide-react";
import ChatDrawer from "@/components/career/ChatDrawer";

interface WorkflowStep {
    id: string;
    type: string;
    content: string;
    options?: string[];
}

export default function CareerWorkflow() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [showChat, setShowChat] = useState(false);
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        startWorkflow();
    }, []);

    const startWorkflow = async () => {
        // First message in the workflow
        const initialStep: WorkflowStep = {
            id: "start",
            type: "question",
            content:
                "What interests you most about technology and computer science?",
            options: [
                "Building and creating new applications",
                "Working with data and finding insights",
                "Developing intelligent systems",
                "Ensuring system security",
                "Creating user experiences",
            ],
        };
        setCurrentStep(initialStep);
        setChatHistory([
            "Welcome to career guidance! Let's find your ideal path.",
        ]);
    };

    const handleOptionSelect = async (option: string) => {
        setIsLoading(true);
        // Add the selection to chat history
        setChatHistory((prev) => [...prev, `You: ${option}`]);

        try {
            const response = await fetch("/api/career/workflow-step", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentStep: currentStep?.id,
                    selection: option,
                }),
            });

            if (!response.ok) throw new Error("Failed to get next step");

            const data = await response.json();

            // Add the AI response to chat history
            setChatHistory((prev) => [...prev, `Assistant: ${data.content}`]);

            if (data.type === "final") {
                setCurrentStep(null);
            } else {
                setCurrentStep(data);
            }
        } catch (error) {
            console.error("Error in workflow:", error);
            setChatHistory((prev) => [
                ...prev,
                "Assistant: Sorry, there was an error. Please try again.",
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/career/generate-roadmap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chatHistory }),
            });

            if (!response.ok) throw new Error("Failed to generate roadmap");

            const data = await response.json();
            router.push(`/dashboard/career/roadmap/${data.domainSlug}`);
        } catch (error) {
            console.error("Error generating roadmap:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Career Discovery</CardTitle>
                        <CardDescription>
                            Let's explore your interests and find the perfect
                            career path for you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            {chatHistory.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${
                                        message.startsWith("You:")
                                            ? "text-right"
                                            : "text-left"
                                    }`}
                                >
                                    <div
                                        className={`inline-block p-3 rounded-lg ${
                                            message.startsWith("You:")
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        }`}
                                    >
                                        {message}
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>

                        <div className="mt-6 space-y-4">
                            {currentStep?.options ? (
                                <div className="grid gap-3">
                                    {currentStep.options.map(
                                        (option, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                className="justify-start text-left h-auto py-3 px-4"
                                                onClick={() =>
                                                    handleOptionSelect(option)
                                                }
                                                disabled={isLoading}
                                            >
                                                {option}
                                            </Button>
                                        )
                                    )}
                                </div>
                            ) : chatHistory.length > 1 ? (
                                <Button
                                    className="w-full"
                                    onClick={handleGenerateRoadmap}
                                    disabled={isLoading}
                                >
                                    <Route className="mr-2 h-4 w-4" />
                                    Generate Career Roadmap
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
                    onClick={() => setShowChat(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>

                <ChatDrawer open={showChat} onOpenChange={setShowChat} />
            </div>
        </DashboardLayout>
    );
}
