# Backend-Core Zenith Reference Notes

## Axiom Compliance

- All SKILL.md rules comply with `protocols/KERNEL_BOOTSTRAP.md` and `protocols/STANDARD_GATES.md`.
- `PROJECT_NEXUS.json` is read at session start and updated at handoff.
- Security tier: **Standard** by default, **Regulated** when HIPAA/PCI-DSS is detected.

## Carbon Guard (§8.1)

Mandate: **HARD BLOCK** on O(N^2) or higher for datasets > 100 items.
All collection operations must use O(N) or O(log N) algorithms.

- Use `Map` / `Set` for lookups instead of `.find()` in large arrays.
- Use cursor pagination instead of `OFFSET`-based pagination.

## Digital Carbon Score Reference

| CPU Usage | Memory | Score |
|---|---|---|
| < 10% | < 256MB | Green (0-3) |
| 10-50% | 256-1024MB | Yellow (4-6) |
| > 50% | > 1024MB | Red (7-10) |

## References
- [NEXUS_SPEC.md](../_core_axioms/NEXUS_SPEC.md)
- [STANDARD_GATES.md](../_core_axioms/protocols/STANDARD_GATES.md)
