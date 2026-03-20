# Full-Stack Monorepo Template
## Production-Ready Turborepo with DDFM + ADBM + Unified Permissions

> [!NOTE]
> This template provides a complete monorepo setup with React (DDFM), NestJS (ADBM), unified permission model, and shared TypeScript types. One command to rule them all.

---

## ğŸš€ Quick Start

```bash
# Clone template
npx degit full-stack-product-commander/templates/monorepo-full-stack my-project
cd my-project

# Install dependencies
npm install

# Start PostgreSQL + Redis
docker-compose up -d

# Run database migrations
npm run db:migrate

# Start all apps in development mode
npm run dev

# Apps will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:4000
# - API Docs: http://localhost:4000/api
```

---

## ğŸ“ Project Structure

```
my-project/
â”œâ”€â”€ apps/
â”?  â”œâ”€â”€ web/                          # React frontend (DDFM)
â”?  â”?  â”œâ”€â”€ src/
â”?  â”?  â”?  â”œâ”€â”€ app/
â”?  â”?  â”?  â”?  â”œâ”€â”€ layout.tsx
â”?  â”?  â”?  â”?  â””â”€â”€ page.tsx
â”?  â”?  â”?  â”œâ”€â”€ components/
â”?  â”?  â”?  â”?  â”œâ”€â”€ BlogCard.tsx
â”?  â”?  â”?  â”?  â””â”€â”€ UserProfile.tsx
â”?  â”?  â”?  â”œâ”€â”€ hooks/
â”?  â”?  â”?  â”?  â”œâ”€â”€ usePermission.ts  # Permission hook
â”?  â”?  â”?  â”?  â””â”€â”€ useAuth.ts
â”?  â”?  â”?  â”œâ”€â”€ lib/
â”?  â”?  â”?  â”?  â””â”€â”€ api.ts            # Type-safe API client
â”?  â”?  â”?  â””â”€â”€ styles/
â”?  â”?  â”?      â””â”€â”€ globals.css
â”?  â”?  â”œâ”€â”€ public/
â”?  â”?  â”œâ”€â”€ package.json
â”?  â”?  â””â”€â”€ tsconfig.json
â”?  â”?
â”?  â””â”€â”€ api/                          # NestJS backend (ADBM)
â”?      â”œâ”€â”€ src/
â”?      â”?  â”œâ”€â”€ main.ts
â”?      â”?  â”œâ”€â”€ app.module.ts
â”?      â”?  â”œâ”€â”€ auth/
â”?      â”?  â”?  â”œâ”€â”€ auth.controller.ts
â”?      â”?  â”?  â”œâ”€â”€ auth.service.ts
â”?      â”?  â”?  â””â”€â”€ auth.module.ts
â”?      â”?  â”œâ”€â”€ blog/
â”?      â”?  â”?  â”œâ”€â”€ blog.controller.ts
â”?      â”?  â”?  â”œâ”€â”€ blog.service.ts
â”?      â”?  â”?  â”œâ”€â”€ blog.module.ts
â”?      â”?  â”?  â””â”€â”€ entities/
â”?      â”?  â”?      â””â”€â”€ blog.entity.ts
â”?      â”?  â”œâ”€â”€ user/
â”?      â”?  â””â”€â”€ common/
â”?      â”?      â”œâ”€â”€ guards/
â”?      â”?      â”?  â””â”€â”€ permission.guard.ts
â”?      â”?      â””â”€â”€ decorators/
â”?      â”?          â””â”€â”€ require-permission.decorator.ts
â”?      â”œâ”€â”€ migrations/
â”?      â”œâ”€â”€ package.json
â”?      â””â”€â”€ tsconfig.json
â”?
â”œâ”€â”€ packages/
â”?  â”œâ”€â”€ permission-model/             # ğŸ”‘ Unified permissions
â”?  â”?  â”œâ”€â”€ src/
â”?  â”?  â”?  â”œâ”€â”€ index.ts
â”?  â”?  â”?  â”œâ”€â”€ permissions.ts        # PERMISSIONS.BLOG.READ
â”?  â”?  â”?  â”œâ”€â”€ roles.ts              # Role â†?Permission mapping
â”?  â”?  â”?  â”œâ”€â”€ frontend/
â”?  â”?  â”?  â”?  â””â”€â”€ usePermission.ts  # React hook
â”?  â”?  â”?  â””â”€â”€ backend/
â”?  â”?  â”?      â””â”€â”€ decorators.ts     # @RequirePermission
â”?  â”?  â”œâ”€â”€ package.json
â”?  â”?  â””â”€â”€ tsconfig.json
â”?  â”?
â”?  â”œâ”€â”€ shared-types/                 # ğŸ“ Shared TypeScript types
â”?  â”?  â”œâ”€â”€ src/
â”?  â”?  â”?  â”œâ”€â”€ index.ts
â”?  â”?  â”?  â”œâ”€â”€ entities/
â”?  â”?  â”?  â”?  â”œâ”€â”€ user.types.ts
â”?  â”?  â”?  â”?  â””â”€â”€ blog.types.ts
â”?  â”?  â”?  â”œâ”€â”€ dtos/
â”?  â”?  â”?  â”?  â”œâ”€â”€ create-blog.dto.ts
â”?  â”?  â”?  â”?  â””â”€â”€ update-blog.dto.ts
â”?  â”?  â”?  â””â”€â”€ responses/
â”?  â”?  â”?      â””â”€â”€ paginated.response.ts
â”?  â”?  â”œâ”€â”€ package.json
â”?  â”?  â””â”€â”€ tsconfig.json
â”?  â”?
â”?  â”œâ”€â”€ ui/                           # ğŸ¨ Shared UI components (DDFM)
â”?  â”?  â”œâ”€â”€ src/
â”?  â”?  â”?  â”œâ”€â”€ Button.tsx
â”?  â”?  â”?  â”œâ”€â”€ Card.tsx
â”?  â”?  â”?  â”œâ”€â”€ Input.tsx
â”?  â”?  â”?  â””â”€â”€ index.ts
â”?  â”?  â”œâ”€â”€ package.json
â”?  â”?  â””â”€â”€ tsconfig.json
â”?  â”?
â”?  â””â”€â”€ config/                       # ğŸ› ï¸?Shared configs
â”?      â”œâ”€â”€ eslint-config/
â”?      â”œâ”€â”€ typescript-config/
â”?      â””â”€â”€ tailwind-config/
â”?
â”œâ”€â”€ docker-compose.yml                # PostgreSQL + Redis
â”œâ”€â”€ turbo.json                        # Turborepo configuration
â”œâ”€â”€ package.json                      # Root package.json
â””â”€â”€ README.md
```

