"use client";

import { DepositWithdraw } from "@/components/dashboard/DepositWithdraw";
import { ArrowUpRightIcon, ShieldCheckIcon, ZapIcon, LockIcon } from "@/components/icons";

const vaults = [
    {
        id: "aurum-core",
        name: "Aurum Core Yield",
        description: "AI-optimized yield aggregation across Aave and RWA protocols.",
        apy: "12.4%",
        tvl: "$4.2M",
        risk: "Low",
        status: "Active",
        strategies: ["Aave Lending", "RWA Treasury"],
    },
    {
        id: "aurum-stable",
        name: "Stablecoin Plus",
        description: "Enhanced stablecoin yields with delta-neutral strategies.",
        apy: "8.1%",
        tvl: "$1.1M",
        risk: "Minimal",
        status: "Coming Soon",
        strategies: ["Curve", "Convex"],
    },
    {
        id: "aurum-eth",
        name: "ETH Liquid Staking",
        description: "Maximized ETH staking rewards with auto-compounding.",
        apy: "4.5%",
        tvl: "$850K",
        risk: "Low",
        status: "Coming Soon",
        strategies: ["Lido", "Rocket Pool"],
    },
];

export default function VaultsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Vaults</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Explore and manage your positions in our AI-managed vaults.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {vaults.map((vault) => (
                        <div
                            key={vault.id}
                            className={`rounded-xl border p-6 shadow-sm transition-all ${vault.status === "Active"
                                ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
                                : "border-zinc-100 bg-zinc-50 opacity-75 dark:border-zinc-800 dark:bg-zinc-900/20"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                            {vault.name}
                                        </h3>
                                        {vault.status === "Active" ? (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                        {vault.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {vault.status === "Active" && (
                                        <button
                                            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                                            onClick={() => {
                                                const element = document.getElementById('deposit-withdraw-section');
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                        >
                                            Manage
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">APY</p>
                                    <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                        {vault.apy}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">TVL</p>
                                    <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
                                        {vault.tvl}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">Risk</p>
                                    <div className="mt-1 flex items-center gap-1">
                                        <ShieldCheckIcon className="h-4 w-4 text-zinc-400" />
                                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                            {vault.risk}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {vault.strategies.map((strategy) => (
                                    <span
                                        key={strategy}
                                        className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
                                    >
                                        {strategy}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div id="deposit-withdraw-section" className="sticky top-8 space-y-6">
                        <DepositWithdraw />

                        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                            <h3 className="flex items-center text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-4">
                                <ZapIcon className="mr-2 h-4 w-4 text-amber-500" />
                                Why AurumNet?
                            </h3>
                            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                                <li className="flex gap-3">
                                    <div className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400" />
                                    <span>AI-driven strategy optimization for maximum yield.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400" />
                                    <span>Institutional-grade security and risk management.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400" />
                                    <span>Real-time rebalancing across DeFi and RWA.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
