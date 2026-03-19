# Full-Stack Monorepo Template
## Production-Ready Turborepo with DDFM + ADBM + Unified Permissions

> [!NOTE]
> This template provides a complete monorepo setup with React (DDFM), NestJS (ADBM), unified permission model, and shared TypeScript types. One command to rule them all.

---

## 🚀 Quick Start

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

## 📁 Project Structure

```
my-project/
├── apps/
│   ├── web/                          # React frontend (DDFM)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── BlogCard.tsx
│   │   │   │   └── UserProfile.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePermission.ts  # Permission hook
│   │   │   │   └── useAuth.ts
│   │   │   ├── lib/
│   │   │   │   └── api.ts            # Type-safe API client
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   ├── public/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/                          # NestJS backend (ADBM)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── auth/
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts
│       │   │   └── auth.module.ts
│       │   ├── blog/
│       │   │   ├── blog.controller.ts
│       │   │   ├── blog.service.ts
│       │   │   ├── blog.module.ts
│       │   │   └── entities/
│       │   │       └── blog.entity.ts
│       │   ├── user/
│       │   └── common/
│       │       ├── guards/
│       │       │   └── permission.guard.ts
│       │       └── decorators/
│       │           └── require-permission.decorator.ts
│       ├── migrations/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── permission-model/             # 🔑 Unified permissions
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── permissions.ts        # PERMISSIONS.BLOG.READ
│   │   │   ├── roles.ts              # Role → Permission mapping
│   │   │   ├── frontend/
│   │   │   │   └── usePermission.ts  # React hook
│   │   │   └── backend/
│   │   │       └── decorators.ts     # @RequirePermission
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-types/                 # 📝 Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── entities/
│   │   │   │   ├── user.types.ts
│   │   │   │   └── blog.types.ts
│   │   │   ├── dtos/
│   │   │   │   ├── create-blog.dto.ts
│   │   │   │   └── update-blog.dto.ts
│   │   │   └── responses/
│   │   │       └── paginated.response.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                           # 🎨 Shared UI components (DDFM)
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                       # 🛠️ Shared configs
│       ├── eslint-config/
│       ├── typescript-config/
│       └── tailwind-config/
│
├── docker-compose.yml                # PostgreSQL + Redis
├── turbo.json                        # Turborepo configuration
├── package.json                      # Root package.json
└── README.md
```

---

## 📦 Key Packages

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

## 🔧 Turborepo Configuration

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

## 🐳 Docker Setup

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

## 🛠️ Development Workflow

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
    DELETE: 'comment:delete',  // 🆕
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

## 🧪 Testing

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

## 📊 Performance

### Turborepo Cache Benefits
- **First build**: ~60s
- **Cached build**: ~5s (12x faster!)
- **Parallel dev servers**: 3 apps start simultaneously

### Bundle Sizes
- **Frontend (web)**: ~150KB gzipped
- **permission-model**: 2KB
- **shared-types**: 0KB (types erased at runtime)

---

## 🚢 Deployment

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

## ✅ Best Practices Built-In

### Code Quality
- ✅ ESLint + Prettier configured
- ✅ Husky pre-commit hooks
- ✅ TypeScript strict mode
- ✅ Import sorting

### Security
- ✅ Environment variables validation
- ✅ CORS configured
- ✅ Helmet.js for HTTP headers
- ✅ Rate limiting

### Performance
- ✅ Tree-shaking enabled
- ✅ Code splitting (Next.js)
- ✅ Connection pooling (PostgreSQL)
- ✅ Redis caching

### Developer Experience
- ✅ One command to start all apps
- ✅ Hot reload for all packages
- ✅ Shared TypeScript configs
- ✅ Auto-generated API types

---

## 📚 Related Documentation

- [DDFM](../../design-driven-frontend-manifesto/SKILL.md) - Frontend component patterns
- [ADBM](../../api-driven-backend-manifesto/SKILL.md) - Backend architecture
- [Permission Orchestration](../docs/permission-orchestration.md) - Unified permissions
- [Unified Type System](../docs/unified-type-system.md) - End-to-end types

---

## 🎓 Learning Path

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

> **Monorepo Template**: DDFM + ADBM unified. Type-safe. Permission-locked. Production-ready. 🚀
