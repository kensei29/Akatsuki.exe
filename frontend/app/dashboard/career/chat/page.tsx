"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from "lucide-react";

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [chatStarted, setChatStarted] = useState(false);

    const suggestedQueries = [
        "What career paths are available in AI and Machine Learning?",
        "How do I become a Full Stack Developer?",
        "What skills should I focus on for Cloud Computing?",
        "Tell me about career opportunities in Cybersecurity",
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setChatStarted(true);
            // Handle the chat input here
            console.log("Message sent:", input);
            setInput("");
        }
    };

    const handleSuggestedQuery = (query: string) => {
        setInput(query);
    };

    return (
        <DashboardLayout>
            <div className="min-h-[80vh] p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Chat messages area */}
                    <div className="min-h-[60vh] bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4 flex items-center justify-center">
                        {!chatStarted ? (
                            <div className="text-center space-y-6 max-w-xl">
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
                                    opportunities and answer your questions. Try
                                    asking one of these:
                                </p>
                                <div className="grid gap-3">
                                    {suggestedQueries.map((query, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="text-left h-auto p-4 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() =>
                                                handleSuggestedQuery(query)
                                            }
                                        >
                                            {query}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                {/* Chat messages will appear here */}
                            </div>
                        )}
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question here..."
                            className="flex-1"
                        />
                        <Button type="submit" disabled={!input.trim()}>
                            <Send className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
