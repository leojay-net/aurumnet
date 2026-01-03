"use client";

import { motion } from "framer-motion";
import { useVaultData, useUSDCData } from "@/lib/hooks/useContracts";
import { formatUnits } from "viem";

export function AssetTable() {
    const { balanceOf: vaultBalance } = useVaultData();
    const { balance: usdcBalance } = useUSDCData();

    const formattedVaultBalance = vaultBalance
        ? parseFloat(formatUnits(vaultBalance, 6)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : "$0.00";

    const formattedUSDCBalance = usdcBalance
        ? parseFloat(formatUnits(usdcBalance, 6)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : "$0.00";

    const assets = [
        {
            name: "USDC",
            protocol: "Wallet",
            balance: formattedUSDCBalance,
            value: formattedUSDCBalance,
            apy: "-",
            allocation: "Liquid",
        },
        {
            name: "Aurum Vault",
            protocol: "AurumNet",
            balance: formattedVaultBalance,
            value: formattedVaultBalance,
            apy: "8.45%",
            allocation: "Invested",
        },
    ];

    return (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white">
                    Portfolio Allocation
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full whitespace-nowrap text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">Asset</th>
                            <th scope="col" className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">Protocol</th>
                            <th scope="col" className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">Balance</th>
                            <th scope="col" className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">APY</th>
                            <th scope="col" className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {assets.map((asset, index) => (
                            <motion.tr
                                key={asset.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{asset.name}</td>
                                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{asset.protocol}</td>
                                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{asset.value}</td>
                                <td className="px-6 py-4 text-emerald-500 font-medium">{asset.apy}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                        {asset.allocation}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
