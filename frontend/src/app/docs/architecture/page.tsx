"use client";

import { MoneyFlowDiagram } from "@/components/docs/MoneyFlowDiagram";
import { RebalancerDiagram } from "@/components/docs/RebalancerDiagram";

export default function ArchitecturePage() {
    return (
        <article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
            <h1>Technical Architecture</h1>
            <p className="lead">
                AurumNet is built on a modular architecture that separates capital holding (Vaults), logic execution (Strategies), and decision making (AI Agent).
            </p>

            <h2 id="system-overview">System Overview</h2>
            <p>
                The protocol operates in a continuous loop of monitoring, analysis, and execution. The diagram below illustrates how the AI Agent interacts with the on-chain components.
            </p>

            <RebalancerDiagram />

            <h2 id="components">Components</h2>

            <h3>1. VaultCore.sol</h3>
            <p>The main entry point for users. It is an ERC-4626 compliant vault.</p>
            <ul>
                <li><strong>Functions</strong>: <code>deposit()</code>, <code>withdraw()</code>, <code>totalAssets()</code></li>
                <li><strong>State</strong>: Holds the user's shares and tracks the total value of assets across all strategies.</li>
            </ul>

            <h3>2. AIExecutor.sol</h3>
            <p>The bridge between off-chain intelligence and on-chain execution.</p>
            <ul>
                <li><strong>Access Control</strong>: Only whitelisted "Agent" addresses can call this contract.</li>
                <li><strong>Validation</strong>: Verifies that the proposed rebalance meets safety parameters (e.g., slippage checks).</li>
            </ul>

            <h3>3. StrategyManager.sol</h3>
            <p>Manages the registry of active strategies.</p>
            <ul>
                <li><strong>Registry</strong>: Maps Strategy IDs to contract addresses.</li>
                <li><strong>Accounting</strong>: Calculates the total value managed by each strategy.</li>
            </ul>

            <h2 id="data-flow">Data Flow: The Rebalance Lifecycle</h2>
            <p>
                Capital flows from the user into the vault, and is then distributed to various strategies based on the AI's optimization.
            </p>

            <MoneyFlowDiagram />

            <ol>
                <li><strong>Ingest</strong>: The off-chain agent pulls data from The Graph and centralized APIs.</li>
                <li><strong>Analyze</strong>: The ML model predicts the 24h yield outlook.</li>
                <li><strong>Optimize</strong>: A convex optimization solver determines ideal weights.</li>
                <li><strong>Transact</strong>: The agent constructs a transaction calling <code>AIExecutor.rebalance()</code>.</li>
                <li><strong>Execute</strong>: <code>VaultCore</code> moves funds between strategies.</li>
            </ol>
        </article>
    );
}
