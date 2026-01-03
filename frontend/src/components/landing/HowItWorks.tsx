"use client";

import { motion } from "framer-motion";
import { ScanSearchIcon, BrainIcon, ZapIcon, ArrowRightIcon } from "@/components/icons";

const steps = [
    {
        id: "01",
        title: "Market Surveillance",
        description: "Our Python-based agents continuously poll on-chain data from Aave, Compound, and RWA issuers, tracking APY volatility and liquidity depth.",
        icon: ScanSearchIcon,
    },
    {
        id: "02",
        title: "Strategy Optimization",
        description: "Off-chain logic calculates the optimal capital allocation to maximize risk-adjusted returns, factoring in gas costs and slippage.",
        icon: BrainIcon,
    },
    {
        id: "03",
        title: "Atomic Execution",
        description: "The Agent submits a rebalance transaction to the AIExecutor contract. Funds are moved instantly and atomically on the Mantle network.",
        icon: ZapIcon,
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white/80 dark:bg-black/80 backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(#71717a 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="mx-auto max-w-7xl px-6 relative">
                <div className="mb-20 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-emerald-500 font-mono text-xs tracking-wider uppercase mb-4"
                    >
                        System Architecture
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-6"
                    >
                        The Intelligence Layer
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-zinc-600 dark:text-zinc-400"
                    >
                        AurumNet isn't just a protocol; it's an active manager. Here is how the autonomous agent drives value every block.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative group"
                        >
                            {/* Step Number & Icon */}
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-white group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors duration-300">
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <span className="text-4xl font-bold text-zinc-100 dark:text-zinc-900 select-none absolute -z-10 -top-2 left-8">
                                    {step.id}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors">
                                {step.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="md:hidden flex justify-center my-8 text-zinc-300 dark:text-zinc-700">
                                    <ArrowRightIcon className="h-6 w-6 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
