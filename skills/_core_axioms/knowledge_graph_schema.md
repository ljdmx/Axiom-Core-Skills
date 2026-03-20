# Project Structure & Knowledge Graph Schema
## Foundation of the Global Cognitive Grid

---

## 🏗�?1. Skill Evolution Directory Structure

To support the new "Sovereign" capabilities, we must restructure the `.agent/skills` directory.
Old structure was flat. New structure is **Modular & Intelligent**.

```
.agent/skills/
├── _core_axioms/                🌌 Core Universe (Manifestos, Shared & Global)
�?  ├── SOUL_MANIFESTO.md        # Supreme Aesthetic Code
�?  ├── NEXUS_PROTOCOL.md        # Federated Project Handoff Rules
�?  ├── KERNEL_BOOTSTRAP.md      # Shared Logic Start Point
�?  ├── memory/                  🧠 Global Cognitive Grid (RAG)
�?  �?  ├── user_profile.json    # User preferences & style
�?  �?  ├── project_graph.json   # Cross-project relationships
�?  �?  ├── snippet_vault.json   # Reusable code patterns
�?  �?  └── vector_vault/        🌌 Semantic AST History (NEW)
�?  �?      └── schema.json      # RAG memory layout
�?  └── evolution/               💎 Kinetic Intelligence
�?      ├── patch_history.json   # Tracked mutations
�?      └── analytics.json       # Usage stats & rejection rates
�?
├── backend-core/
�?  ├── templates/               # (Existing)
�?  ├── red_team/                🛡�?Adversarial QA Support (NEW)
�?  �?  ├── fuzzing_vectors.json
�?  �?  └── security_audit.ts
�?  └── SKILL.md
�?
├── frontend-core/
�?  ├── templates/               # (Existing)
�?  ├── design_engine/           🎨 Sovereign Design Engine (NEW)
�?  �?  ├── theme_dna_schema.json
�?  �?  └── component_synth.ts
�?  └── SKILL.md
�?
└── product-core/
    ├── governance/              🏢 Enterprise Specs (NEW)
    �?  ├── regulatory_blueprints/
    �?  └── architecture_rules.json
    └── SKILL.md
```

---

## 🕸�?2. Knowledge Graph Schema (Detailed)

This schema defines how the AI "thinks" about the user's projects and history.

### 2.1 User Profile (`user_profile.json`)

```json
{
  "identity": {
    "role": "Full Stack Developer", // "Frontend Specialist", "Backend Architect"
    "experience_level": "Senior",   // "Junior", "Mid", "Senior"
    "language": "zh-CN"             // Auto-detected
  },
  "preferences": {
    "package_manager": "pnpm",      // "npm", "yarn", "bun"
    "linter": "Biome",              // "ESLint", "Standard"
    "test_runner": "Vitest",        // "Jest", "Mocha"
    "css_framework": "Tailwind",    // "CSS Modules", "Styled Components"
    "orm": "Prisma"                 // "TypeORM", "Drizzle"
  },
  "style_guide": {
    "quotes": "single",
    "semi": true,
    "tab_width": 2,
    "trailing_comma": "all",
    "component_export": "named",    // "default"
    "file_naming": "kebab-case"     // "PascalCase", "camelCase"
  },
  "interaction_style": {
    "verbosity": "concise",         // "verbose", "explained"
    "proactivity": "high",          // "low" (wait for commands)
    "tone": "professional"          // "casual", "witty"
  }
}
```

### 2.2 Project Graph (`project_graph.json`)

Tracks relationships and patterns across projects.

```json
{
  "projects": {
    "proj_a1b2": {
      "path": "e:/aiwork_01/smart-agriculture",
      "name": "Smart Agriculture",
      "type": "Monorepo",
      "stack": {
        "frontend": "React",
        "backend": "Express",
        "db": "MySQL",
        "orm": "Prisma"
      },
      "features": [
        "auth-jwt",
        "dashboard-glass",
        "iot-integration"
      ],
      "status": "Active",
      "success_score": 0.95,
      "last_updated": "2026-01-30T16:00:00Z"
    },
    "proj_x9y8": {
      "path": "e:/work/pet-nexus",
      "name": "Pet Nexus",
      "type": "FullStack",
      "stack": {
        "frontend": "Next.js",
        "backend": "Next.js API",
        "db": "PostgreSQL",
        "orm": "Prisma"
      },
      "features": [
        "auth-nextauth",
        "booking-calendar",
        "inventory-grid"
      ],
      "status": "Maintenance",
      "success_score": 0.92,
      "last_updated": "2026-01-28T10:00:00Z"
    }
  },
  "cross_project_patterns": {
    "auth-strategy": {
      "preferred": "JWT + Refresh",
      "confidence": 0.85,
      "projects_used": ["proj_a1b2", "proj_old1"]
    },
    "ui-library": {
      "preferred": "Shadcn UI",
      "confidence": 0.9,
      "projects_used": ["proj_x9y8", "proj_a1b2"]
    }
  }
}
```

### 2.3 Evolution History (`evolution/patch_history.json`)

Tracks how the user modifies templates, enabling Kinetic Intelligence.

```json
{
  "template_mutations": {
    "auth-controller": {
      "version": "2.0.0",
      "total_usages": 12,
      "mutations": [
        {
          "type": "add_field",
          "location": "RegisterSchema",
          "content": "phone: z.string().optional()",
          "frequency": 8, // Hotspot! 66% of usages add 'phone'
          "suggestion": "Should we add 'phone' to the base template?"
        },
        {
          "type": "change_value",
          "location": "JWT_EXPIRES_IN",
          "from": "7d",
          "to": "1d",
          "frequency": 2, // Low frequency, likely project-specific
          "suggestion": "Ignore"
        }
      ]
    },
    "dashboard-layout": {
      "version": "2.0.0",
      "total_usages": 5,
      "mutations": [
        {
          "type": "change_style",
          "selector": ".sidebar",
          "property": "width",
          "from": "w-72",
          "to": "w-64",
          "frequency": 4, // 80% usage
          "suggestion": "Update default sidebar width to w-64?"
        }
      ]
    }
  }
}
```

---

## 🔄 Interaction Flow: The "Cognitive Handshake"

**Trigger**: Session Start

1.  **AI**: Loads `user_profile.json` + `project_graph.json`.
2.  **AI**: Detects current project context (e.g., `smart-agriculture`).
3.  **AI Inference**:
    *   *"Ah, Smart Agriculture. This is that Monorepo with the Glassmorphism dashboard."*
    *   *"User prefers `pnpm` and `named exports`. I will adjust my output style."*
    *   *"Last time we worked on `auth`, user added a 'phone' field. I should verify if that's needed today."*

**Trigger**: Generating Code (e.g., "Create a Settings page")

1.  **AI**: Checks `snippet_vault.json` for "settings-page-layout".
2.  **AI**: Checks `evolution/patch_history.json`.
    *   *System*: "Warning: User consistently removes the 'Notifications' section from Settings. I will omit it proactive."
3.  **Action**: Generates tailored code. "Here is a Settings page, styled with your preferred `oklch` palette, minus the Notifications tab you usually delete."

---

## 🎯 Value Proposition

This schema transforms the AI from a **Tool** (Static, Forgetful) to a **Partner** (Adaptive, Persistent).
It enables the "Sovereign" qualities we aim for:
1.  **Continuity**: It remembers you.
2.  **Evolution**: It grows with you.
3.  **Context**: It understands the bigger picture.

**Ready for Implementation**: This structure can be created immediately as the groundwork for Phase 4.