---

## ğŸ“¦ Key Packages

### 1. permission-model (Unified Permissions)

#### permissions.ts
```typescript
export const PERMISSIONS = {
  BLOG: {
    READ: 'blog:read',
    WRITE: 'blog:write',
    UPDATE_OWN: 'blog:update:own',
    UPDATE_ANY: 'blog:update:any',
    DELETE: 'blog:delete',
    PUBLISH: 'blog:publish',
  },
  USER: {
    READ_OWN: 'user:read:own',
    READ_ANY: 'user:read:any',
    UPDATE_OWN: 'user:update:own',
    MANAGE: 'user:manage',
  },
  COMMENT: {
    READ: 'comment:read',
    WRITE: 'comment:write',
    MODERATE: 'comment:moderate',
  },
} as const;

export type Permission = 
  | typeof PERMISSIONS.BLOG[keyof typeof PERMISSIONS.BLOG]
  | typeof PERMISSIONS.USER[keyof typeof PERMISSIONS.USER]
  | typeof PERMISSIONS.COMMENT[keyof typeof PERMISSIONS.COMMENT];
```

#### Frontend Usage (React)
```typescript
// apps/web/src/components/BlogCard.tsx
import { usePermission } from '@repo/permission-model/frontend';
import { PERMISSIONS } from '@repo/permission-model';

export function BlogCard({ blog }) {
  const canEdit = usePermission(PERMISSIONS.BLOG.UPDATE_OWN);
  const canDelete = usePermission(PERMISSIONS.BLOG.DELETE);

  return (
    <Card>
      <h2>{blog.title}</h2>
      {canEdit && <Button onClick={handleEdit}>Edit</Button>}
      {canDelete && <Button onClick={handleDelete}>Delete</Button>}
    </Card>
  );
}
```

#### Backend Usage (NestJS)
```typescript
// apps/api/src/blog/blog.controller.ts
import { RequirePermission } from '@repo/permission-model/backend';
import { PERMISSIONS } from '@repo/permission-model';

@Controller('blogs')
export class BlogController {
  @Get()
  @RequirePermission(PERMISSIONS.BLOG.READ)
  findAll() {
    return this.blogService.findAll();
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.BLOG.DELETE)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
```

---

### 2. shared-types (Unified Types)

```typescript
// packages/shared-types/src/entities/blog.types.ts
export interface Blog {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// packages/shared-types/src/dtos/create-blog.dto.ts
export interface CreateBlogDto {
  title: string;
  content: string;
  tags?: string[];
}

// Used in both frontend and backend!
```

#### Type-Safe API Client (Frontend)
```typescript
// apps/web/src/lib/api.ts
import type { Blog, CreateBlogDto } from '@repo/shared-types';

export async function getBlogs(): Promise<Blog[]> {
  const res = await fetch('/api/blogs');
  return res.json();
}

export async function createBlog(data: CreateBlogDto): Promise<Blog> {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

---

## ğŸ”§ Turborepo Configuration

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "db:migrate": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    }
  }
}
```

