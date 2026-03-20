# DDFM Kinetics & State Machine Sovereignty

## 4Ô∏è‚É£ State Machine Sovereignty
- **Mandate**: Prevent "impossible states" (e.g., `isLoading === true` AND `data != null` due to boolean overlap).
- **Implementation**: For complex components (multi-step forms, payment flows, heavy interactions), AI MUST use explicit Finite State Machines (e.g., XState) or strictly typed reducers (`{ status: 'idle' | 'loading' | 'success' | 'error' }`).
- **XState Mandate** (MUST for workflows with ‚â? state combinations, per ¬ß20 threshold): Auth flows, checkout wizards, and multi-step form sequences MUST use XState or equivalent state machine library. Zero boolean spaghetti (`isLoading && isError && hasData`) is acceptable ‚Ä?replace with explicit named states.

- **Core Web Vitals Target**: Ensure **INP (Interaction to Next Paint) < 200ms** by delegating heavy JS to Web Workers and keeping main thread unblocked. Ensure **LCP (Largest Contentful Paint)** by using `rel="preload"` for hero assets.
- **Performance Budget**: Initial JS payload MUST NOT exceed 200KB (gzipped). Prohibit heavy legacy libraries (e.g., use `date-fns` instead of `moment.js`).
- **List Virtualization Protocol**: Any data list traversing > 200 rows MUST utilize DOM virtualization (`@tanstack/react-virtual`, `vue-virtual-scroller`) to prevent disastrous main-thread blocking and UI unresponsiveness. NEVER render massive raw DOM tables.
- **Code Splitting (Dynamic Imports)**: Heavy dependencies (e.g., ECharts, PDF renderers, Map SDKs) MUST be dynamically imported (`import()`) and wrapped in Suspense with Skeleton fallbacks to avoid blocking the main bundle.
- **Kinetic Parameters**: 
  - **Spring Physics (Visceral)**: Use spring animations (`stiffness: 400, damping: 30`) ONLY for immediate visceral physical actions like button presses.
  - **Breathing Curve (Inner Peace)**: For loading, state transitions, and background shifts, MUST use a "Breathing Curve" (`cubic-bezier(0.4, 0, 0.2, 1)`, duration ~600ms). Animations must mimic human breathing‚Äîcalm, slow, and anxiety-reducing. Reject hyper-fast synthetic flashes.
- **Reduced Motion (A11y)**: All kinetic animations MUST respect `@media (prefers-reduced-motion: reduce)`. When active, transitions/animations MUST be instantaneous or fade-only to protect vestibular-sensitive users.
- **Micro-interaction Vocabulary (Norman's 3 Levels of Psychology)**:
  - **Instinct (Visceral)**: Speed and satisfaction. Buttons scale down instantly via spring to grant control.
  - **Behavior (Behavioral)**: Clarity without anxiety. Errors provide an immediate "understanding" and clear resolution paths, never just red shaking text.
  - **Reflection (Reflective)**: Meaningful completion. After long flows, give a restrained but profound sense of completion.
  
- **Multi-Sensory Companionship (Auditory Response)**: Visuals alone are insufficient for world-class design. For all critical interactions (e.g., payment success, destroying data, toggling major modes), the UI MUST trigger a subtle Web Audio API response (e.g., a low-frequency soft click or subtle success chord). The sound must be unobtrusive, default to low volume (10-15%), and heavily respect OS-level mute behaviors.
  
  | Trigger | Animation Spec | Duration |
  |---|---|---|
  | Button press / tap | Scale down to 0.96 via spring (`stiffness: 400, damping: 30`) | ~80ms |
  | Form submit success | Checkmark SVG path-draw + element fade-in | 300ms ease-out |
  | Item delete / dismiss | Slide-out (translateX 100%) + height collapse to 0 | 250ms cubic-bezier(0.4, 0, 1, 1) |
  | Toast / notification appear | Slide-in from bottom + fade from 0‚Ü? | 200ms spring |
  | Modal open | Scale from 0.95‚Ü?.0 + backdrop fade 0‚Ü?.6 | 200ms cubic-bezier(0.25, 1, 0.5, 1) |
  | Skeleton ‚Ü?content swap | Cross-fade opacity 0‚Ü? | 150ms ease-in |
  | Form validation error | Input border ‚Ü?red + element shake (`translateX ¬±4px √ó 3`) | 400ms ease |
  | API error / toast | Red pulse ring expand from element center + fade-out | 500ms ease-out |
  | Permission denied / disabled | Shade to 40% opacity + `cursor: not-allowed` (no animation ‚Ü?instant) | Instant |
  | Network offline banner | Slide-in from top + pulsing amber dot (`opacity 1‚Ü?.4` loop) | 300ms spring |
  | Drag & Drop ‚Ü?drag start | Item scale 1.05 + opacity 0.7; siblings animate gap open (`translateY`) | 150ms spring |
  | Drag & Drop ‚Ü?drop success | Item snap to slot + siblings settle; brief 1.0‚Ü?.02‚Ü?.0 scale pulse | 200ms spring |

  AI MUST reference this vocabulary for every interactive element. Deviations require explicit justification.

**Spring Physics Reference & Choreography Constraints** (MUST apply):
- **Stiffness/Damping Override**: `spring(stiffness: 400, damping: 30)` for snappy, confident responses (native feel).
- **Hard Limit**: No spatial motion may exceed `250ms`. Breathing/color transitions may use 600ms ease.
- **Violation**: Using `transition: all 0.3s ease` for structural layout shifts is a **HARD BLOCK**. Use framer-motion, Popmotion, or CSS `linear()`.

**Frustration-Aware Kinetics** (SHOULD for consumer-grade products): When `‚â? rapid clicks` are detected on the same element within 1s (rage-click pattern), AI MUST implement: (1) Slow animation speed to `0.6√ó` for 2s to signal "processing", (2) Display a contextual helper tooltip (e.g. "Processing... please wait"). This pattern measurably reduces user churn from UI confusion.

**Hardware-Aware Degradation** (MUST): Detect `navigator.hardwareConcurrency < 4` OR `prefers-reduced-motion` media query. When triggered, automatically disable: `backdrop-filter: blur()`, `box-shadow` animations, and 3D CSS transforms. Target: maintain ‚â?0FPS on mid-range devices at all times.

**Eco-Rendering & Idle Conservation (Environmental Respect)**: Monitor user activity. If the user is idle for > 3 seconds, the UI MUST drop its rendering footprint: pause all breathing gradients, halt unnecessary polling, and enter a "low-power" visual state. Code for planetary constraints.
