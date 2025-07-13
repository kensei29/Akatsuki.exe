"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CareerGuidanceChat from "@/components/career/CareerGuidanceChat";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Compass } from "lucide-react";

export default function CareerGuidance() {
    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                            <Compass className="h-8 w-8 text-indigo-600" />
                            Career Guidance
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Get expert advice and guidance for your tech career
                            journey
                        </p>
                    </div>
                </div>

                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle>Career Advisor</CardTitle>
                        <CardDescription>
                            Chat with our AI career guidance expert to explore
                            opportunities and plan your future
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CareerGuidanceChat />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
