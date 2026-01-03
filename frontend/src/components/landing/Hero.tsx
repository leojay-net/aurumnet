"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, ShieldCheckIcon, ZapIcon, BarChart3Icon } from "@/components/icons";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Text Content */}
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            AI Agent Simulation Live
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                            className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl mb-6"
                        >
                            Autonomous <br />
                            Capital Allocation
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                            className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-lg"
                        >
                            AurumNet optimizes yield across the Mantle ecosystem using secure, off-chain AI agents.
                            Institutional-grade risk management meets DeFi composability.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                Start Earning
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/docs"
                                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
                            >
                                View Documentation
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-12 flex items-center gap-8 text-zinc-500 dark:text-zinc-500"
                        >
                            <div className="flex items-center gap-2">
                                <BarChart3Icon className="h-5 w-5" />
                                <span className="text-xs font-medium uppercase tracking-wider">Real-time Analytics</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual / Abstract Representation */}
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-transparent dark:from-zinc-900 rounded-3xl -z-10 opacity-50" />
                        <SystemFlowChart />
                    </div>
                </div>
            </div>
        </section>
    );
}

function SystemFlowChart() {
    return (
        <div className="relative h-[500px] w-full rounded-2xl border border-zinc-200 bg-white/50 p-8 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/50 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 grid grid-cols-6 gap-4 p-4 opacity-5 pointer-events-none">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="rounded-lg bg-zinc-500/20 h-full w-full" />
                ))}
            </div>

            {/* Flow Chart SVG */}
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* Definitions for gradients/markers */}
                <defs>
                    <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Connecting Lines */}
                {/* User -> Vault */}
                <motion.path
                    d="M 50 150 L 140 150"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <motion.circle r="3" fill="#10b981">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 50 150 L 140 150" />
                </motion.circle>

                {/* Vault -> Agent (Data) */}
                <motion.path
                    d="M 180 120 L 180 70"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <motion.circle r="2" fill="#3b82f6">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 180 120 L 180 70" />
                </motion.circle>

                {/* Agent -> Strategies (Signal) */}
                <motion.path
                    d="M 220 50 L 320 80"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="2"
                />
                <motion.path
                    d="M 220 50 L 320 220"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="2"
                />

                {/* Vault -> Strategies (Capital) */}
                <motion.path
                    d="M 220 150 L 320 90"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="2"
                />
                <motion.circle r="3" fill="#10b981">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 220 150 L 320 90" />
                </motion.circle>

                <motion.path
                    d="M 220 150 L 320 210"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="2"
                />
                <motion.circle r="3" fill="#10b981">
                    <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M 220 150 L 320 210" />
                </motion.circle>


                {/* Nodes */}

                {/* User Node */}
                <g transform="translate(30, 130)">
                    <rect width="40" height="40" rx="8" fill="currentColor" className="text-white dark:text-zinc-900 stroke-zinc-200 dark:stroke-zinc-700" stroke="currentColor" strokeWidth="2" />
                    <text x="20" y="25" textAnchor="middle" fontSize="10" fill="currentColor" className="text-zinc-500 font-mono">USER</text>
                </g>

                {/* Vault Node (Center) */}
                <g transform="translate(140, 120)">
                    <rect width="80" height="60" rx="12" fill="currentColor" className="text-zinc-900 dark:text-white" />
                    <text x="40" y="35" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" className="text-white dark:text-black">VAULT</text>
                </g>

                {/* Agent Node (Top) */}
                <g transform="translate(140, 20)">
                    <rect width="80" height="40" rx="20" fill="currentColor" className="text-emerald-500" />
                    <text x="40" y="25" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">AI AGENT</text>
                </g>

                {/* Strategy 1 (Aave) */}
                <g transform="translate(320, 70)">
                    <rect width="60" height="30" rx="6" fill="currentColor" className="text-white dark:text-zinc-900 stroke-zinc-300 dark:stroke-zinc-700" stroke="currentColor" strokeWidth="1" />
                    <text x="30" y="20" textAnchor="middle" fontSize="10" fill="currentColor" className="text-zinc-600 dark:text-zinc-400">AAVE</text>
                </g>

                {/* Strategy 2 (RWA) */}
                <g transform="translate(320, 200)">
                    <rect width="60" height="30" rx="6" fill="currentColor" className="text-white dark:text-zinc-900 stroke-zinc-300 dark:stroke-zinc-700" stroke="currentColor" strokeWidth="1" />
                    <text x="30" y="20" textAnchor="middle" fontSize="10" fill="currentColor" className="text-zinc-600 dark:text-zinc-400">RWA</text>
                </g>

            </svg>

            <div className="absolute bottom-4 right-4 text-[10px] text-zinc-400 font-mono">
                LIVE_SIMULATION_MODE
            </div>
        </div>
    );
}

