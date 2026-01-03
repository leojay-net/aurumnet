"use client";

import { BrainIcon, ShieldIcon, UsersIcon, FileCodeIcon } from "@/components/icons";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl mb-6">
                    Documentation
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Everything you need to understand, integrate, and build with AurumNet.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <DocCard
                    title="Core Concepts"
                    description="Understand the philosophy behind AurumNet, the Autonomous Vault, and AI Agents."
                    icon={BrainIcon}
                    href="/docs/concepts"
                />
                <DocCard
                    title="User Scenarios"
                    description="Real-world use cases for Retail, Institutional, and Power users."
                    icon={UsersIcon}
                    href="/docs/scenarios"
                />
                <DocCard
                    title="Technical Architecture"
                    description="Deep dive into Smart Contracts, Off-Chain Logic, and Security modules."
                    icon={FileCodeIcon}
                    href="/docs/architecture"
                />
                <DocCard
                    title="Security & Audits"
                    description="Learn about our Guardian Network, Timelocks, and Audit reports."
                    icon={ShieldIcon}
                    href="/docs/security"
                />
            </div>
        </div>
    );
}

function DocCard({ title, description, icon: Icon, href }: { title: string, description: string, icon: any, href: string }) {
    return (
        <Link href={href} className="group block p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="h-12 w-12 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="h-6 w-6 text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                {title}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
