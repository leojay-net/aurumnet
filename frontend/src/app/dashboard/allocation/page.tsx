"use client";

import { PieChartIcon, LayersIcon, GlobeIcon, ServerIcon, CheckIcon, XIcon } from "@/components/icons";
import { useState } from "react";

const allocationData = [
    { name: "Aave Lending", value: 45, amount: "$1,890,000", color: "bg-blue-500", icon: LayersIcon },
    { name: "RWA Treasury", value: 30, amount: "$1,260,000", color: "bg-emerald-500", icon: GlobeIcon },
    { name: "Curve Stable", value: 15, amount: "$630,000", color: "bg-purple-500", icon: ServerIcon },
    { name: "Cash / Liquidity", value: 10, amount: "$420,000", color: "bg-zinc-500", icon: PieChartIcon },
];

const strategyBreakdown = [
    { name: "Stablecoin Yield", value: 60, color: "bg-emerald-500" },
    { name: "Delta Neutral", value: 25, color: "bg-blue-500" },
    { name: "Directional", value: 15, color: "bg-amber-500" },
];

export default function AllocationPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [params, setParams] = useState({
        threshold: "5",
        frequency: "4",
        gasLimit: "20"
    });

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Asset Allocation</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Current distribution of capital across protocols and strategies.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Allocation Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-6">
                            Protocol Allocation
                        </h3>

                        {/* Visual Bar */}
                        <div className="mb-8 flex h-8 w-full overflow-hidden rounded-lg">
                            {allocationData.map((item) => (
                                <div
                                    key={item.name}
                                    className={`${item.color} h-full transition-all hover:opacity-90`}
                                    style={{ width: `${item.value}%` }}
                                    title={`${item.name}: ${item.value}%`}
                                />
                            ))}
                        </div>

                        {/* Legend & Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {allocationData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-md p-2 ${item.color} bg-opacity-10`}>
                                            <item.icon className={`h-5 w-5 ${item.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.value}% Allocation</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-zinc-900 dark:text-white">{item.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strategy Breakdown */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-6">
                            Strategy Type Exposure
                        </h3>
                        <div className="space-y-6">
                            {strategyBreakdown.map((item) => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-zinc-900 dark:text-white">{item.name}</span>
                                        <span className="text-zinc-500 dark:text-zinc-400">{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                        <div
                                            className={`h-2 rounded-full ${item.color}`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-4">
                            Rebalancing Rules
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex gap-3 items-start">
                                <div className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
                                <div className="flex-1">
                                    <span className="font-medium text-zinc-900 dark:text-white">Threshold:</span>
                                    {isEditing ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={params.threshold}
                                                onChange={(e) => setParams({ ...params, threshold: e.target.value })}
                                                className="w-16 rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            />
                                            <span className="text-zinc-500">drift</span>
                                        </div>
                                    ) : (
                                        <span className="ml-1 text-zinc-500 dark:text-zinc-400">Rebalance triggers when allocation drifts by &gt;{params.threshold}%.</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
                                <div className="flex-1">
                                    <span className="font-medium text-zinc-900 dark:text-white">Frequency:</span>
                                    {isEditing ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={params.frequency}
                                                onChange={(e) => setParams({ ...params, frequency: e.target.value })}
                                                className="w-16 rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            />
                                            <span className="text-zinc-500">hours</span>
                                        </div>
                                    ) : (
                                        <span className="ml-1 text-zinc-500 dark:text-zinc-400">Checked every {params.frequency} hours by AI agents.</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
                                <div className="flex-1">
                                    <span className="font-medium text-zinc-900 dark:text-white">Gas Optimization:</span>
                                    {isEditing ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={params.gasLimit}
                                                onChange={(e) => setParams({ ...params, gasLimit: e.target.value })}
                                                className="w-16 rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            />
                                            <span className="text-zinc-500">gwei</span>
                                        </div>
                                    ) : (
                                        <span className="ml-1 text-zinc-500 dark:text-zinc-400">Executed only when gas &lt; {params.gasLimit} gwei.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="mt-6 flex gap-2">
                                <button
                                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                className="mt-6 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Parameters
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
