"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
    messages?: string[];
}

export default function LoadingScreen({ messages }: LoadingScreenProps) {
    const [loadingText, setLoadingText] = useState("");

    const defaultMessages = [
        "Fetching trending domains from our servers...",
        "Analyzing real-time market data...",
        "Gathering salary insights and job trends...",
        "Compiling comprehensive domain information...",
        "Preparing personalized career insights...",
    ];

    const displayMessages = messages || defaultMessages;

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            setLoadingText(displayMessages[currentIndex]);
            currentIndex = (currentIndex + 1) % displayMessages.length;
        }, 2000);

        return () => clearInterval(interval);
    }, [displayMessages]);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
                <div className="flex flex-col items-center space-y-6">
                    {/* Animated dots */}
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                    </div>

                    {/* Loading text */}
                    <p className="text-slate-900 dark:text-slate-100 text-lg text-center min-h-[2rem] transition-all">
                        {loadingText}
                    </p>
                </div>
            </div>
        </div>
    );
}
