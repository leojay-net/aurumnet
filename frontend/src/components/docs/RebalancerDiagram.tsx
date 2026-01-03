"use client";

import { motion } from "framer-motion";

export function RebalancerDiagram() {
    return (
        <div className="w-full p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 my-8 overflow-hidden">
            <h3 className="text-center font-semibold mb-12 text-zinc-900 dark:text-white">AI Rebalancing Logic</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {/* Step 1: Data Ingestion */}
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 h-full flex flex-col">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Step 1: Monitor</div>
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span>APY Rates</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span>Liquidity Depth</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>Volatility Index</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Arrow 1 */}
                <div className="hidden md:flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>

                {/* Step 2: AI Processing */}
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-gradient-to-br from-zinc-900 to-black text-white p-5 rounded-xl border border-zinc-700 h-full flex flex-col shadow-xl">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Step 2: Optimize</div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-emerald-400">Sharpe Ratio Max</div>
                                <div className="text-xs text-zinc-400 mt-1">Calculating optimal weights...</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Arrow 2 */}
                <div className="hidden md:flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>

                {/* Step 3: Execution */}
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 h-full flex flex-col">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Step 3: Execute</div>
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-xs">
                                <span className="text-purple-500">function</span> <span className="text-blue-500">rebalance</span>() {'{'}
                                <br />
                                &nbsp;&nbsp;<span className="text-zinc-500">// On-Chain Tx</span>
                                <br />
                                {'}'}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verified by Guardian
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
