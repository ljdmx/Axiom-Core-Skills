# Axiom Core Skill Ecosystem

This directory houses the foundational soul protocols, metadata validators, and overarching manifesto rules for the entire `Axiom Core Zenith` skill ecosystem. 

## High-Level Execution Architecture (ASCII Map)

```text
USER REQUEST
   │
   ▼
[product-core] (FSPC Orchestrator // Agentic Workflows)
   ├─► [_core_axioms] (Manifesto / DIL / Soul Standard / Telemetry)
   │
   ├─► [frontend-core] (React/Vite / Motion / A11y / DDFM)
   │      └─► [threejs-core]  (Spatial 3D / Shader Nodes / Lightmaps)
   │
   ├─► [backend-core] (Architecture / APIs / Worker Nodes / DLQ / Chaos)
   │      └─► [web3-core]     (DeFi / MEV / Foundry / Audit Scripts)
   │
   └─► [mobile-core] (uni-app x / HarmonyOS / Gesture Conflicts)

* All state sync happens via `PROJECT_NEXUS.json` (The Global Brain).
```

To integrate with other skills, agents must parse `SOUL_MANIFESTO.md` via `view_file` to ensure output aligns with the world-class Zen principles. The `protocols/EVALUATION_GATES.md` file defines strict rendering constraints.
