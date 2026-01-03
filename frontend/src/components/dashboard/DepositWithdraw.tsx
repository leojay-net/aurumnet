"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useVaultCore, useUSDC, useUSDCData, useVaultData } from "@/lib/hooks/useContracts";
import { parseUnits, formatUnits } from "viem";
import { Loader2Icon, DropletsIcon } from "@/components/icons";
import { useAccount } from "wagmi";

export function DepositWithdraw() {
    const { address } = useAccount();
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
    const [amount, setAmount] = useState("");

    const { deposit, withdraw, isPending: isVaultPending, isConfirming: isVaultConfirming, isConfirmed: isVaultConfirmed } = useVaultCore();
    const { approve, mint, isPending: isApprovePending, isConfirming: isApproveConfirming, isConfirmed: isApproveConfirmed } = useUSDC();
    const { balance: usdcBalance, allowance, refetch: refetchUSDC } = useUSDCData();
    const { balanceOf: vaultBalance, refetch: refetchVault } = useVaultData();

    const isLoading = isVaultPending || isApprovePending || isVaultConfirming || isApproveConfirming;

    useEffect(() => {
        if (isVaultConfirmed || isApproveConfirmed) {
            refetchUSDC();
            refetchVault();
        }
    }, [isVaultConfirmed, isApproveConfirmed, refetchUSDC, refetchVault]);

    const handleMax = () => {
        if (activeTab === "deposit" && usdcBalance) {
            setAmount(formatUnits(usdcBalance, 6));
        } else if (activeTab === "withdraw" && vaultBalance) {
            setAmount(formatUnits(vaultBalance, 6));
        }
    };

    const handleMint = async () => {
        if (!address || !mint) return;
        try {
            await mint(address, parseUnits("1000", 6));
            // Wait a bit for block to be mined then refetch
            setTimeout(() => refetchUSDC(), 2000);
        } catch (error) {
            console.error("Mint failed:", error);
        }
    };

    const handleAction = async () => {
        if (!amount) return;

        try {
            const parsedAmount = parseUnits(amount, 6);

            if (activeTab === "deposit") {
                // Check allowance
                if (allowance !== undefined && allowance < parsedAmount) {
                    approve(parsedAmount);
                    return; // User needs to click deposit again after approval confirms
                }
                deposit(parsedAmount);
            } else {
                withdraw(parsedAmount);
            }

            if (!isApprovePending && !isVaultPending) {
                setAmount("");
            }
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    };

    const isApprovalNeeded = activeTab === "deposit" && allowance !== undefined && amount && allowance < parseUnits(amount, 6);

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white mb-4">
                Manage Funds
            </h3>

            {/* Tabs */}
            <div className="flex space-x-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800 mb-6">
                {(["deposit", "withdraw"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full rounded-md py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${activeTab === tab
                            ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white"
                            : "text-zinc-500 hover:bg-white/[0.12] hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>Amount</span>
                        <span>
                            Balance: {activeTab === "deposit"
                                ? (usdcBalance ? formatUnits(usdcBalance, 6) : "0.00")
                                : (vaultBalance ? formatUnits(vaultBalance, 6) : "0.00")}
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full rounded-lg border-zinc-200 bg-transparent py-3 pl-4 pr-16 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:text-white sm:text-sm"
                            placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <button
                                onClick={handleMax}
                                className="text-xs font-medium text-emerald-600 hover:text-emerald-500 mr-2"
                            >
                                MAX
                            </button>
                            <span className="text-zinc-500 sm:text-sm">
                                {activeTab === "deposit" ? "USDC" : "Shares"}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAction}
                    disabled={isLoading || !amount}
                    className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading
                        ? (isApprovePending || isApproveConfirming ? "Approving..." : "Processing...")
                        : isApprovalNeeded
                            ? "Approve USDC"
                            : activeTab === "deposit" ? "Deposit" : "Withdraw"
                    }
                </button>

                {/* Faucet for testing */}
                <button
                    onClick={handleMint}
                    className="flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                    <DropletsIcon className="mr-2 h-3 w-3" />
                    Mint 1000 Test USDC
                </button>
            </div>
        </div>
    );
}
