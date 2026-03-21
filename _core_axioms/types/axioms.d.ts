/**
 * 🌌 Axiom Core v2.1: Sovereign Nervous System Types
 * Unified interface definitions for cross-skill coordination.
 */

export interface ProjectNexus {
  _version: string;
  _last_sync: string;
  
  // 🧠 Shared Brain State
  project_context: {
    name: string;
    archetype: 'API' | 'Full-Stack' | 'Microbox' | 'Legacy-Fix';
    scale: 'Startup' | 'Growth' | 'Enterprise';
    compliance: 'Standard' | 'GDPR' | 'HIPAA' | 'SOC2';
  };

  // 🛡️ Governance & Security
  governance: {
    strategic_persona: string;
    gate_status: {
      pre_flight: 'passed' | 'pending' | 'failed';
      execution: 'in-progress' | 'blocked' | 'done';
      handoff: 'pending' | 'ready' | 'verified';
    };
    security_audit: {
      level: 'low' | 'medium' | 'high' | 'critical';
      last_red_team_sync: string;
      open_vulnerabilities: number;
    };
  };

  // 💓 Soul & Emotional Telemetry
  soul_scorecard: {
    rams_score: number; // 0-10
    aesthetics: number; // 0-10
    emotional_resonance: number; // 0-10
    zero_dead_end_compliance: boolean;
    flavor_tag: string;
  };

  // 🌐 Skill Interop Context
  skill_context: {
    active_tokens: string[]; // e.g., ["product-core", "frontend-core"]
    backend_endpoints—: Record<string, string>;
    contract_addresses—: Record<string, string>;
    threejs_scene_state—: 'minimal' | 'cinematic' | 'emotional';
  };

  // 📝 Agent Handshake Log
  handshake_log: Array<{
    timestamp: string;
    agent_id: string;
    phase: string;
    message: string;
  }>;
}

export interface SoulManifesto {
  soul_axis: {
    understand: number;
    respect: number;
    companion: number;
  };
  visual_tokens: {
    primary_color: string;
    secondary_color: string;
    glassmorphism_intensity: number;
    motion_physics: 'linear' | 'kinetic' | 'fluid';
  };
}
