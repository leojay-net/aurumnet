"use client";

export default function ScenariosPage() {
    return (
        <article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
            <h1>User Scenarios & Journeys</h1>
            <p className="lead">
                Understanding how different users interact with AurumNet helps clarify the value proposition. Below are three distinct scenarios illustrating the protocol's flexibility.
            </p>

            <div className="not-prose my-12 grid gap-8">
                {/* Scenario 1 */}
                <div id="retail-user" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">1. The Passive Yield Earner (Retail)</h3>
                    <p className="text-sm text-zinc-500 mb-6">Persona: Alice, holds USDC, wants "set and forget" yield.</p>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-none w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">1</div>
                            <div>
                                <h4 className="font-semibold text-zinc-900 dark:text-white">Discovery</h4>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Alice sees the "Aurum Core Yield" vault with 12.4% APY.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-none w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">2</div>
                            <div>
                                <h4 className="font-semibold text-zinc-900 dark:text-white">Automation</h4>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">She deposits 10k USDC. The AI Agent later moves 30% to a new RWA strategy automatically.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white dark:bg-black rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 text-sm">
                        <p className="font-mono text-zinc-500 mb-2 text-xs">CHAT SIMULATION</p>
                        <p className="mb-2"><strong className="text-zinc-900 dark:text-white">Alice:</strong> "I just want to park my stablecoins. Is this safe?"</p>
                        <p><strong className="text-emerald-500">AurumNet:</strong> "Yes. Your funds are allocated across blue-chip protocols (Aave) and tokenized US Treasuries. Our AI monitors risk 24/7."</p>
                    </div>
                </div>

                {/* Scenario 2 */}
                <div id="institutional-dao" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">2. The Risk-Averse DAO (Institutional)</h3>
                    <p className="text-sm text-zinc-500 mb-6">Persona: Treasury Manager, $5M idle, prioritizes safety.</p>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-none w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
                            <div>
                                <h4 className="font-semibold text-zinc-900 dark:text-white">Configuration</h4>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Sets strict parameters: Max 40% Crypto Lending, Min 50% RWA.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-none w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">2</div>
                            <div>
                                <h4 className="font-semibold text-zinc-900 dark:text-white">Crisis Management</h4>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">AI detects a protocol hack anomaly and pulls funds before liquidity dries up.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white dark:bg-black rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 text-sm">
                        <p className="font-mono text-zinc-500 mb-2 text-xs">CHAT SIMULATION</p>
                        <p className="mb-2"><strong className="text-zinc-900 dark:text-white">Manager:</strong> "We can't afford a 10% drawdown. Can we limit the AI?"</p>
                        <p><strong className="text-emerald-500">AurumNet:</strong> "Absolutely. You can set 'Guardrails' in Settings, forbidding allocation to low-TVL protocols."</p>
                    </div>
                </div>
            </div>
        </article>
    );
}
