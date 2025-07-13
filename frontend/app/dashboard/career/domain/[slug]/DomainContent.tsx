"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Download,
    TrendingUp,
    BriefcaseBusiness,
    GraduationCap,
    Code,
    ArrowLeft,
    DollarSign,
    Users,
    Clock,
    ExternalLink,
    Route,
} from "lucide-react";

interface DomainContentProps {
    domain: {
        title: string;
        description: string;
        growth: string;
        avgSalary: string;
        demandLevel: string;
        timeToMaster: string;
        whatToMaster: {
            title: string;
            skills: string[];
            description: string;
        }[];
        jobOpportunities: {
            title: string;
            company: string;
            location: string;
            salary: string;
            link: string;
        }[];
        futureScope: string[];
    };
}

export default function DomainContent({ domain }: DomainContentProps) {
    const router = useRouter();
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

    const handleGenerateRoadmap = async () => {
        setIsGeneratingRoadmap(true);
        try {
            // Simulate PDF generation
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Create a dummy PDF download
            const blob = new Blob(["Dummy PDF content"], {
                type: "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${domain.title
                .toLowerCase()
                .replace(/ /g, "-")}-roadmap.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating roadmap:", error);
        } finally {
            setIsGeneratingRoadmap(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push("/dashboard/career")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {domain.title}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            {domain.description}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <CardContent className="p-4 text-center">
                            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {domain.growth}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                                Job Growth
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <CardContent className="p-4 text-center">
                            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {domain.avgSalary}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                Avg Salary
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                        <CardContent className="p-4 text-center">
                            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {domain.demandLevel}
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">
                                Market Demand
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                        <CardContent className="p-4 text-center">
                            <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                {domain.timeToMaster}
                            </div>
                            <div className="text-sm text-orange-700 dark:text-orange-300">
                                Learning Time
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - What to Master */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle>What to Master</CardTitle>
                                <CardDescription>
                                    Essential skills and technologies for
                                    success in {domain.title}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    {domain.whatToMaster.map(
                                        (category, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`item-${index}`}
                                            >
                                                <AccordionTrigger className="text-left">
                                                    <div>
                                                        <div className="font-semibold">
                                                            {category.title}
                                                        </div>
                                                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {
                                                                category.skills
                                                                    .length
                                                            }{" "}
                                                            skills to learn
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-3">
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                            {
                                                                category.description
                                                            }
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {category.skills.map(
                                                                (
                                                                    skill,
                                                                    skillIndex
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            skillIndex
                                                                        }
                                                                        variant="secondary"
                                                                    >
                                                                        {skill}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    )}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Job Opportunities */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle>Job Opportunities</CardTitle>
                                <CardDescription>
                                    Popular career paths and their requirements
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {domain.jobOpportunities.map(
                                        (job, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {job.title}
                                                    </h4>
                                                    <Badge>{job.salary}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                    {job.company} •{" "}
                                                    {job.location}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                job.link,
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        View Jobs
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Future Scope */}
                    <div>
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle>Future Scope</CardTitle>
                                <CardDescription>
                                    Industry trends and growth opportunities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {domain.futureScope.map(
                                        (paragraph, index) => (
                                            <p
                                                key={index}
                                                className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed"
                                            >
                                                {paragraph}
                                            </p>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Generate Roadmap Button */}
                <div className="text-center">
                    <Button
                        onClick={handleGenerateRoadmap}
                        disabled={isGeneratingRoadmap}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                    >
                        {isGeneratingRoadmap ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Generating Personalized Roadmap...
                            </div>
                        ) : (
                            <>
                                <Route className="h-5 w-5 mr-2" />
                                Generate Personalized Roadmap
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
