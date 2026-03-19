# NestJS Modular Monolith Blueprint

Complete production-ready implementation demonstrating all ADBM principles.

---

## Architecture Overview

```
src/
├── modules/                    # Domain modules (feature-based organization)
│   └── users/
│       ├── users.controller.ts       # REST API endpoints
│       ├── users.service.ts          # Business logic + caching
│       ├── users.repository.ts       # Data access layer
│       ├── dto/create-user.dto.ts    # Input validation
│       ├── dto/user-response.dto.ts  # Output serialization
│       └── entities/user.entity.ts   # Domain model
├── common/                     # Shared infrastructure
│   ├── filters/global-exception.filter.ts
│   ├── interceptors/logging.interceptor.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── guards/roles.guard.ts
│   └── decorators/roles.decorator.ts
├── config/
│   ├── database.config.ts
│   └── cache.config.ts
└── app.module.ts              # Root module

```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start database + Redis
docker-compose up -d

# Run migrations
npm run migration:run

#Start development server
npm run start:dev

# API available at: http://localhost:3000
# Swagger docs at: http://localhost:3000/api
```

---

## Project Files

Due to length constraints, core files are provided below. Full project structure follows ADBM principles.

### Key Features Demonstrated

✅ **Contract-First**: OpenAPI schema auto-generated  
✅ **Layered Architecture**: Controller → Service → Repository → Entity  
✅ **Error Handling**: Custom exceptions + Global filter  
✅ **Caching**: Redis Cache-Aside pattern  
✅ **Observability**: Structured logging + Prometheus metrics  
✅ **Security**: JWT auth + RBAC + input validation  
✅ **Performance**: Connection pooling + query optimization

---

## Environment Variables

Create `.env`:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=your-db-port
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=adbm_nestjs

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
```

---

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov

# Load test
artillery run load-test.yml
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/users` | List users | Yes |
| GET | `/api/users/:id` | Get user | Yes |
| PUT | `/api/users/:id` | Update user | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes (Admin only) |
| GET | `/health` | Health check | No |
| GET | `/metrics` | Prometheus metrics | No |

---

 ## ADBM Principles Demonstrated

See individual files for implementation details.

📖 **Full Implementation**: Refer to source files in this directory
