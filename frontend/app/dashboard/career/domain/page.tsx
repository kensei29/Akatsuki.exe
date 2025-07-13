"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import DetailedRoadmapModal from "@/components/career/DetailedRoadmapModal";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkflowStep {
    id: string;
    type: string;
    content: string;
    options?: string[];
}

export default function DomainWorkflowPage() {
    const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [roadmapData, setRoadmapData] = useState(null);

    useEffect(() => {
        // Initial step to start the workflow
        startWorkflow();
    }, []);

    const startWorkflow = async () => {
        try {
            const response = await fetch("/api/career/start-workflow", {
                method: "POST",
            });
            const data = await response.json();
            setCurrentStep(data);
        } catch (error) {
            console.error("Error starting workflow:", error);
        }
    };

    const handleOptionSelect = async (option: string) => {
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
            const data = await response.json();

            // Add the interaction to chat history
            setChatHistory((prev) => [
                ...prev,
                `You: ${option}`,
                `Assistant: ${data.content}`,
            ]);

            if (data.type === "final") {
                // When we reach the final step, show the generate roadmap button
                setCurrentStep(null);
            } else {
                setCurrentStep(data);
            }
        } catch (error) {
            console.error("Error in workflow step:", error);
        }
    };

    const handleGenerateRoadmap = async () => {
        try {
            const response = await fetch("/api/career/generate-roadmap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chatHistory }),
            });
            const data = await response.json();
            setRoadmapData(data);
            setShowRoadmap(true);
        } catch (error) {
            console.error("Error generating roadmap:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Career Path Explorer</CardTitle>
                    <CardDescription>
                        Let's find your ideal career path together
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

                    {currentStep?.options && (
                        <div className="mt-4 space-y-2">
                            {currentStep.options.map((option) => (
                                <Button
                                    key={option}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    )}

                    {!currentStep && chatHistory.length > 0 && (
                        <Button
                            className="w-full mt-4"
                            onClick={handleGenerateRoadmap}
                        >
                            Generate Career Roadmap
                        </Button>
                    )}
                </CardContent>
            </Card>

            {roadmapData && (
                <DetailedRoadmapModal
                    open={showRoadmap}
                    onOpenChange={setShowRoadmap}
                    roadmapData={roadmapData}
                    domainSlug="custom"
                />
            )}
        </div>
    );
}
