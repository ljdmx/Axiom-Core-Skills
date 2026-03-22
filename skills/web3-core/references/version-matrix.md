# Web3 Dependency Version Matrix

To guarantee Smart Contract and Frontend connectivity with **Zero Interoperability Errors**, AI MUST target the following exact dependency matrix. Do NOT use `^` (caret) or `latest`. Strict equality is required.

## Foundry Stack (Backend)
- `forge-std`: `=1.8.1`
- `openzeppelin-contracts`: `=v5.0.2`

## Wagmi Stack (Frontend)
- `wagmi`: `=2.5.12`
- `viem`: `=2.9.2`
- `@tanstack/react-query`: `=5.28.9`

## Hardhat Fallback
- `hardhat`: `=2.22.2`
- `@nomicfoundation/hardhat-toolbox`: `=5.0.0`
- `ethers`: `=6.11.1`

Any deviation from this matrix in initialization will result in API fragmentation and build failure.
