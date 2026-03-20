# Global Nexus Protocol (NEXUS_SPEC)

> **Purpose**: The `PROJECT_NEXUS.json` file is the absolute source of truth for cross-skill contextual state. When multiple skills (ADBM, DDFM, FSPC, Mobile, Web3) operate sequentially or concurrently on the same project, they MUST read and write to this shared brain.

## Universal Schema Definition

All skills MUST adhere to the following `PROJECT_NEXUS.json` structure:

```json
{
  "$schema": "https://axiom-os.local/schema/nexus-v1.json",
  "project_name": "Project Name",
  "fspc_version": "9.4",
  "soul_scorecard": {
    "overall": 8.5,
    "axes": { "understand": 9, "respect": 8, "companion": 8, "delight": 9, "ethics": 9 }
  },
  "session_continuity": {
    "applied_rules": ["ADBM-§1", "ADBM-§3", "DDFM-§19"],
    "deferred_rules": ["ADBM-§5-ReadReplica", "ADBM-§6-Saga"],
    "completed_phases": ["PRE-FLIGHT", "EXECUTION-Step1"],
    "open_decisions": ["Tenant isolation model TBD"],
    "total_token_cost_estimation": {
      "accumulated_tokens": 125000,
      "estimated_usd": 0.50
    },
    "last_updated": "2026-03-10T12:00:00Z"
  },
  "architecture_decisions": {
    "scale_tier": "Startup|Growth|Enterprise",
    "security_tier": "Standard|Regulated|Critical",
    "complexity_tier": "Monolith|Modular Monolith|Microservices"
  },
  "sub_skill_outputs": {
    "adbm": {
      "status": "complete|pending",
      "api_spec_path": ".openapi/api.yaml",
      "port": 3000
    },
    "ddfm": {
      "status": "complete|pending",
      "dil_level": "L3",
      "theme": "dark_mode_first"
    },
    "mobile_core": {
      "status": "complete|pending",
      "mode": "Classic|uni-app x",
      "platform_targets": ["App", "H5", "WeChat"]
    },
    "web3_core": {
      "status": "complete|pending",
      "contracts": [{ "name": "MyToken", "path": "contracts/MyToken.sol" }],
      "oz_version": "v5",
      "wagmi_version": "v2",
      "contract_addresses": { "MyToken": "0x..." }
    }
  },
  "agent_handshake_log": [
    {
      "timestamp": "2026-03-10T12:00:00Z",
      "agent_role": "Architect",
      "action": "Completed Gate 0B, approved Monolith tier."
    }
  ]
}
```

## Reading and Writing Protocol
1. **At Session Start**: Any FSPC-compatible skill MUST silently read `PROJECT_NEXUS.json` into context.
2. **At Handoff/Completion**: The active skill MUST update its corresponding section under `sub_skill_outputs` and append an entry to `agent_handshake_log`.
3. **FinOps Token Logging**: `product-core` Retrospective MUST update `total_token_cost_estimation` before closing out the task.
