"use client";

import { ArrowUpRightIcon, DollarSignIcon, ActivityIcon, PercentIcon } from "@/components/icons";
import { motion } from "framer-motion";
import { useVaultData } from "@/lib/hooks/useContracts";
import { formatUnits } from "viem";

export function OverviewStats() {
    const { balanceOf, totalAssets, isLoading } = useVaultData();

    // Format values
    const formattedBalance = balanceOf
        ? parseFloat(formatUnits(balanceOf, 6)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : "$0.00";

    const formattedTVL = totalAssets
        ? parseFloat(formatUnits(totalAssets, 6)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : "$0.00";

    const stats = [
        {
            name: "Your Vault Balance",
            value: isLoading ? "Loading..." : formattedBalance,
            change: "Shares",
            changeType: "neutral",
            icon: DollarSignIcon
        },
        {
            name: "Total Value Locked",
            value: isLoading ? "Loading..." : formattedTVL,
            change: "Protocol TVL",
            changeType: "positive",
            icon: ActivityIcon
        },
        {
            name: "Current APY",
            value: "8.45%",
            change: "+1.2%",
            changeType: "positive",
            icon: PercentIcon
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                    <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                            <stat.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div
                            className={`flex items-center gap-1 text-xs font-medium 
                ${stat.changeType === 'positive' ? 'text-emerald-500' : 'text-zinc-500'}`}
                        >
                            {stat.changeType === 'positive' ? <ArrowUpRightIcon className="h-3 w-3" /> : null}
                            {stat.change}
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</h3>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {stat.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
