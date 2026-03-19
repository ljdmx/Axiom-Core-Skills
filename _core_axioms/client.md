# Cognitive Client Protocol
## How Skills Access Global Memory

---

## 📡 Overview

The **Cognitive Client** is the interface between an AI Skill (ADBM/DDFM) and the Global Cognitive Grid (GCG). It enables "Smart Context" injection.

**Location**: `.agent/skills/_core_axioms/client.md`

---

## 🧠 Read Protocol (The "Handshake")

**When**: At the start of ANY task (Task Boundary).

**Procedure**:
1.  **Load User Profile**:
    ```typescript
    const user = loadJSON('.agent/skills/_core_axioms/memory/user_profile.json');
    // Set global constants:
    const PREFERRED_LANG = user.identity.language; // "zh-CN"
    const PACKAGE_MGR = user.preferences.package_manager; // "pnpm"
    ```

2.  **Load Project Graph**:
    ```typescript
    const graph = loadJSON('.agent/skills/_core_axioms/memory/project_graph.json');
    const currentProject = identifyProject(cwd); // e.g., "Smart Agriculture"
    
    // Check for success patterns from other projects
    const authStrategy = graph.cross_project_patterns['auth-strategy'].preferred;
    // "User likes JWT + Refresh. Suggest this first."
    ```

3.  **Load Evolution History**:
    ```typescript
    const mutations = loadJSON('.agent/skills/_core_axioms/evolution/patch_history.json');
    // Check if templates need runtime patching
    if (mutations['auth-controller'].frequency > 5) {
      applyRuntimePatch('auth-controller', mutations['auth-controller'].patch);
    }
    ```

---

## ✍️ Write Protocol (The "Learning Loop")

**When**: After completing a task successfully.

**Procedure**:
1.  **Update Project Stats**:
    ```typescript
    updateProjectGraph(projectId, {
      last_updated: now(),
      features_added: ['payment-stripe']
    });
    ```

2.  **Record Mutations (Darwinism)**:
    If the user modifies a generated file significantly:
    ```typescript
    const generated = template.content;
    const final = readFile(targetPath);
    const diff = computeDiff(generated, final);
    
    if (diff.score > 0.2) { // 20% change
      logMutation(templateId, diff);
    }
    ```

3.  **Snippet Harvesting**:
    If a new utility function is created and reused 3+ times:
    ```typescript
    addToSnippetVault({
      name: "date-formatter",
      code: "...",
      desc: "User's standard date format"
    });
    ```

---

## 🛠️ Integration Guide

### For ADBM (Backend Skill)

**Add to `SKILL.md` -> Workflow**:
```markdown
**COGNITIVE LOAD**:
1. Read `.agent/skills/_core_axioms/memory/*.json`
2. IF `user.preferences.orm === 'Prisma'`:
   - Auto-select Prisma templates
3. IF `evolution.mutations['crud-controller']`:
   - Apply user's custom 'soft-delete' patch
```

### For DDFM (Frontend Skill)

**Add to `SKILL.md` -> Workflow**:
```markdown
**COGNITIVE LOAD**:
1. Read `.agent/skills/_core_axioms/memory/*.json`
2. **Semantic Search via V10 Vault**: Query `.agent/skills/_core_axioms/memory/vector_vault/schema.json` to retrieve the most semantically relevant AST patches for this specific layout problem.
3. **Style check**:
   - Quotes: `user.style_guide.quotes` ('single')
   - Imports: `user.style_guide.component_export` ('named')
3. **Design check**:
   - "User prefers 'Glassmorphism' (confidence 0.95)"
   - -> Select `dashboard-glass` template
```

---

**Status**: Ready for Integration 🚀
