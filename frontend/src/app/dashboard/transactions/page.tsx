"use client";

import { ArrowDownLeftIcon, ArrowUpRightIcon, RefreshCwIcon, SearchIcon, FilterIcon, DownloadIcon } from "@/components/icons";
import { useState } from "react";

const initialTransactions = [
    {
        id: "tx-1",
        type: "Deposit",
        asset: "USDC",
        amount: "5,000.00",
        status: "Completed",
        date: "2023-12-19 14:30",
        hash: "0x123...abc",
        vault: "Aurum Core Yield"
    },
    {
        id: "tx-2",
        type: "Rebalance",
        asset: "USDC",
        amount: "1,200.00",
        status: "Completed",
        date: "2023-12-18 09:15",
        hash: "0x456...def",
        vault: "Aurum Core Yield"
    },
];

export default function TransactionsPage() {
    const [filter, setFilter] = useState<"All" | "Deposit" | "Withdraw" | "Rebalance">("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTransactions = initialTransactions.filter(tx => {
        const matchesFilter = filter === "All" || tx.type === filter;
        const matchesSearch = tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.asset.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleExport = () => {
        const headers = ["ID", "Type", "Asset", "Amount", "Status", "Date", "Hash", "Vault"];
        const csvContent = [
            headers.join(","),
            ...filteredTransactions.map(tx =>
                [tx.id, tx.type, tx.asset, tx.amount, tx.status, tx.date, tx.hash, tx.vault].join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Transactions</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        History of your deposits, withdrawals, and yield events.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="appearance-none rounded-lg border border-zinc-200 bg-white px-4 py-2 pl-10 text-sm font-medium text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
                        >
                            <option value="All">All Types</option>
                            <option value="Deposit">Deposits</option>
                            <option value="Withdraw">Withdrawals</option>
                            <option value="Rebalance">Rebalances</option>
                        </select>
                        <FilterIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    </div>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                {/* Search Bar */}
                <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by transaction hash or asset..."
                            className="w-full rounded-lg border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-400"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium">Type</th>
                                <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                                <th scope="col" className="px-6 py-3 font-medium">Vault</th>
                                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                                <th scope="col" className="px-6 py-3 font-medium">Date</th>
                                <th scope="col" className="px-6 py-3 font-medium text-right">Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`rounded-full p-2 ${tx.type === 'Deposit' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    tx.type === 'Withdraw' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {tx.type === 'Deposit' && <ArrowDownLeftIcon className="h-4 w-4" />}
                                                    {tx.type === 'Withdraw' && <ArrowUpRightIcon className="h-4 w-4" />}
                                                    {tx.type === 'Rebalance' && <RefreshCwIcon className="h-4 w-4" />}
                                                </div>
                                                <span className="font-medium text-zinc-900 dark:text-white">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-zinc-900 dark:text-white">
                                                {tx.type === 'Withdraw' ? '-' : '+'}{tx.amount}
                                            </span>
                                            <span className="ml-1 text-zinc-500 dark:text-zinc-400">{tx.asset}</span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                            {tx.vault}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${tx.status === 'Completed'
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                                                : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                            <a href="#" className="hover:text-emerald-500 hover:underline">
                                                {tx.hash}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                                        No transactions found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        Showing <span className="font-medium text-zinc-900 dark:text-white">1</span> to <span className="font-medium text-zinc-900 dark:text-white">2</span> of <span className="font-medium text-zinc-900 dark:text-white">2</span> results
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="rounded-md border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                            disabled
                        >
                            Previous
                        </button>
                        <button
                            className="rounded-md border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
