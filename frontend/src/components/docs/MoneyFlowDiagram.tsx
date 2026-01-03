"use client";

import { motion } from "framer-motion";

export function MoneyFlowDiagram() {
    return (
        <div className="w-full p-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 my-12 relative overflow-hidden">
            {/* Background Grid Pattern for 'Senior' look */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">

                {/* 1. User Node */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-20 bg-white dark:bg-zinc-900 px-8 py-4 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-3"
                >
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">User (Liquidity Provider)</span>
                </motion.div>

                {/* Connector 1: User -> Vault */}
                <div className="h-16 w-px bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1/2 bg-emerald-500/80 blur-[1px]"
                        animate={{ top: ['-50%', '150%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* 2. Vault Node */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-20 w-full max-w-lg"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur opacity-30" />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 text-center shadow-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            AurumNet Vault (ERC-4626)
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Aggregates deposits, issues shares, and routes capital via AI signals.
                        </p>
                    </div>
                </motion.div>

                {/* Connector 2: Vault -> Strategies (Branching) */}
                <div className="relative w-full h-16">
                    {/* Vertical line from vault */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-8 w-px bg-zinc-300 dark:bg-zinc-700" />
                    {/* Horizontal branching line */}
                    <div className="absolute top-8 left-[25%] right-[25%] h-px bg-zinc-300 dark:bg-zinc-700" />
                    {/* Vertical lines to strategies */}
                    <div className="absolute left-[25%] top-8 h-8 w-px bg-zinc-300 dark:bg-zinc-700" />
                    <div className="absolute right-[25%] top-8 h-8 w-px bg-zinc-300 dark:bg-zinc-700" />

                    {/* Animated Dots for flow */}
                    <motion.div
                        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        animate={{
                            top: [0, 32, 32, 64],
                            left: ['50%', '50%', '25%', '25%'],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.6, 1] }}
                    />
                    <motion.div
                        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        animate={{
                            top: [0, 32, 32, 64],
                            left: ['50%', '50%', '75%', '75%'],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.6, 1] }}
                    />
                </div>

                {/* 3. Strategies Row */}
                <div className="grid grid-cols-2 gap-8 w-full">
                    {/* Strategy A */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-3 text-purple-600 dark:text-purple-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">DeFi Lending</h4>
                            <p className="text-xs text-zinc-500 mt-1">Aave, Compound</p>
                        </div>
                    </motion.div>

                    {/* Strategy B */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-3 text-amber-600 dark:text-amber-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">RWA Yield</h4>
                            <p className="text-xs text-zinc-500 mt-1">Treasury Bills</p>
                        </div>
                    </motion.div>
                </div>

                {/* 4. Yield Return Loop (Visualized) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-900/20"
                >
                    <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Yield Auto-Compounds into Vault Shares
                </motion.div>

            </div>
        </div>
    );
}
