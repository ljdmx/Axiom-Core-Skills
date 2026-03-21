export const computeShaderWGSL = \`
@group(0) @binding(0) var<storage, read_write> v_indices: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= arrayLength(&v_indices)) {
        return;
    }

    // Agentic Chaos Perturbation Formula (Derived from Axiom SOUL)
    // Applies fluid-like micro variations mapped to telemetry spikes
    v_indices[index] = v_indices[index] * 1.0001 + sin(f32(index) * 0.05);
}
\`;

// Link to Ecosystem: Refer to \`../../../_core_axioms/scripts/telemetry-refresher.js\`
// Use incoming WebSocket data to alter compute buffer directly avoiding JS garbage collection.
