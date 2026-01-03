import Link from "next/link";

const navigation = {
    product: [
        { name: 'Features', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Integrations', href: '#' },
        { name: 'Pricing', href: '#' },
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
    ],
    legal: [
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
    ],
}

export function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-black dark:bg-white" />
                            <span className="text-lg font-semibold tracking-tight text-black dark:text-white">
                                AurumNet
                            </span>
                        </div>
                        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            Autonomous capital allocation for the modern DeFi ecosystem.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.product.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.legal.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-zinc-900/10 dark:border-white/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-zinc-500">
                        &copy; 2024 AurumNet Protocol. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
