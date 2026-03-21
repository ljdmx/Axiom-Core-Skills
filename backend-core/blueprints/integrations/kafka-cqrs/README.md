# Event-Driven Architecture with Kafka & CQRS

## Overview
This blueprint standardizes Command Query Responsibility Segregation (CQRS) using Apache Kafka as the backbone. It ensures high resilience and decouple writes (Commands) from reads (Queries) in the enterprise back-end.

## Core Concepts
1. **Commands:** Alter state (e.g. `CreateOrderCommand`). Published to `cmd.*` topics.
2. **Events:** Emitted after a command succeeds (e.g. `OrderCreatedEvent`). Published to `evt.*` topics.
3. **Queries:** Handled by a specialized Read Model service, populated by consuming Events.

## Implementation Standard
All services MUST use the `../../../templates/go/gin/models.go` structure or NestJS microservices Kafka transport to publish/subscribe.

## Circuit Breaker Integration
When Kafka brokers are unreachable, the system must immediately fall back to the `CHAOS_PROTOCOL` defined in `../../../_core_axioms/protocols/CHAOS_PROTOCOL.md`, writing critical events to a local disk buffer until connectivity resumes.
