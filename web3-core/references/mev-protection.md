# Miner Extractable Value (MEV) Protection
---
version: "1.0.0"
criticality: "High"
---

## 1. Intent
All DeFi operations initiated via the Axiom `web3-core` must aggressively avoid the public mempool. Unprotected transactions represent an immediate attack vector for front-running and sandwich attacks.

## 2. Flashbots Integration
Utilize Private RPC endpoints directly. Do NOT broadcast raw signed transactions via default Alchemy/Infura endpoints.
- RPC URL Template: \`https://rpc.flashbots.net\`

## 3. Strict Slippage Tolerances
Enforce a hard slippage tolerance limit of < 0.5% in the \`../../../frontend-core/templates/forms/multi-step-checkout.md\` logic when dealing with DEX aggregations.

## 4. Ecosystem Trigger
If an MEV attack is suspected (transaction reverted unexpectedly), fire an alert to the \`../../../_core_axioms/dashboards/telemetry_dashboard.html\` utilizing the \`MEV_SANDWICH_DETECTED\` incident protocol.
