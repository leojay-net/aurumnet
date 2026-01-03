"use client";

import { motion } from "framer-motion";

export function Stats() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-6">
                            Outperforming the Market
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                            By dynamically shifting capital between lending protocols and RWA treasuries, AurumNet consistently delivers superior risk-adjusted returns.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
                                    $12.4M
                                </div>
                                <div className="text-sm text-zinc-500">Total Value Locked</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold tracking-tight text-emerald-500 mb-1">
                                    8.45%
                                </div>
                                <div className="text-sm text-zinc-500">Average APY</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[400px] w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="absolute top-4 left-8 text-xs font-medium text-zinc-500">YIELD PERFORMANCE (30D)</div>

                        {/* Chart Container */}
                        <div className="relative h-full w-full pt-8">
                            <svg className="h-full w-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" strokeDasharray="4 4" />

                                {/* Standard DeFi Line (Lower) */}
                                <motion.path
                                    d="M0,150 C50,145 100,148 150,140 C200,135 250,138 300,130 C350,125 400,120 400,120"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-zinc-400 dark:text-zinc-600"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />

                                {/* AurumNet Line (Higher) */}
                                <motion.path
                                    d="M0,150 C50,140 100,120 150,100 C200,90 250,60 300,40 C350,30 400,20 400,20"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-emerald-500"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                                />

                                {/* Area under curve (optional, maybe too noisy for 'minimalist') - skipping for now */}
                            </svg>

                            {/* Labels */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="absolute top-[10%] right-0 translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full"
                            >
                                AurumNet
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="absolute top-[60%] right-0 translate-x-1/2 bg-zinc-400 text-white text-[10px] font-bold px-2 py-1 rounded-full"
                            >
                                Standard
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
