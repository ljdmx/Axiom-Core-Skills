# Smart Contract Security Audit Protocol (Red Team)

## Mandate
Smart contracts control financial assets. Vulnerabilities are exponentially more damaging than standard Web2 bugs. Every contract MUST pass these Red Team checks before deployment or UI integration.

## 1. Reentrancy Guard
- **Check**: Are state changes happening AFTER external calls?
- **Execution**: Apply the Checks-Effects-Interactions pattern strictly. Use `ReentrancyGuard` modifier (`nonReentrant`) on all functions that make external calls or transfer Ether.

## 2. Integer Overflow / Underflow
- **Check**: Is the Solidity version < 0.8.0?
- **Execution**: If using Solidity < 0.8.0, SafeMath MUST be used. For >= 0.8.0, rely on built-in overflow checks but be aware of unchecked blocks.

## 3. Access Control & Authorization
- **Check**: Are privileged functions properly protected?
- **Execution**: Ensure functions like `mint`, `burn`, or state-altering configuration changes use `onlyOwner` or `AccessControl` roles. Never leave them public/external without modifiers.

## 4. Oracle Manipulation
- **Check**: Does the contract rely on a single DEX pair for price feeds?
- **Execution**: NEVER use spot prices from a single AMM. Use decentralized oracles like Chainlink for price feeds to prevent flash loan attacks.

## 5. Front-Running / MEV Protection
- **Check**: Does the protocol logic depend on transaction ordering or exact block timestamps?
- **Execution**: Implement commit-reveal schemes, slippage limits, or strict deadline checks (`block.timestamp`). Do not use `block.timestamp` as a source of randomness.

## Validation Status
> **Action**: AI MUST run a static analysis tool (e.g. Slither) or execute this checklist manually before marking the contract as [Secure].
