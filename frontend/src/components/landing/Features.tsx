"use client";

import { motion } from "framer-motion";
import { BrainCircuitIcon, LockIcon, GlobeIcon, ArrowUpRightIcon } from "@/components/icons";

const features = [
    {
        title: "Smart Yield Routing",
        description: "Our off-chain AI agents continuously monitor APY across Aave, Compound, and RWA protocols to rebalance capital instantly.",
        icon: BrainCircuitIcon,
        stat: "24/7",
        statLabel: "Monitoring",
    },
    {
        title: "Institutional Security",
        description: "Non-custodial architecture with time-locked emergency pauses and transparent on-chain logic.",
        icon: LockIcon,
        stat: "100%",
        statLabel: "Non-Custodial",
    },
    {
        title: "Real-World Assets",
        description: "Seamlessly access tokenized Treasury bills and corporate bonds directly from your DeFi wallet.",
        icon: GlobeIcon,
        stat: "+4.2%",
        statLabel: "Avg. Uplift",
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-4">
                        Engineered for Performance
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        AurumNet replaces manual yield farming with automated, data-driven strategies.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-black dark:hover:shadow-zinc-800/50"
        >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6" />
            </div>

            <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
                {feature.title}
            </h3>

            <p className="mb-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {feature.description}
            </p>

            <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 bg-zinc-50/50 px-8 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="block text-lg font-bold text-zinc-900 dark:text-white">
                            {feature.stat}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                            {feature.statLabel}
                        </span>
                    </div>
                    <ArrowUpRightIcon className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
            </div>
        </motion.div>
    );
}
