"use client";

import { motion } from "framer-motion";
import { ShieldIcon, LockIcon, FileCodeIcon, UsersIcon } from "@/components/icons";

export function Security() {
    return (
        <section id="security" className="py-24 bg-zinc-50/80 dark:bg-zinc-900/30 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Narrative */}
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-emerald-500 font-mono text-xs tracking-wider uppercase mb-4"
                        >
                            Security First
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-6"
                        >
                            Trust through Transparency
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-zinc-600 dark:text-zinc-400 mb-8"
                        >
                            We understand that in DeFi, trust is earned through code, not promises. AurumNet is built on a foundation of rigorous security standards.
                        </motion.p>

                        <div className="space-y-6">
                            <SecurityPoint
                                icon={FileCodeIcon}
                                title="Immutable Logic"
                                desc="Our core protocol is built on verifiable, open-source smart contracts ensuring logic integrity."
                                delay={0.3}
                            />
                            <SecurityPoint
                                icon={LockIcon}
                                title="Non-Custodial Architecture"
                                desc="You retain full control of your assets. The AI agent has permission only to rebalance, never to withdraw."
                                delay={0.4}
                            />
                            <SecurityPoint
                                icon={ShieldIcon}
                                title="Emergency Pause"
                                desc="A decentralized guardian network can pause protocol operations instantly if anomalies are detected."
                                delay={0.5}
                            />
                        </div>
                    </div>

                    {/* Right: Visual / Bento Grid */}
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="col-span-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm font-medium text-zinc-500">Total Value Secured</div>
                                <ShieldIcon className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="text-4xl font-bold text-zinc-900 dark:text-white">$12.4M+</div>
                            <div className="mt-2 text-xs text-zinc-400">Across 3 active strategies</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                        >
                            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                                <UsersIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-zinc-900 dark:text-white">Multi-Sig</div>
                                <div className="text-xs text-zinc-500 mt-1">Governance Control</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-zinc-900 dark:bg-white border border-zinc-900 dark:border-white rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                        >
                            <div className="h-10 w-10 rounded-full bg-zinc-800 dark:bg-zinc-100 flex items-center justify-center mb-4">
                                <LockIcon className="h-5 w-5 text-white dark:text-black" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white dark:text-black">Timelock</div>
                                <div className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">48h Delay</div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function SecurityPoint({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="flex gap-4"
        >
            <div className="mt-1">
                <Icon className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{desc}</p>
            </div>
        </motion.div>
    )
}
