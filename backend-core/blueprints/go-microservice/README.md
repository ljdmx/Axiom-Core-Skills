# Go Microservice Blueprint

Production-grade gRPC microservice demonstrating enterprise-scale ADBM patterns.

---

## Architecture Overview

```
cmd/
└── server/
    └── main.go                # Entry point

internal/
├── handlers/
│   └── user_handler.go        # gRPC handlers
├── services/
│   └── user_service.go        # Business logic
├── repository/
│   └── user_repository.go     # Data access
├── models/
│   └── user.go                # Domain models
└── middleware/
    ├── auth.go                # JWT validation
    └── logging.go             # Request logging

proto/
└── user.proto                 # gRPC service definition

pkg/
├── cache/
│   └── redis.go               # Cache abstraction
└── database/
    └── database.go            # DB connection pool
```

---

## Quick Start

```bash
# Install dependencies
go mod download

# Generate gRPC code
protoc --go_out=. --go-grpc_out=. proto/*.proto

# Start infrastructure
docker-compose up -d

# Run service
go run cmd/server/main.go

# Service available at: localhost:50051
```

---

## Features

✅ **gRPC**: High-performance RPC communication  
✅ **SQL Database**: Production database with connection pooling  
✅ **Redis**: Caching layer  
✅ **JWT Auth**: Secure authentication  
✅ **OpenTelemetry**: Distributed tracing  
✅ **Prometheus**: Metrics collection

---

📖 **Full Implementation**: Refer to source files in this directory
