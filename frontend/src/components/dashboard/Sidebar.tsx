"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DashboardIcon,
    VaultIcon,
    AnalyticsIcon,
    TransactionsIcon,
    AllocationIcon,
    SettingsIcon,
    LogOutIcon,
    LogoIcon
} from "../icons";
import { motion } from "framer-motion";
import { useDisconnect } from "wagmi";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: DashboardIcon },
    { name: "Vaults", href: "/dashboard/vaults", icon: VaultIcon },
    { name: "Analytics", href: "/dashboard/analytics", icon: AnalyticsIcon },
    { name: "Transactions", href: "/dashboard/transactions", icon: TransactionsIcon },
    { name: "Allocation", href: "/dashboard/allocation", icon: AllocationIcon },
    { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export function Sidebar() {
    const pathname = usePathname();
    const { disconnect } = useDisconnect();

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white px-6 pb-4 dark:border-zinc-800 dark:bg-black">
                <div className="flex h-16 shrink-0 items-center gap-2">
                    <LogoIcon className="h-8 w-8 text-emerald-500" />
                    <span className="text-lg font-semibold tracking-tight text-black dark:text-white">
                        AurumNet
                    </span>
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`
                          group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-all
                          ${isActive
                                                        ? "bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white"
                                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                                                    }
                        `}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-emerald-500" : "text-zinc-400 group-hover:text-black dark:group-hover:text-white"}`}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="sidebar-indicator"
                                                        className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500"
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                        <li className="mt-auto">
                            <button
                                onClick={() => disconnect()}
                                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-500 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                            >
                                <LogOutIcon
                                    className="h-5 w-5 shrink-0 text-zinc-400 group-hover:text-black dark:group-hover:text-white"
                                    aria-hidden="true"
                                />
                                Disconnect
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
