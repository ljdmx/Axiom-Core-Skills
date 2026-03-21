# Extended Compliance and Resilience Rules (Backend-Core)

## GDPR / CCPA Compliance Protocol
- **Mandate**: Personally Identifiable Information (PII) must not exist in raw logs or unmapped databases.
- **Rules**:
  1. **Auto-Hashing**: Emails, phone numbers, and SSNs MUST be salted and hashed (e.g. bcrypt or argon2) before DB insertion if exact-match is needed, or encrypted (AES-GCM) if retrieval is needed.
  2. **Log Redaction**: Winston/Pino logger configurations MUST contain PII scrubbers replacing specific fields with `[REDACTED]`.

## Chaos Engineering & Resilience
- **Mandate**: Never assume a downstream database or generic API will be available.
- **Rules**:
  1. **Circuit Breakers**: ANY external HTTP call must be wrapped in a Circuit Breaker (e.g. Opossum in Node).
  2. **Rate Limiting**: All public gateways MUST implement leaky bucket or token bucket rate limiting to prevent DDoS.
  3. **Simulated Failure (Chaos)**: Code MUST include a chaos-testing flag (`CHAOS_MODE=true`) which randomly degrades API speeds by 2000ms or drops 5% of packets to ensure frontend gracefully handles timeouts.
