# Axiom Core Skills

> **A modular ecosystem of skill packages for autonomous software delivery.**

Axiom Core is a framework designed to provide Large Language Models (LLMs) with structured architectural patterns and design standards. It establishes a consistent baseline for autonomous product development across different platforms and technology stacks.

---

## 🌟 Why Axiom Core?

In the era of AI-assisted coding, the gap between "working code" and "enterprise-grade software" is often human-intensive. Axiom Core bridges this gap by:

*   **Standardizing Quality**: Enforcing architectural patterns (Hexagonal, ADBM) and design tokens (HSL, spacing) automatically.
*   **Predictable Deliverables**: Moving from random LLM outputs to deterministic, schema-validated structures.
*   **Reducing Token Waste**: Offloading heavy logic into static templates and JIT-compiled micro-services.
*   **Safe Self-Evolution**: Allowing agents to learn from local project context without contaminating the core codebase.

---

## 🚀 Key Technical Advantages

*   **Swarm Concurrency (FSPC)**: Orchestrates development using a dependency-graph approach, allowing parallel execution of backend and frontend layers.
*   **JIT Skill Compilation**: Dynamically offloads complex computations to an MCP (Model Context Protocol) gateway to preserve LLM context.
*   **Aesthetic Feedback Loop**: Uses a dual-track adversarial review mechanism to ensure UI designs meet professional visual standards.
*   **Economic Simulation**: Integrates a macro-economic sandbox to stress-test tokenomics models against extreme market conditions.

---

## 🗂️ Directory Structure

```text
Axiom-Core-Skills/
├── skills/
│   ├── _core_axioms/          # Core Design Philosophy & Global Protocols
│   │   ├── protocols/         # Validation Gates & Rejection Logic
│   │   ├── SOUL_MANIFESTO.md  # Fundamental Guidelines & Compute Offloading
│   │   └── ...
│   ├── product-core/          # Project Orchestration Layer (FSPC)
│   ├── frontend-core/         # Interface & Interaction Standards
│   ├── backend-core/          # Backend Architecture & Data Integrity (ADBM)
│   ├── mobile-core/           # Mobile Ergonomics & Optimization
│   ├── web3-core/             # Blockchain & Tokenomics Integration
│   └── threejs-core/          # 3D Graphics & Spatial Computing
├── init.js                # Environment Initialization Script (Zenith)
├── LICENSE                # MIT License
└── README.md              # Project Documentation
```

---

## 🌌 Ecosystem Components

### 1. `_core_axioms` — Philosophical Framework
Defines fundamental design principles focused on usability and respect for user experience. Handles core protocols and **JIT Skill Compilation**.

### 2. `product-core` — Full-Stack Project Orchestration
Coordinates development tasks using a dependency-graph approach to ensure concurrent execution of backend and frontend layers.

### 3. `frontend-core` — UI Standards Layer
Implements an aesthetic review mechanism where proposed designs are evaluated against established visual excellence standards.

### 4. `backend-core` — Resilient Infrastructure
Focuses on API-first development, hexagonal architecture patterns, and chaos engineering for fault tolerance and data integrity.

### 5. `mobile-core` — Cross-Platform Mobility
Provides standards for high-performance mobile development, emphasizing ergonomics, thumb zones, and native-feel animations.

### 6. `web3-core` — Smart Contract & Economic Security
Provides tools for smart contract security and macro-economic simulation for token models to mitigate economic risks.

### 7. `threejs-core` — 3D & Spatial Computing
Manages complex 3D scenes and WebGPU graphics while optimizing for token consumption through shader extraction.

---

## 🧬 Operational Modes

Axiom Core supports two primary modes to ensure "Global Rules, Local State":

### Mode A: Engine Development
Run directly in the cloned repository root to update, test, or audit the skill packages themselves.
```bash
node init.js
```

### Mode B: Project Integration
Run in your **Target Project Root**. This is the standard way to use the engine for your own products.
```bash
# Run from your project directory (Assuming engine is at /path/to/Axiom-Core-Skills)
node /path/to/Axiom-Core-Skills/init.js
```

---

## 🧬 Local Adaptation (Self-Evolution)

Axiom Core utilizes a structured feedback loop to adapt to project-specific requirements. All learned patterns and custom patches are stored in a local `.axiom_evolution/` directory to ensure core integrity and privacy.

1. **Project Isolation**: Every project maintains its own `.axiom_evolution/`, containing unique antibodies and telemetry logs.
2. **Context Synchronization**: Cross-skill alignment is achieved via the `PROJECT_NEXUS.json` in your project root.
3. **Privacy by Design**: Both `.axiom_evolution/` and `PROJECT_NEXUS.json` are automatically added to your `.gitignore`.

---

## 🤝 Contributing

We welcome contributions to expand the Axiom Core ecosystem. Whether it's adding new skill templates, refining architectural protocols, or improving the self-evolution engine, your input helps shape the future of autonomous engineering.

---

## ⚖️ License
MIT License - See [LICENSE](LICENSE) for details.
