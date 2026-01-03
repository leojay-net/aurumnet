import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export function CTA() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-24 text-center shadow-2xl dark:bg-white sm:px-16">
                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white dark:text-black sm:text-4xl">
                        Start optimizing your capital today.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300 dark:text-zinc-600">
                        Join the institutions and DeFi natives using AurumNet for secure, automated yield generation.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/dashboard"
                            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 dark:bg-black dark:text-white dark:hover:bg-zinc-800"
                        >
                            Launch App
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-semibold leading-6 text-white dark:text-black hover:underline underline-offset-4"
                        >
                            Contact Sales <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
