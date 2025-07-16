"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  Target,
  TrendingUp,
  Clock,
  Users,
  Trophy,
  ArrowRight,
  Brain,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function PlacementPage() {
  const stats = [
    {
      title: "Problems Solved",
      value: "0",
      icon: Code,
      color: "text-blue-600",
    },
    {
      title: "Success Rate",
      value: "0%",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Current Streak",
      value: "0",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Time Spent",
      value: "0h",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const features = [
    {
      title: "DSA Problem Sheets",
      description: "Curated problem sets organized by topic and difficulty",
      icon: BookOpen,
      href: "/dashboard/placement/sheets",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Mock Interviews",
      description: "AI-powered interview practice with real-time feedback",
      icon: Brain,
      href: "/dashboard/placement/mock-interview",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      title: "Learning Roadmap",
      description: "Structured path to master algorithms and data structures",
      icon: Target,
      href: "/dashboard/placement/roadmap",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      title: "Analytics",
      description: "Track your progress and identify areas for improvement",
      icon: TrendingUp,
      href: "/dashboard/placement/analytics",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
  ];

  const recentActivity = [
    {
      type: "problem",
      title: "Two Sum",
      difficulty: "Easy",
      time: "2 hours ago",
      status: "solved",
    },
    {
      type: "interview",
      title: "Mock Interview - Arrays",
      difficulty: "Medium",
      time: "1 day ago",
      status: "completed",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Placement Preparation
            </h1>
            <p className="text-gray-600 mt-2">
              Master algorithms, data structures, and ace your technical
              interviews
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Quick Practice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${feature.color}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg bg-white ${feature.iconColor}`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">
                        {feature.title}
                      </CardTitle>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-full">
                          {activity.type === "problem" ? (
                            <Code className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Users className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            activity.difficulty === "Easy"
                              ? "secondary"
                              : activity.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {activity.difficulty}
                        </Badge>
                        <Badge
                          variant={
                            activity.status === "solved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No activity yet. Start practicing to see your progress
                      here!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/placement/sheets">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Problem Sheets
                </Button>
              </Link>
              <Link href="/dashboard/placement/mock-interview">
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Start Mock Interview
                </Button>
              </Link>
              <Link href="/dashboard/placement/roadmap">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  View Roadmap
                </Button>
              </Link>
              <Link href="/dashboard/placement/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Check Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
