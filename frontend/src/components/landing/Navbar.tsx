import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-white/5">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-black dark:bg-white" />
                        <span className="text-lg font-semibold tracking-tight text-black dark:text-white">
                            AurumNet
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        <Link href="#features" className="hover:text-black dark:hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="#technology" className="hover:text-black dark:hover:text-white transition-colors">
                            Technology
                        </Link>
                        <Link href="#security" className="hover:text-black dark:hover:text-white transition-colors">
                            Security
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                            Launch App
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
