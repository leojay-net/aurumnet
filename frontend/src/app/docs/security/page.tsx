"use client";

export default function SecurityPage() {
    return (
        <article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
            <h1>Security & Audits</h1>
            <p className="lead">
                Security is paramount in autonomous systems. AurumNet employs a multi-layered security approach combining on-chain checks, off-chain monitoring, and rigorous auditing.
            </p>

            <h2 id="guardian-network">Guardian Network</h2>
            <p>
                The Guardian Network is a decentralized set of nodes that monitor the protocol for anomalies. If the AI Agent attempts a malicious or erroneous transaction (e.g., moving 100% of funds to a low-liquidity pool), the Guardians can instantly pause the protocol.
            </p>

            <h2 id="timelocks">Timelocks</h2>
            <p>
                Critical system upgrades and strategy additions are subject to a <strong>48-hour timelock</strong>. This gives the community time to review changes before they go live.
            </p>

            <h2 id="audits">Audits</h2>
            <p>
                We are committed to transparency. Our smart contracts are currently undergoing audits by top-tier firms.
            </p>
            <div className="not-prose my-8">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white">Core Protocol Audit</h4>
                        <p className="text-sm text-zinc-500">Status: In Progress</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Pending
                    </span>
                </div>
            </div>
        </article>
    );
}
