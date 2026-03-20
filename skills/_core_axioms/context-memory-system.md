# Context Memory System (File Digest Cache)
## Smart File Access Protocol

---

## 🎯 Purpose

Eliminate redundant file views by maintaining intelligent file digests and context awareness.

**Problem**: AI views the same file 3-5 times per session, wasting 30K+ tokens  
**Solution**: File digest cache + smart re-view logic

---

## 📋 System Architecture

### 1. File Digest Structure

```typescript
interface FileDigest {
  path: string;
  viewedAt: string; // ISO timestamp
  lastModifiedBy: 'AI' | 'user' | 'external';
  digest: {
    // For code files
    imports?: string[];
    exports?: string[];
    functions?: string[];
    classes?: string[];
    
    // For Prisma schema
    models?: string[];
    relations?: Record<string, string[]>;
    
    // For package.json
    dependencies?: string[];
    scripts?: string[];
    
    // For React components
    components?: string[];
    props?: Record<string, string[]>;
  };
  needsReview: boolean;
  reviewReason?: string;
}

interface ContextCache {
  sessionId: string;
  projectRoot: string;
  createdAt: string;
  lastUpdated: string;
  fileDigests: Record<string, FileDigest>;
  projectContext?: ProjectContext;
}
```

---

## 🧠 Smart Re-view Decision Tree

### Decision Algorithm

```typescript
function shouldReviewFile(
  filePath: string,
  reason: 'normal' | 'error' | 'edit' | 'user-request'
): boolean | { partial: true; lines: [number, number] } {
  
  const cache = loadCache();
  const digest = cache.fileDigests[filePath];
  
  // 1. Never viewed �?MUST view
  if (!digest) {
    return true;
  }
  
  // 2. Error context �?View ONLY error region
  if (reason === 'error' && currentError?.file === filePath) {
    const errorLine = currentError.line;
    return {
      partial: true,
      lines: [errorLine - 5, errorLine + 5] // ±5 lines context
    };
  }
  
  // 3. User explicitly requested �?View
  if (reason === 'user-request') {
    return true;
  }
  
  // 4. AI just modified + recent �?SKIP (trust own changes)
  if (
    digest.lastModifiedBy === 'AI' &&
    isRecent(digest.viewedAt, '5 minutes')
  ) {
    return false; // Use cached digest
  }
  
  // 5. Modified by user/external �?MUST review
  if (digest.lastModifiedBy !== 'AI') {
    return true;
  }
  
  // 6. Needs review flagged �?View
  if (digest.needsReview) {
    return true;
  }
  
  // 7. Default: Use cache
  return false;
}
```

---

## 📦 Progressive Context Building

### Project Context Graph

```typescript
interface ProjectContext {
  detected: boolean;
  framework: {
    frontend?: 'React' | 'Vue' | 'Next.js' | 'Vite';
    backend?: 'Express' | 'NestJS' | 'FastAPI' | 'Spring Boot';
    database?: 'MySQL' | 'PostgreSQL' | 'MongoDB' | 'Supabase';
  };
  structure: {
    isMonorepo: boolean;
    apps: string[];
    packages: string[];
    workspaceRoot: string;
  };
  dependencies: {
    frontend: string[];
    backend: string[];
  };
  patterns: {
    authStrategy?: 'JWT' | 'Session' | 'OAuth';
    stateManagement?: 'Redux' | 'Zustand' | 'Context';
    orm?: 'Prisma' | 'TypeORM' | 'Sequelize';
  };
  completedModules: {
    name: string;
    files: string[];
    apis: string[];
    status: 'complete' | 'in-progress';
  }[];
}
```

### Context Building Workflow

```typescript
// Session Start
async function initializeSession() {
  const cache = await loadOrCreateCache();
  
  // Build project context (ONE TIME)
  if (!cache.projectContext?.detected) {
    console.log('🔍 Building project context...');
    cache.projectContext = await buildProjectContext();
    await saveCache(cache);
  }
  
  return cache;
}

// Build context by strategic file views
async function buildProjectContext(): Promise<ProjectContext> {
  const context: ProjectContext = {
    detected: true,
    framework: {},
    structure: { isMonorepo: false, apps: [], packages: [], workspaceRoot: '' },
    dependencies: { frontend: [], backend: [] },
    patterns: {},
    completedModules: []
  };
  
  // 1. Check workspace structure (peek at root files)
  const rootFiles = await listDir('./');
  context.structure.isMonorepo = rootFiles.includes('pnpm-workspace.yaml') ||
                                   rootFiles.includes('turbo.json');
  
  // 2. Detect frameworks (package.json)
  const pkgJson = await viewFile('package.json');
  const deps = pkgJson.dependencies || {};
  
  if (deps['react']) context.framework.frontend = 'React';
  if (deps['next']) context.framework.frontend = 'Next.js';
  if (deps['express']) context.framework.backend = 'Express';
  if (deps['@prisma/client']) context.patterns.orm = 'Prisma';
  
  context.dependencies.frontend = Object.keys(deps).filter(d =>
    d.startsWith('react') || d.startsWith('vue') || d.startsWith('@types')
  );
  
  // 3. Database detection (prisma/schema.prisma or .env)
  if (fileExists('prisma/schema.prisma')) {
    const schema = await viewFile('prisma/schema.prisma');
    if (schema.includes('provider = "mysql"')) {
      context.framework.database = 'MySQL';
    } else if (schema.includes('provider = "postgresql"')) {
      context.framework.database = 'PostgreSQL';
    }
  }
  
  // 4. Cache everything
  saveCache({ projectContext: context });
  
  console.log('�?Context built. Subsequent decisions will be instant.');
  return context;
}
```

