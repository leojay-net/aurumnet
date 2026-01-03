"use client";

import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { DepositWithdraw } from "@/components/dashboard/DepositWithdraw";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Overview</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Real-time view of your capital allocation and performance.
                </p>
            </div>

            <OverviewStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <AssetTable />

                    {/* Activity Feed */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="relative mt-1 h-2 w-2 flex-none rounded-full bg-zinc-300 dark:bg-zinc-700">
                                    <div className="absolute -inset-1 rounded-full bg-zinc-200/20 dark:bg-zinc-700/20" />
                                </div>
                                <div className="flex-auto py-0.5 text-xs leading-5 text-zinc-500">
                                    <span className="font-medium text-zinc-900 dark:text-white">Rebalance Executed</span>
                                    <span className="block">Moved 10k USDC from Aave to RWA Treasury.</span>
                                </div>
                                <time dateTime="2023-01-23T10:32" className="flex-none py-0.5 text-xs leading-5 text-zinc-500">
                                    2h ago
                                </time>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <DepositWithdraw />
                </div>
            </div>
        </div>
    );
}
