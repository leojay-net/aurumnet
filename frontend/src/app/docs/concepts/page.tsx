"use client";

export default function ConceptsPage() {
    return (
        <article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
            <h1>Core Concepts of AurumNet</h1>
            <p className="lead">
                AurumNet represents a paradigm shift in DeFi capital allocation, moving from manual, static strategies to dynamic, AI-driven optimization.
            </p>

            <h2 id="autonomous-vault">1. The Autonomous Vault</h2>
            <p>
                At the heart of AurumNet is the <strong>Autonomous Vault</strong>. Unlike traditional ERC-4626 vaults that rely on hardcoded strategies or manual governance updates, AurumNet vaults are permissioned to accept signals from an off-chain AI Agent.
            </p>
            <h3>Key Characteristics:</h3>
            <ul>
                <li><strong>Non-Custodial</strong>: Users retain ownership of their shares.</li>
                <li><strong>AI-Managed</strong>: Rebalancing is triggered by algorithmic signals.</li>
                <li><strong>Multi-Strategy</strong>: Can allocate to multiple underlying protocols (Aave, Compound, RWA) simultaneously.</li>
            </ul>

            <h2 id="ai-agent">2. The AI Agent (The "Brain")</h2>
            <p>
                The AI Agent is an off-chain Python-based system that continuously monitors the DeFi ecosystem. It is not just a bot; it is a risk-aware decision engine.
            </p>
            <h3>Responsibilities:</h3>
            <ol>
                <li><strong>Market Surveillance</strong>: Polls APYs, liquidity depth, and volatility metrics every block.</li>
                <li><strong>Strategy Optimization</strong>: Calculates the optimal portfolio weightings (e.g., 60% RWA, 40% Aave) to maximize Sharpe Ratio.</li>
                <li><strong>Execution</strong>: Submits transactions to the <code>AIExecutor</code> contract to rebalance the vault.</li>
            </ol>

            <h2 id="rwa">3. Real-World Assets (RWA)</h2>
            <p>
                AurumNet bridges the gap between on-chain liquidity and off-chain stability. By integrating tokenized Treasury bills and corporate bonds, AurumNet provides a "risk-free rate" baseline that crypto-native strategies often lack.
            </p>
            <ul>
                <li><strong>Stability</strong>: Uncorrelated with crypto market volatility.</li>
                <li><strong>Yield</strong>: Consistent yield derived from traditional finance markets.</li>
                <li><strong>Liquidity</strong>: Managed via secondary market pools.</li>
            </ul>

            <h2 id="security">4. Security & Guardians</h2>
            <p>
                Automation introduces new risks. AurumNet mitigates these with a <strong>Guardian Network</strong>.
            </p>
            <ul>
                <li><strong>Emergency Pause</strong>: If the AI Agent behaves erratically (e.g., attempting to move 100% of funds to a low-liquidity pool), the Guardian contract can freeze operations.</li>
                <li><strong>Timelocks</strong>: Major strategy changes or upgrades require a 48-hour delay.</li>
                <li><strong>Slippage Protection</strong>: Hardcoded limits on how much value can be lost during a rebalance.</li>
            </ul>
        </article>
    );
}
