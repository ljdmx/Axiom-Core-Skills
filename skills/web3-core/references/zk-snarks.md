# ZK-SNARK Integration Reference
---
framework: "Circom / Noir"
status: "Production Standard"
---

## 1. Intent
Zero-Knowledge (ZK) is essential for asserting truth without exposing underlying payloads. Within the Axiom platform, any sensitive verification must leverage ZK proofs before generating a transaction signature.

## 2. Standard Integration (Circom)
\`\`\`circom
template VerifyHash() {
    signal input secret;
    signal output hash;
    
    component hasher = Poseidon(1);
    hasher.inputs[0] <== secret;
    hash <== hasher.out;
}
\`\`\`

## 3. MEV Protection
Always couple ZK circuits with MEV (Miner Extractable Value) safeguards detailed in `mev-protection.md` to prevent front-running proofs. Output the ZK verification strictly via Private RPC endpoints (Flashbots).
