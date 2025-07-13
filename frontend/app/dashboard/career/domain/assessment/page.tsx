"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/career/LoadingScreen";
import {
    ArrowRight,
    Bot,
    Cloud,
    Shield,
    Code,
    Database,
    ChartLine,
    CircuitBoard,
} from "lucide-react";

export default function DomainAssessmentPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 8000); // Show loading screen for 8 seconds

        return () => clearTimeout(timer);
    }, []);

    const domains = [
        {
            icon: <Bot className="h-6 w-6 text-purple-500" />,
            title: "Artificial Intelligence & ML",
            description:
                "Join the AI revolution! AI Engineers and ML specialists are among the highest-paid tech professionals, with average salaries of $150,000+. Companies are investing heavily in AI, creating massive demand.",
            skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
            growth: "40% YoY growth",
        },
        {
            icon: <Cloud className="h-6 w-6 text-blue-500" />,
            title: "Cloud Architecture",
            description:
                "Cloud computing is the backbone of modern tech. Cloud architects command salaries up to $200,000, with AWS, Azure, and GCP skills being crucial as businesses accelerate digital transformation.",
            skills: ["AWS", "Azure", "Kubernetes", "Docker"],
            growth: "35% YoY growth",
        },
        {
            icon: <Shield className="h-6 w-6 text-red-500" />,
            title: "Cybersecurity",
            description:
                "With increasing cyber threats, security experts are in critical demand. Cybersecurity professionals earn $130,000+ annually, with positions in every industry sector.",
            skills: ["Network Security", "Ethical Hacking", "Security Tools"],
            growth: "32% YoY growth",
        },
        {
            icon: <Code className="h-6 w-6 text-green-500" />,
            title: "Full Stack Development",
            description:
                "Full stack developers remain highly sought after, with average salaries of $120,000+. The rise of modern web technologies and frameworks keeps this field dynamic and rewarding.",
            skills: ["React", "Node.js", "TypeScript", "AWS"],
            growth: "25% YoY growth",
        },
        {
            icon: <Database className="h-6 w-6 text-orange-500" />,
            title: "Data Engineering",
            description:
                "Data Engineers build and maintain the data infrastructure powering AI and analytics. With salaries averaging $140,000, this role bridges data science and software engineering.",
            skills: ["SQL", "Python", "Spark", "Data Warehousing"],
            growth: "30% YoY growth",
        },
        {
            icon: <ChartLine className="h-6 w-6 text-indigo-500" />,
            title: "DevOps Engineering",
            description:
                "DevOps engineers streamline development processes and improve deployment efficiency. Average salaries exceed $135,000, with strong demand in companies of all sizes.",
            skills: ["CI/CD", "Docker", "Kubernetes", "Terraform"],
            growth: "28% YoY growth",
        },
        {
            icon: <CircuitBoard className="h-6 w-6 text-cyan-500" />,
            title: "Edge Computing",
            description:
                "Edge computing is revolutionizing IoT and real-time processing. Specialists in this emerging field earn $140,000+, with demand growing as 5G enables new applications.",
            skills: ["IoT", "Embedded Systems", "5G", "Real-time Systems"],
            growth: "45% YoY growth",
        },
    ];

    return (
        <DashboardLayout>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className="min-h-[80vh] p-6">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-4 mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Trending Tech Domains
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Explore these high-growth domains and find your
                                perfect career path in technology
                            </p>
                        </div>

                        {/* Domains Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {domains.map((domain, index) => (
                                <Card
                                    key={index}
                                    className="p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                    {domain.icon}
                                                </div>
                                                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                                    {domain.title}
                                                </h3>
                                            </div>
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                {domain.growth}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400">
                                            {domain.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {domain.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full mt-4"
                                            onClick={() =>
                                                (window.location.href = `/dashboard/career/domain/${domain.title
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`)
                                            }
                                        >
                                            Learn More
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
