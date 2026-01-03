"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Book, Shield, Layers, MessageSquare, FileText } from "lucide-react";

const items = [
    {
        title: "Overview",
        href: "/docs",
        icon: Book,
    },
    {
        title: "Core Concepts",
        href: "/docs/concepts",
        icon: FileText,
        items: [
            { title: "Autonomous Vault", href: "/docs/concepts#autonomous-vault" },
            { title: "AI Agent", href: "/docs/concepts#ai-agent" },
            { title: "Real-World Assets", href: "/docs/concepts#rwa" },
            { title: "Security", href: "/docs/concepts#security" },
        ],
    },
    {
        title: "User Scenarios",
        href: "/docs/scenarios",
        icon: MessageSquare,
        items: [
            { title: "Retail User", href: "/docs/scenarios#retail-user" },
            { title: "Institutional DAO", href: "/docs/scenarios#institutional-dao" },
        ],
    },
    {
        title: "Architecture",
        href: "/docs/architecture",
        icon: Layers,
        items: [
            { title: "System Overview", href: "/docs/architecture#system-overview" },
            { title: "Components", href: "/docs/architecture#components" },
            { title: "Data Flow", href: "/docs/architecture#data-flow" },
        ],
    },
    {
        title: "Security",
        href: "/docs/security",
        icon: Shield,
        items: [
            { title: "Guardian Network", href: "/docs/security#guardian-network" },
            { title: "Timelocks", href: "/docs/security#timelocks" },
            { title: "Audits", href: "/docs/security#audits" },
        ],
    },
];

export function DocsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="w-full">
            <div className="flex flex-col space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <div key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                            {isActive && item.items && (
                                <div className="ml-9 mt-1 flex flex-col space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                                    {item.items.map((subItem) => (
                                        <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 py-1"
                                        >
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
