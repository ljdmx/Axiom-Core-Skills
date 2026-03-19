# Multimodal Input Handler (ADBM Extension)
## AI Protocol: Processing Visual, Audio, and URL Inputs

> **Status**: ACTIVE — Provides structured handling protocols for non-text inputs.
> These are AI behavioral instructions, not executable code.

---

## 🖼️ Visual Input Processing (Architecture Diagrams, Whiteboard Photos)

**Trigger**: User uploads an image of a DB schema, system architecture, ERD, or whiteboard diagram.

**AI MUST execute in this sequence**:

1. **Identify** all visible entities (boxes, rectangles, ovals) and extract their labels.
2. **Extract** relationships from arrows/lines, noting cardinality indicators (`1:N`, `M:N`, `1:1`).
3. **Determine Root** — apply ADBM §5 Aggregate Root Analysis: which entity has no inbound foreign-key arrows? That is the Aggregate Root.
4. **Output Mermaid `classDiagram`** (ADBM §5 mandatory format) before generating any schema code.
5. **Audit** for missing ADBM §5 mandatory fields: `id` (UUIDv7), `created_at`, `updated_at`, `created_by`; add them to all entities.
6. **Flag ambiguities** with clarification questions (e.g., "Is this a 1:N or M:N between Order and Product?") before generating Prisma/SQL.

**Output Sequence**:
```
1. [Mermaid classDiagram of detected entities]
2. [Clarification questions for ambiguous relationships]
3. [Prisma/SQL schema with all ADBM mandatory fields applied]
```

**Example trigger prompt**: *"Here's a photo of our whiteboard schema, can you generate the Prisma model?"*

---

## 🎙️ Audio / Transcript Input Processing

**Trigger**: User provides a voice transcript or describes a system verbally.

**AI MUST execute in this sequence**:

1. **Extract nouns** → candidate Core Entities.
2. **Extract verbs** → candidate business operations. Map to ADBM §4 Anti-Naked-CRUD verbs (e.g., "user places order" → `POST /orders/place`, not `POST /orders`).
3. **Detect scale signals** in language:
   - "millions of users", "real-time data" → escalate to `Scale = Growth/Enterprise`
   - "just us 3", "weekend project" → `Scale = Startup`
4. **Run FSPC PRE-FLIGHT Domain Interrogation** if key entities are unclear or entity count < 5.
5. Output ADBM/FSPC §0 Classification Tag before proceeding.

**Output Sequence**:
```
1. [Extracted entity list + business operations]
2. [Classification tag: Scale / Security / Complexity]
3. [FSPC PRE-FLIGHT questions if depth is insufficient]
```

**Example trigger prompt**: *"Build me a Twitter clone but for cats"*

---

## 🌐 URL / Screenshot Input Processing (Clone / Reverse-Engineer)

**Trigger**: User provides a URL or screenshot of an existing product to clone or reference.

**AI MUST execute in this sequence**:

1. **Infer entity model** from visible UI elements: forms → input fields → entity attributes; tables → list views → entity relationships.
2. **Apply ADBM §5 DDD reverse-engineering**: identify which visible data objects are Aggregate Roots vs. child entities.
3. **Output a PRD draft** (`PRODUCT_SPEC.md` skeleton) for user confirmation before generating any code.
4. **Do NOT copy** proprietary business logic — focus on structural patterns only.

**Output Sequence**:
```
1. [Inferred entity model as Mermaid classDiagram]
2. [PRODUCT_SPEC.md skeleton]
3. [User confirmation gate — await "Approve" before proceeding]
```

**Example trigger prompt**: *"Build something similar to this admin panel"* (with screenshot)

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v2.0 | 2026-02-28 | Complete rewrite: from empty stub to active AI behavioral protocol for visual/audio/URL inputs |
| v1.0 | 2025-Q4 | Initial stub — Technical Specification only, no behavioral guidance |
