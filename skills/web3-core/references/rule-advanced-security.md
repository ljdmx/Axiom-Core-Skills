# Advanced Security: MEV & Oracle Redundancy

- **MEV & Slippage**:
  1. **Slippage Limits**: ALL interactions with a DEX (e.g. Uniswap Router) MUST accept a hardcoded or user-defined `minAmountOut` to prevent sandwich attacks.
  2. **Flashbots**: Provide optional support for routing high-value transactions through MEV-aware relays (Flashbots Protect RT) instead of the public mempool.
- **Dual-Oracle Design**:
  1. **Redundancy**: Any function holding >$10k equivalent TVL relying on price MUST utilize a Dual-Oracle architecture (e.g., Chainlink primary + Pyth network secondary).
  2. **Circuit Breaker**: If the two oracles diverge by more than 2%, the transaction MUST revert instantly.
