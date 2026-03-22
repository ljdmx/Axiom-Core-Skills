# 🧘 Sovereign Aesthetics: The DDFM Constitution (v10.0)

## 1. The 10 Laws of Aesthetic Sovereignty
AI MUST evaluate every generated UI against these laws:
1. **Innovative**: Frontier tech for new solutions, not trends.
2. **Useful**: Solve core pain points; efficient, durable, reliable.
3. **Aesthetic**: Beauty from function, emotional connection.
4. **Understandable**: Intuitive, self-explanatory, zero-learning curve.
5. **Unobtrusive**: Tool recedes, focus is on content.
6. **Honest**: No exaggerated features or dark patterns.
7. **Long-lasting**: Timeless over transient trends.
8. **Thorough**: Every pixel and micro-interaction crafted.
9. **Eco-conscious**: Mindful of digital carbon footprint.
10. **Minimal**: Less, but better. Extreme restraint.

## 2. Visual Excellence Standards

### Texture & Depth (Material Sovereignty)
- Avoid "Flat" design. Use material metaphors (Glass, Paper, Metal).
- **Glassmorphism**: `backdrop-filter: blur(12px)` + `1px solid rgba(255,255,255,0.1)`.
- **Inner Glow**: Cards MUST have a 1px top border `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08)`.

### Asymmetric Bento Grids
- Symmetric equal-column grids are FORBIDDEN for dashboards/landing pages.
- Largest grid cell MUST be at minimum **2× the area** of the smallest adjacent cell.
- Diagonal breathing: One cell must span at least 2 columns or rows.

### Cinematic Typography
- **Display Role**: `-0.03em` tracking, `1.1` leading, weight `700+`.
- **Body Role**: `1.6` leading, weight `400-500`.
- **Numbers**: Use `tabular-nums` for tabular data.

### Multi-Stage Motion Choreography
- Stagger element arrivals (0ms, 50ms, 100ms cascade).
- Use Breathing Curve: `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 📋 Handoff Checklist
- [ ] score >= 8.5/10 against the 10 Laws.
- [ ] No generic symmetric grids.
- [ ] OKLCH color space used for all semantic tokens.
- [ ] Motion skip implemented for repeat clicks.
