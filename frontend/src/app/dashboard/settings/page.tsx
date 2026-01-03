"use client";

import { BellIcon, ShieldCheckIcon, UserIcon, CheckCircle2Icon } from "@/components/icons";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";

export default function SettingsPage() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem("aurum_settings");
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setEmailNotifications(parsed.emailNotifications);
            setPushNotifications(parsed.pushNotifications);
            setUsername(parsed.username || "");
            setEmail(parsed.email || "");
        }
    }, []);

    const handleSave = () => {
        const settings = {
            emailNotifications,
            pushNotifications,
            username,
            email
        };
        localStorage.setItem("aurum_settings", JSON.stringify(settings));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleCancel = () => {
        const savedSettings = localStorage.getItem("aurum_settings");
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setEmailNotifications(parsed.emailNotifications);
            setPushNotifications(parsed.pushNotifications);
            setUsername(parsed.username || "");
            setEmail(parsed.email || "");
        } else {
            setEmailNotifications(true);
            setPushNotifications(false);
            setUsername("");
            setEmail("");
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Manage your account preferences and notification settings.
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-x-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                        <UserIcon className="h-5 w-5 text-zinc-500" />
                        <h2 className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">Profile</h2>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
                                Display Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
                                Email Address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-x-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                        <BellIcon className="h-5 w-5 text-zinc-500" />
                        <h2 className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">Notifications</h2>
                    </div>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">Email Notifications</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Receive weekly digests and major alerts.</span>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${emailNotifications ? 'bg-emerald-600' : 'bg-zinc-200 dark:bg-zinc-700'
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifications ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">Push Notifications</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Real-time alerts for deposits and withdrawals.</span>
                            </div>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${pushNotifications ? 'bg-emerald-600' : 'bg-zinc-200 dark:bg-zinc-700'
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushNotifications ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-x-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                        <ShieldCheckIcon className="h-5 w-5 text-zinc-500" />
                        <h2 className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">Security</h2>
                    </div>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">Wallet Connection</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Manage connected wallets and permissions.</span>
                            </div>
                            {isConnected ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                    <button
                                        className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/30 dark:hover:bg-red-900/30"
                                        onClick={() => disconnect()}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <span className="text-sm text-zinc-500 italic">No wallet connected</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-x-4 items-center">
                    {isSaved && (
                        <span className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2Icon className="mr-1.5 h-4 w-4" />
                            Saved successfully
                        </span>
                    )}
                    <button
                        className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
