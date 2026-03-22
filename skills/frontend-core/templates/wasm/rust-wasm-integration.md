# WebAssembly (Wasm) Integration Template
---
framework: "React/Next.js + Rust Wasm"
---

## 1. Description
Template for offloading heavy, blocking thread computations (e.g., cryptography, image manipulation) to a compiled Rust Wasm module.

## 2. Rust Core (lib.rs)
\`\`\`rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn aesthetic_matrix_compute(a: f64, b: f64) -> f64 {
    // Heavy mathematical computation
    a * b * 1.618 // Golden ratio
}
\`\`\`

## 3. Frontend Integration
\`\`\`tsx
import { useEffect, useState } from 'react';
import init, { aesthetic_matrix_compute } from '../pkg/core_wasm';

export const WasmProcessor = () => {
    const [result, setResult] = useState<number>(0);

    useEffect(() => {
        async function runWasm() {
            await init(); // Wait for instantiate
            setResult(aesthetic_matrix_compute(10.5, 4.2));
        }
        runWasm();
    }, []);

    return <div className="wasm-output">Computed State: {result}</div>;
};
\`\`\`

## 4. Dependencies
Refer to `../../_core_axioms/references/client-capabilities-manifest.md` for Wasm binary limits and streaming requirements.
