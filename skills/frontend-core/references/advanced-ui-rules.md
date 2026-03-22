# Advanced UI Implementation Rules (DDFM)

## 🔟 Component-Level XSS Guard & CSP
- **Mandate**: The UI layer must autonomously defend against malicious payloads.
- **Execution**: NEVER use APIs like `dangerouslySetInnerHTML` or `v-html` with raw user input.
- **CSP Headers**: Explicitly inject a `Content-Security-Policy` HTTP header.

## 1️⃣1️⃣ Component Error Boundaries & Hydration Stability
- **Error Boundaries**: Every independent business module MUST be wrapped in an Error Boundary.
- **SSR Hydration**: ANY component rendering dynamic state MUST be labeled with `"use client"`.

## 1️⃣2️⃣ Rendering Islands Protocol
- **Performance Threshold**: Prioritize Partial Hydration / Islands Architecture over full CSR.
- **Island Sizing Rule**: Each Island MUST be the smallest possible unit.

## 1️⃣3️⃣ Hyper-Realism Data Mocking
- **Mock-First**: Components MUST include `defaultMockData` to render a high-fidelity static state.
- **Zero-State Conversion**: Draw an Empty State with Call-to-Action (CTA).

## 1️⃣9️⃣ Design Coherence Score Protocol
- **Axes**: Layout Rhythm (8/10), Color Harmony (8/10), Spatial Hierarchy (8/10).

## 2️⃣0️⃣ Component State Matrix
- **Mandate**: Express intersections of [State × Role × Data] before coding.

## 2️⃣1️⃣ Design Drift Detector
- **Mandate**: Perform a Token Diff before delivering any new component.

## 2️⃣2️⃣ Texture & Depth Sovereignty
- **Noise Texture Protocol**: All large background panels MUST include an ultra-fine SVG noise texture overlay.
- **Multi-Layer Glassmorphism**: Define strictly separated structural layers (noise above blur).

## 2️⃣5️⃣ Zero-AI-Aesthetic Protocol
- **Single CTA Law**: ONLY ONE element may be a solid-fill primary button.
- **Opacity-Based Text**: Use opacity (`opacity: 0.45` to `0.65`), not hardcoded grays.
- **Forbidden AI Tells**: `border-radius: 50%` on non-circles, generic shadows, system fonts.

## 25.1 AI Aesthetic Firewall
- **Mandate**: Proactively detect and reject generic layouts like standard 3x3 icon grids.
