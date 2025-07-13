"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
    TrendingUp,
    Sparkles,
    Bot,
    ArrowRight,
    Server,
    Brain,
} from "lucide-react";

export default function CareerPlanPage() {
    const router = useRouter();

    const industryInsights = [
        {
            icon: <Bot className="h-6 w-6 text-purple-500" />,
            title: "AI Engineers in High Demand",
            description:
                "AI Engineer salaries surge past $200K as companies race to implement AI solutions. OpenAI, Google, and startups are actively hiring.",
            tag: "Trending",
        },
        {
            icon: <Server className="h-6 w-6 text-blue-500" />,
            title: "Cloud Computing Growth",
            description:
                "Cloud architects and DevOps engineers see 40% salary increase. AWS, Azure, and GCP skills are most sought after.",
            tag: "Hot Market",
        },
        {
            icon: <Brain className="h-6 w-6 text-green-500" />,
            title: "Machine Learning Revolution",
            description:
                "Machine Learning engineers are pioneering breakthrough applications in healthcare and finance. Average compensation exceeds $180K.",
            tag: "Growing Field",
        },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-[80vh] p-6">
                <div className="max-w-4xl mx-auto space-y-10">
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Explore Tech Career Opportunities
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Stay updated with the latest industry trends and
                            discover high-growth career paths
                        </p>
                    </div>

                    {/* Industry Insights Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-6">
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-xl font-semibold">
                                Latest Industry Insights
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {industryInsights.map((insight, index) => (
                                <Card
                                    key={index}
                                    className="p-6 border-l-4 border-l-indigo-500"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                {insight.icon}
                                            </div>
                                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                                {insight.tag}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                                                {insight.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {insight.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full backdrop-blur-sm">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Ready to Find Your Perfect Domain?
                            </h2>
                            <p className="text-indigo-100">
                                Take our assessment to discover the tech domain
                                that matches your interests and skills
                            </p>
                            <Button
                                size="lg"
                                onClick={() =>
                                    router.push(
                                        "/dashboard/career/domain/assessment"
                                    )
                                }
                                className="bg-white text-indigo-600 hover:bg-indigo-50"
                            >
                                Find Your Future Domain
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
