## 2️⃣8️⃣ Contextual Color Semantics (Emotion-Accurate Tokens)
- **Mandate**: Standard `success=green`, `error=red` semantic colors are blunt instruments. Enterprise-grade products use color to communicate nuanced emotional states, not just binary outcomes. The color system must match the emotional register of the moment.
- **Emotion-Accurate Semantic Token Table** (AI MUST define these tokens, not use raw named CSS colors):

  | Token | Emotional Intent | OKLCH Range | Anti-Pattern to Avoid |
  |---|---|---|---|
  | `--semantic-success` | Calm confirmation, not celebration | `oklch(62% 0.15 145�?60)` (warm jade, not neon green) | `#00FF00`, `green` |
  | `--semantic-caution` | Gentle alertness, not alarm | `oklch(75% 0.14 70�?5)` (warm amber, not orange) | `#FF8C00`, `orange` |
  | `--semantic-destructive` | Firm but not aggressive | `oklch(52% 0.16 20�?0)` (desaturated brick red, not fire engine) | `#FF0000`, `red` |
  | `--semantic-info` | Curious, neutral guidance | `oklch(60% 0.12 230�?50)` (muted slate blue) | `#0000FF`, `blue` |
  | `--semantic-delight` | Surprise and warmth | `oklch(70% 0.14 300�?20)` (soft violet, for delight moments only) | Any persistent use of purples |
  | `--semantic-empty` | Quiet invitation, not emptiness | `oklch(82% 0.04 60�?0)` (warm parchment, for empty states) | Pure gray, `#F5F5F5` |

- **Contextual Palette Switching**: On dark mode, each semantic token MUST shift L value (lightness) while keeping the same hue and chroma. Never just invert �?always re-derive for the dark environment.
- **Emotion Forbiddance**: NEVER use `--semantic-success` for a promotional/marketing highlight. `--semantic-delight` is the only acceptable choice for moments of reward or celebration.



