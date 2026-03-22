# Decentralized Identity (DID) Integration Specification
---
version: "1.0.0"
---

## 1. DID-Compatible Memory
The existing `../memory/user_profile.json` must be treated as a localized subset of a verifiable credential ecosystem.
- A user's internal `uuid` maps 1:1 to an on-chain DID (e.g., `did:ethr:0x...`).

## 2. Authentication Flow
1. Verify signature via `../../web3-core/references/account-abstraction.md`.
2. Extract the decentralized payload and seed the `user_profile.json` volatile memory block.
3. Upon session termination, wipe the session token but retain the cryptographic public key hash.

## 3. Sovereign Control
The user holds the absolute right to purge all telemetry and aesthetic preference states linked to their DID across the entire `.agent` operational workspace.
