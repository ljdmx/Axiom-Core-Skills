# Axiom OS â€?Skill Package Independence Guide

Welcome to the skill ecosystem. This guide explains how to properly utilize the 5 core AI skill packages either independently (Mode-A) or orchestrated together (Mode-B).

## ðŸ”€ When to use which skill?

### 1. Pure Backend API / Microservice
**Target Skill**: `backend-core`
- Automatically assesses scale, security, and complexity.
- Delivers enterprise-grade architecture, database schema, and OpenAPI 3.1 specs.
- Run as an independent expert.

### 2. Pure Frontend / Web UI / Component Library
**Target Skill**: `frontend-core`
- Strictly applies the Design-Driven Frontend Manifesto (DDFM).
- Uses OKLCH design tokens, physics-based animation, and aesthetic evaluation.
- Run as an independent design and UI engineering expert.

### 3. Native Mobile / uni-app / Mini-Programs
**Target Skill**: `mobile-core`
- Specialized for cross-platform (H5, App, WeChat) using Vue3/UTS.
- Automatically handles the "Classic vs. uni-app x" mode selection.
- Run independently for purely mobile/mini-program ventures.

### 4. Smart Contracts / DeFi / NFT / Web3
**Target Skill**: `web3-core`
- Lean, specialized EVM router covering Solidity, frameworks, and deployment.
- Strict security/gas optimization principles and dependency checks.
- Run independently if you only need smart contracts or a simple dApp.

### 5. Full-Stack Product Delivery
**Target Skill**: `product-core` (The Orchestrator / FSPC)
- Use this when building an end-to-end product requiring both frontend and backend.
- Applies PM, Architect, and Security Persona gates.
- Sets up the `PROJECT_NEXUS.json` shared brain.
- **Auto-dispatches** backend-core, along with frontend-core (Web), mobile-core (uni-app), and web3-core (Contracts) based on your intent.

---

## ðŸ§¬ Dual-Mode Architecture

Our core skills are designed to operate in two modes, identified by YAML tags in their `SKILL.md`:
- `standalone_ready: true` â€?The skill has its own Boot Protocol and Classification Layer.
- `fspc_compatible: true` â€?The skill can detect `PROJECT_NEXUS.json` and seamlessly integrate into `product-core`'s workflow, inheriting project scale/compliance directly.

When building a complete product, always start by activating `product-core` and letting it orchestrate the others. When building an isolated component or service, rely on the specific domain skill directly.