### Root package.json Scripts
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    
    "db:migrate": "npm run migration:run --prefix apps/api",
    "db:generate": "npm run prisma:generate --prefix apps/api",
    
    "clean": "turbo run clean && rimraf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "prettier": "^3.0.0"
  }
}
```

---

## ğŸ³ Docker Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myproject_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

---

## ğŸ› ï¸?Development Workflow

### 1. Create New Feature

```bash
# Create feature branch
git checkout -b feature/comments

# Run dev servers (hot reload enabled)
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### 2. Add New Permission

```typescript
// 1. Update packages/permission-model/src/permissions.ts
export const PERMISSIONS = {
  // ...existing
  COMMENT: {
    READ: 'comment:read',
    WRITE: 'comment:write',
    DELETE: 'comment:delete',  // ğŸ†•
  },
};

// 2. Backend automatically picks up change
@Delete(':id')
@RequirePermission(PERMISSIONS.COMMENT.DELETE)  // Type-safe!
deleteComment() { }

// 3. Frontend automatically picks up change
const canDelete = usePermission(PERMISSIONS.COMMENT.DELETE);
```

### 3. Add New API Endpoint

```typescript
// 1. Define types in packages/shared-types
export interface Comment {
  id: string;
  content: string;
  blogId: string;
  authorId: string;
}

export interface CreateCommentDto {
  content: string;
  blogId: string;
}

// 2. Implement backend (apps/api)
@Post()
async create(@Body() dto: CreateCommentDto): Promise<Comment> {
  return this.commentService.create(dto);
}

// 3. Use in frontend (apps/web) with full type safety
const comment = await createComment({ content: 'Great post!', blogId: '123' });
console.log(comment.id); // TypeScript knows all fields!
```

---

## ğŸ§ª Testing

### Run All Tests
```bash
npm run test

# Run specific app tests
npm run test --filter=web
npm run test --filter=api
```

### Example E2E Test
```typescript
// apps/api/test/blog.e2e-spec.ts
describe('Blog API (e2e)', () => {
  it('should enforce permissions', async () => {
    const userToken = await getTokenWithPermissions([PERMISSIONS.BLOG.READ]);
    
    // Should fail - user doesn't have blog:delete
    await request(app)
      .delete('/blogs/123')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    const adminToken = await getTokenWithPermissions([PERMISSIONS.BLOG.DELETE]);
    
    // Should succeed
    await request(app)
      .delete('/blogs/123')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});
```

---

## ğŸ“Š Performance

### Turborepo Cache Benefits
- **First build**: ~60s
- **Cached build**: ~5s (12x faster!)
- **Parallel dev servers**: 3 apps start simultaneously

### Bundle Sizes
- **Frontend (web)**: ~150KB gzipped
- **permission-model**: 2KB
- **shared-types**: 0KB (types erased at runtime)

---

## ğŸš¢ Deployment

### Build for Production
```bash
npm run build

# Output:
# apps/web/.next/        - Next.js production build
# apps/api/dist/         - NestJS production build
```

### Docker Multi-Stage Build
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production stage (frontend)
FROM node:18-alpine AS web
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "run", "start:web"]

# Production stage (backend)
FROM node:18-alpine AS api
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "run", "start:api"]
```

---

## âœ?Best Practices Built-In

### Code Quality
- âœ?ESLint + Prettier configured
- âœ?Husky pre-commit hooks
- âœ?TypeScript strict mode
- âœ?Import sorting

### Security
- âœ?Environment variables validation
- âœ?CORS configured
- âœ?Helmet.js for HTTP headers
- âœ?Rate limiting

### Performance
- âœ?Tree-shaking enabled
- âœ?Code splitting (Next.js)
- âœ?Connection pooling (PostgreSQL)
- âœ?Redis caching

### Developer Experience
- âœ?One command to start all apps
- âœ?Hot reload for all packages
- âœ?Shared TypeScript configs
- âœ?Auto-generated API types

---

## ğŸ“š Related Documentation

- [DDFM](../../design-driven-frontend-manifesto/SKILL.md) - Frontend component patterns
- [ADBM](../../api-driven-backend-manifesto/SKILL.md) - Backend architecture
- [Permission Orchestration](../references/permission-orchestration.md) - Unified permissions
- [Unified Type System](../references/unified-type-system.md) - End-to-end types

---

## ğŸ“ Learning Path

### Day 1: Setup & Exploration
1. Clone template
2. Start dev servers
3. Explore project structure
4. Make a simple UI change

### Week 1: Add Feature
1. Create new resource (e.g., comments)
2. Add permissions to `permission-model`
3. Implement backend API
4. Build frontend UI
5. Write E2E tests

### Week 2+: Customize
1. Add your brand design to `ui` package
2. Configure CI/CD pipeline
3. Deploy to staging
4. Set up monitoring

---

> **Monorepo Template**: DDFM + ADBM unified. Type-safe. Permission-locked. Production-ready. ğŸš€
