# User Scenarios & Journeys

Understanding how different users interact with AurumNet helps clarify the value proposition. Below are three distinct scenarios illustrating the protocol's flexibility and power.

## Scenario 1: The Passive Yield Earner (Retail User)
**Persona**: Alice, a DeFi user who holds USDC and wants better yields than Aave but doesn't have time to manage positions.

### The Journey
1.  **Discovery**: Alice lands on the AurumNet Dashboard and sees the "Aurum Core Yield" vault with an APY of 12.4%.
2.  **Deposit**: She connects her wallet and deposits 10,000 USDC.
3.  **Automation**: She closes the tab.
    *   *Behind the scenes*: The AI Agent detects that Aave rates have dropped. It moves 30% of her funds into a new RWA Treasury bill strategy that just launched.
4.  **Withdrawal**: A month later, Alice returns. Her balance is now 10,103 USDC. She withdraws instantly.

### User Chat Simulation
> **Alice**: "I just want to park my stablecoins and forget about them. Is this safe?"
>
> **AurumNet**: "Yes. Your funds are allocated across blue-chip protocols (Aave) and tokenized US Treasuries. Our AI monitors risk 24/7. If any protocol shows signs of instability, we exit immediately."

---

## Scenario 2: The Risk-Averse DAO (Institutional User)
**Persona**: The Treasury Manager of a DAO holding $5M in idle stablecoins. They prioritize capital preservation over degen yields.

### The Journey
1.  **Configuration**: The Manager uses the "Allocation" tab to set strict parameters.
    *   *Max Exposure to Crypto Lending*: 40%
    *   *Min Exposure to RWA*: 50%
    *   *Min Liquidity Buffer*: 10%
2.  **Monitoring**: The DAO uses the Analytics dashboard to export weekly CSV reports for their community.
3.  **Crisis Management**: A major lending protocol gets hacked.
    *   *Action*: AurumNet's AI detects the anomaly (spike in utilization, drop in TVL) within the same block.
    *   *Result*: The DAO's funds are pulled from that protocol before the hack is fully exploited or liquidity dries up.

### User Chat Simulation
> **DAO Manager**: "We can't afford a 10% drawdown. Can we limit the AI's power?"
>
> **AurumNet**: "Absolutely. You can set 'Guardrails' in the Settings. For example, you can forbid the AI from allocating to any protocol with less than $100M TVL."

---

## Scenario 3: The Yield Maximizer (Power User)
**Persona**: Bob, a sophisticated user who understands market cycles.

### The Journey
1.  **Custom Strategy**: Bob doesn't use the default vault. He deploys a "Personal Vault" via the AurumNet SDK.
2.  **Aggressive Settings**: He configures his AI Agent to chase "Volatile APY" – moving funds aggressively between Curve pools based on trading volume.
3.  **Leverage**: He enables "Looping" (folding) to leverage his yield positions up to 3x.

### User Chat Simulation
> **Bob**: "I want to farm the new Mantle incentive program. Can the agent handle that?"
>
> **AurumNet**: "Yes. The agent tracks reward APYs (like MNT tokens) in addition to base yield. It will auto-compound these rewards for you."

---

## Summary of Interactions

| User Type | Primary Goal | Key Feature Used            |
| :-------- | :----------- | :-------------------------- |
| **Alice** | Convenience  | Auto-Rebalancing            |
| **DAO**   | Safety       | Risk Guardrails & Reporting |
| **Bob**   | Max Yield    | Custom Strategy & Looping   |
