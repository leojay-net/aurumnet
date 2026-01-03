"use client";

import { ArrowUpRightIcon, ArrowDownRightIcon, ActivityIcon, TrendingUpIcon, DollarSignIcon } from "@/components/icons";

const stats = [
    { name: "Total Yield Earned", value: "$12,450.23", change: "+12.5%", trend: "up", icon: DollarSignIcon },
    { name: "Average APY", value: "14.2%", change: "+2.1%", trend: "up", icon: TrendingUpIcon },
    { name: "Sharpe Ratio", value: "2.4", change: "-0.1", trend: "down", icon: ActivityIcon },
];

const monthlyPerformance = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 72 },
    { month: "Mar", value: 68 },
    { month: "Apr", value: 85 },
    { month: "May", value: 92 },
    { month: "Jun", value: 88 },
    { month: "Jul", value: 95 },
    { month: "Aug", value: 100 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Deep dive into your portfolio performance and risk metrics.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center">
                            <div className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-800">
                                <item.icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.name}</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-zinc-900 dark:text-white">{item.value}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className={`flex items-center text-sm ${item.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {item.trend === 'up' ? (
                                    <ArrowUpRightIcon className="mr-1.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                                ) : (
                                    <ArrowDownRightIcon className="mr-1.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                                )}
                                <span className="font-medium">{item.change}</span>
                                <span className="ml-2 text-zinc-500 dark:text-zinc-400">from last month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Chart Placeholder */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-6">
                        Yield Performance (YTD)
                    </h3>
                    <div className="relative h-64 w-full flex items-end justify-between gap-2 px-2">
                        {monthlyPerformance.map((item) => (
                            <div key={item.month} className="group relative flex h-full w-full flex-col justify-end">
                                <div
                                    className="w-full rounded-t-sm bg-zinc-900 opacity-80 transition-all hover:opacity-100 dark:bg-white"
                                    style={{ height: `${item.value}%` }}
                                ></div>
                                <span className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">{item.month}</span>
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-white dark:text-zinc-900">
                                        {item.value}%
                                    </span>
                                </div>
                            </div>
                        ))}
                        {/* Grid lines */}
                        <div className="absolute inset-0 -z-10 flex flex-col justify-between py-8">
                            {[100, 75, 50, 25, 0].map((val) => (
                                <div key={val} className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Metrics */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-6">
                        Risk Analysis
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-500 dark:text-zinc-400">Protocol Exposure</span>
                                <span className="font-medium text-zinc-900 dark:text-white">Low</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-500 dark:text-zinc-400">Smart Contract Risk</span>
                                <span className="font-medium text-zinc-900 dark:text-white">Audited</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-500 dark:text-zinc-400">Liquidity Utilization</span>
                                <span className="font-medium text-zinc-900 dark:text-white">85%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div className="h-2 rounded-full bg-amber-500" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-500 dark:text-zinc-400">Volatility Index</span>
                                <span className="font-medium text-zinc-900 dark:text-white">Stable</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
