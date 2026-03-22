# Local Edge AI Capabilities
---
version: "1.0.0"
platforms: ["iOS", "Android", "UniApp"]
---

## 1. Intent
In highly secure or low-connectivity environments, agentic computing falls entirely on the edge device. Provide inference layers running entirely locally on-device via quantized ONNX or Core ML / NNAPI runtimes.

## 2. Model Standards
All edge models must adhere to:
- Precision: INT8 Quantized.
- Max Payload: Under 50MB.
- Framework Binding: `../../templates/native-plugins/README.md` must register native bridging calls to pass ML outputs back into JS land context asynchronously.

## 3. Fallback Mechanism
Should the local hardware lack an NPU, or RAM pressure forces an eviction, fallback cleanly to remote agent queries utilizing standard Axiom Telemetry definitions (see `../../_core_axioms/dashboards/telemetry_dashboard.html`).
