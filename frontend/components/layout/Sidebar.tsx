"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    BrainCircuit,
    Compass,
    Heart,
    Target,
    FileText,
    Briefcase,
    Home,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Learn", href: "/dashboard/learn", icon: BookOpen },
    { name: "FlashQuiz", href: "/dashboard/quiz", icon: BrainCircuit },
    { name: "Career Guidance", href: "/dashboard/career", icon: Compass },
    { name: "Personal Support", href: "/dashboard/support", icon: Heart },
    { name: "Placement Prep", href: "/dashboard/placement", icon: Target },
    { name: "Exams", href: "/dashboard/exams", icon: FileText },
    { name: "Placements", href: "/dashboard/placements", icon: Briefcase },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    className?: string;
}

export default function Sidebar({
    collapsed,
    onToggle,
    className,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64",
                className
            )}
        >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    CS
                                </span>
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                Academy
                            </span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="h-8 w-8 hidden lg:flex"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                                        isActive
                                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                            : "text-slate-700 dark:text-slate-300",
                                        collapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 flex-shrink-0",
                                            isActive &&
                                                "text-indigo-600 dark:text-indigo-400"
                                        )}
                                    />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer space if needed */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700"></div>
        </aside>
    );
}