---

## 🔄 Workflow Integration

### ADBM Workflow (Updated)

```markdown
**PRE-FLIGHT**:
1. Load cache �?Check if file digest exists
2. IF exists AND recent AND AI-modified �?Skip view, use digest
3. IF error �?View ONLY error context (partial view)
4. ELSE �?Full view

**EXECUTION**:
1. View file (if needed based on cache)
2. Make changes
3. **Update digest**:
   ```typescript
   updateDigest(filePath, {
     lastModifiedBy: 'AI',
     viewedAt: now(),
     needsReview: false,
     digest: extractDigest(fileContent)
   });
   ```

**Example**:
```typescript
// Creating farm.controller.ts

// 1. Check cache
const needsView = shouldReviewFile('package.json', 'normal');
// Result: false (viewed 2 mins ago, AI modified)

// 2. Use cached digest
const deps = cache.fileDigests['package.json'].digest.dependencies;
// ['@prisma/client', 'zod', 'express'] �?All present

// 3. Create controller (no redundant view)
// Token saved: ~3K
```
```

---

## 📊 Expected Impact

### Token Savings

| Scenario | Before | After | Saved |
|----------|--------|-------|-------|
| View schema.prisma × 5 | 15K tokens | 3K (1 view) | **-12K (80%)** |
| View App.tsx × 3 | 9K tokens | 3K (1 view) | **-6K (67%)** |
| View package.json × 4 | 8K tokens | 2K (1 view) | **-6K (75%)** |
| **Per Project** | **~90K** | **~27K** | **-63K (70%)** |

### Speed Improvement

- File access decisions: **Instant** (cache lookup vs API call)
- Context building: **1x upfront** (vs rebuilding every module)
- Error debugging: **5x faster** (partial views only)

---

## 🛠�?Implementation Checklist

### Phase 1: Core System
- [ ] Create cache directory structure
- [ ] Implement FileDigest interface
- [ ] Build shouldReviewFile() decision tree
- [ ] Integrate with view_file tool

### Phase 2: Digest Extractors
- [ ] Code file extractor (imports, exports, functions)
- [ ] Prisma schema extractor (models, relations)
- [ ] package.json extractor (dependencies, scripts)
- [ ] React component extractor (components, props)

### Phase 3: Context Building
- [ ] buildProjectContext() implementation
- [ ] Update workflow to use context
- [ ] Template matching integration

### Phase 4: Validation
- [ ] Test on new project
- [ ] Measure token reduction
- [ ] Verify accuracy (no stale cache issues)

---

## ⚙️ Cache Management

### Cache Location
```
~/.gemini/antigravity/cache/
├── sessions/
�?  ├── {session-id}-context.json
�?  └── {session-id}-digests.json
└── templates/
    └── registry.json
```

### Cache Invalidation Rules

```typescript
// Auto-invalidate if:
1. File modified by user (detect via filesystem watch)
2. Session > 24 hours old
3. Explicit cache clear command
4. Build errors detected (suggests stale cache)

// Refresh strategy:
function refreshCache(reason: string) {
  if (reason === 'user-edit') {
    // Invalidate ONLY edited file
    delete cache.fileDigests[editedFile];
  } else if (reason === 'stale') {
    // Full refresh
    cache = createNewCache();
  }
}
```

---

## 🎯 Success Criteria

### Metrics to Track

```typescript
interface CacheMetrics {
  totalFileAccesses: number;
  cacheHits: number;         // Used digest instead of view
  cacheMisses: number;        // Had to view
  partialViews: number;       // Error context only
  tokensSaved: number;
  avgResponseTime: number;    // Should decrease
}

// Target:
// - Cache hit rate: > 70%
// - Token savings: > 60%
// - Zero stale cache bugs
```

---

**Next Steps**:
1. Implement core cache system
2. Add to ADBM/DDFM/FSPC workflows
3. Test on real project
4. Measure improvements

---

*System designed: 2026-01-30T15:55:00Z*
