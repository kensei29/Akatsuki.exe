"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageCircle, Compass } from "lucide-react";

export default function CareerPage() {
    const router = useRouter();

    const options = [
        {
            title: "Chat with Guide",
            description: "Get personalized career advice through chat",
            icon: <MessageCircle className="h-6 w-6" />,
            href: "/dashboard/career/chat",
        },
        {
            title: "Find Career Plan",
            description: "Discover and plan your career path",
            icon: <Compass className="h-6 w-6" />,
            href: "/dashboard/career/plan",
        },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-[80vh] p-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        {options.map((option, index) => (
                            <Card
                                key={index}
                                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => router.push(option.href)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                        {option.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">
                                            {option.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
