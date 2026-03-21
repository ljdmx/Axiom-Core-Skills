# Template Matching Algorithm
## Intelligent Template Selection System

---

## 🎯 Purpose

Automatically select the best template based on user request and project context.

**Goal**: 80% template reuse rate with 0.9+ relevance scores

---

## 🧠 Algorithm Architecture

### 1. Intent Extraction

```typescript
interface Intent {
  type: 'create' | 'update' | 'delete';
  entity: string;          // 'controller', 'component', 'page', 'route'
  pattern: string;         // 'CRUD', 'Auth', 'Dashboard', 'Table'
  complexity: number;      // 1-10
  keywords: string[];
  language: 'en' | 'zh';
}

function analyzeIntent(userRequest: string): Intent {
  const request = userRequest.toLowerCase();
  
  // Detect type
  let type: 'create' | 'update' | 'delete' = 'create';
  if (request.includes('update') || request.includes('modify')) type = 'update';
  if (request.includes('delete') || request.includes('remove')) type = 'delete';
  
  // Detect entity
  let entity = 'unknown';
  if (request.match(/controller|api|endpoint/)) entity = 'controller';
  if (request.match(/component|ui|widget/)) entity = 'component';
  if (request.match(/page|view|screen/)) entity = 'page';
  if (request.match(/route|routing/)) entity = 'route';
  
  // Detect pattern
  let pattern = 'custom';
  if (request.match(/crud|create.*read.*update.*delete/)) pattern = 'CRUD';
  if (request.match(/auth|login|register|jwt/)) pattern = 'Auth';
  if (request.match(/dashboard|admin.*panel/)) pattern = 'Dashboard';
  if (request.match(/table|list|grid|data.*table/)) pattern = 'Table';
  
  // Detect language
  const hasChinese = /[\u4e00-\u9fa5]/.test(userRequest);
  const language = hasChinese ? 'zh' : 'en';
  
  // Extract keywords
  const keywords = request.split(/\s+/).filter(word => 
    word.length > 3 && !['create', 'update', 'delete', 'make', 'build'].includes(word)
  );
  
  // Estimate complexity
  const complexity = estimateComplexity(request);
  
  return { type, entity, pattern, complexity, keywords, language };
}

function estimateComplexity(request: string): number {
  let score = 5; // Base
  
  // Increase for features
  if (request.includes('pagination')) score += 1;
  if (request.includes('sort') || request.includes('filter')) score += 1;
  if (request.includes('auth') || request.includes('permission')) score += 2;
  if (request.includes('real-time') || request.includes('websocket')) score += 2;
  if (request.includes('payment') || request.includes('integration')) score += 2;
  
  return Math.min(10, score);
}
```

---

### 2. Template Filtering

```typescript
function filterCandidates(
  intent: Intent,
  templates: Template[],
  projectContext: ProjectContext
): Template[] {
  
  return templates.filter(template => {
    // 1. Entity match (MUST match)
    if (intent.entity === 'controller' && template.category !== 'backend') {
      return false;
    }
    if (intent.entity === 'component' && template.category !== 'frontend') {
      return false;
    }
    
    // 2. Framework compatibility
    if (template.framework) {
      const frontendMatch = 
        projectContext.framework.frontend—.includes(template.framework);
      const backendMatch = 
        projectContext.framework.backend—.includes(template.framework);
      
      if (!frontendMatch && !backendMatch) {
        return false;
      }
    }
    
    // 3. Dependency availability
    const missingDeps = template.dependencies.filter(dep =>
      !projectContext.dependencies.frontend.includes(dep) &&
      !projectContext.dependencies.backend.includes(dep)
    );
    
    // Allow if < 2 missing deps (can install)
    if (missingDeps.length > 2) {
      return false;
    }
    
    // 4. Tag overlap
    const hasTagOverlap = template.tags.some(tag =>
      intent.keywords.includes(tag) || intent.pattern.toLowerCase().includes(tag)
    );
    
    return hasTagOverlap;
  });
}
```

---

### 3. Relevance Scoring

```typescript
function calculateRelevance(
  template: Template,
  intent: Intent,
  projectContext: ProjectContext
): number {
  let score = 0;
  
  // 1. Pattern exact match (40%)
  if (template.tags.includes(intent.pattern.toLowerCase())) {
    score += 0.4;
  } else if (template.name.toLowerCase().includes(intent.pattern.toLowerCase())) {
    score += 0.3;
  }
  
  // 2. Dependency compatibility (30%)
  const totalDeps = template.dependencies.length;
  const availableDeps = template.dependencies.filter(dep =>
    projectContext.dependencies.frontend.includes(dep) ||
    projectContext.dependencies.backend.includes(dep)
  ).length;
  
  score += (availableDeps / totalDeps) * 0.3;
  
  // 3. Complexity match (15%)
  const complexityDiff = Math.abs(template.complexity - intent.complexity);
  score += Math.max(0, (10 - complexityDiff) / 10) * 0.15;
  
  // 4. Reusability bonus (10%)
  score += (template.reusability / 10) * 0.1;
  
  // 5. Language match (5%)
  if (template.customizationPoints—.includes('LANGUAGE')) {
    score += 0.05; // Supports i18n
  }
  
  return score;
}
```

---

### 4. Selection Logic

```typescript
function selectBestTemplate(
  userRequest: string,
  projectContext: ProjectContext,
  templates: Template[]
): Template | null {
  
  // Step 1: Analyze intent
  const intent = analyzeIntent(userRequest);
  console.log(`📊 Intent: ${intent.type} ${intent.entity} (${intent.pattern})`);
  
  // Step 2: Filter candidates
  let candidates = filterCandidates(intent, templates, projectContext);
  console.log(`🔍 Candidates: ${candidates.length} templates`);
  
  if (candidates.length === 0) {
    console.log('❌No matching templates found');
    return null;
  }
  
  // Step 3: Score and rank
  const scored = candidates.map(template => ({
    template,
    score: calculateRelevance(template, intent, projectContext)
  })).sort((a, b) => b.score - a.score);
  
  // Step 4: Return best match if score > threshold
  const best = scored[0];
  const threshold = 0.7;
  
  if (best.score >= threshold) {
    console.log(`✅Selected: ${best.template.name} (score: ${best.score.toFixed(2)})`);
    return best.template;
  } else {
    console.log(`⚠️ Best score (${best.score.toFixed(2)}) below threshold (${threshold})`);
    return null;
  }
}
```

---

## 📊 Example Scenarios

### Scenario 1: "Create CRUD controller for Farm"

```typescript
// Input
userRequest = "Create CRUD controller for Farm";

// Step 1: Intent
{
  type: 'create',
  entity: 'controller',
  pattern: 'CRUD',
  complexity: 6,
  keywords: ['farm'],
  language: 'en'
}

// Step 2: Filter
candidates = [
  crud-controller,     // ✅backend + CRUD tag
  auth-controller,     // ❌No CRUD tag
  dashboard-layout     // ❌frontend, not backend
]
//Result: 1 candidate

// Step 3: Score
crud-controller:
  Pattern match: 0.4  (exact 'crud' tag)
  Dependencies: 0.3   (all available)
  Complexity: 0.15    (6 vs 6 = perfect)
  Reusability: 0.09   (9/10)
  Language: 0.05      (supports i18n)
  TOTAL: 0.99 ⭐

// Step 4: Select
✅crud-controller (score: 0.99)
```

---

### Scenario 2: "Create user login page"

```typescript
// Input
userRequest = "Create user login page";

// Step 1: Intent
{
  type: 'create',
  entity: 'page',
  pattern: 'Auth',
  complexity: 6,
  keywords: ['user', 'login', 'page'],
  language: 'en'      // ✅Detected English
}

// Step 2: Filter
candidates = [
  login-page,          // ✅frontend + auth tag
  auth-controller,     // ❌backend, not page
  data-table          // ❌No auth tag
]

// Step 3: Score
login-page:
  Pattern match: 0.4
  Dependencies: 0.3
  Complexity: 0.15
  Reusability: 0.09
  Language: 0.05      // ✅Has i18n support
  TOTAL: 0.99 ⭐

// Step 4: Customization
Template will be filled with LANGUAGE = 'en'
Result: 100% English UI ✅
```

---

### Scenario 3: "Build admin dashboard with sidebar"

```typescript
// Input
userRequest = "Build admin dashboard with sidebar";

// Step 1: Intent
{
  type: 'create',
  entity: 'component',  // Could also be 'page'
  pattern: 'Dashboard',
  complexity: 7,
  keywords: ['admin', 'dashboard', 'sidebar'],
  language: 'en'
}

// Step 2: Filter
candidates = [
  dashboard-layout,    // ✅frontend + dashboard + sidebar tags
  data-table,          // ⚠️ frontend but no dashboard tag
  crud-controller      // ❌backend
]

// Step 3: Score
dashboard-layout:
  Pattern match: 0.4  (dashboard tag + sidebar in description)
  Dependencies: 0.3   (react, lucide, framer-motion all available)
  Complexity: 0.15    (7 vs 7)
  Reusability: 0.10   (10/10 reusability)
  Language: 0.05
  TOTAL: 1.00 ⭐PERFECT

// Step 4: Select
✅dashboard-layout (score: 1.00)
```

---

## 🔧 Integration into Workflow

### ADBM Workflow Update:

```markdown
**EXECUTION** (per module):
1. Load context cache
2. **Template Matching**:
   ```typescript
   const template = selectBestTemplate(userRequest, context, templates);
   
   IF template (score >= 0.7):
     customizations = extractCustomizations(userRequest);
     code = customizeTemplate(template, customizations);
     writeFile(targetPath, code);
     updateCache(targetPath, 'AI');
     RETURN success (2-5 minutes)
   
   ELSE:
     buildFromScratch();
     evaluateForTemplating(result); // Save as new template if worthy
     RETURN success (15-20 minutes)
   ```
```

---

### DDFM Workflow Update:

```markdown
**Phase 2: Component Generation**
1. **Template-First Approach**:
   ```
   Request → Analyze Intent → Match Template
   
   IF match:
     Use template (2 min)
     Customize: BRAND_NAME, LANGUAGE, THEME_COLORS
     Quality Gate → Done
   ELSE:
     Build from scratch (15 min)
     Save as template if reusability > 7
   ```
```

---

## 📈 Success Metrics

### Target Performance:

```typescript
interface MatchingMetrics {
  templateHitRate: number;       // Target: > 80%
  averageScore: number;          // Target: > 0.85
  falsePositives: number;        // Target: < 5%
  timeSavingsPerMatch: number;   // Target: > 10 minutes
}

// Expected results:
{
  templateHitRate: 85%,          // 17 out of 20 requests
  averageScore: 0.88,            // High relevance
  falsePositives: 2%,            // Rare mismatches
  timeSavingsPerMatch: 12 min    // Huge productivity boost
}
```

---

## 🎯 Edge Cases Handling

### Case 1: Multiple High-Scoring Matches

```typescript
// If top 2 scores are within 0.05:
if (scored[1].score - scored[0].score < 0.05) {
  // Present both options to user or use context tiebreaker
  const preferred = tiebreak(scored[0], scored[1], projectContext);
  return preferred;
}
```

### Case 2: No Match Above Threshold

```typescript
// Suggest closest match with caveat
if (best.score < 0.7 && best.score > 0.5) {
  console.log(`💡 Closest match: ${best.template.name} (${best.score})`);
  console.log(`   Building from scratch instead.`);
  return null; // Trigger custom build
}
```

### Case 3: Ambiguous Intent

```typescript
// Example: "Create auth" (controller or page—)
if (intent.entity === 'unknown') {
  // Check project context for hints
  if (projectContext.lastEntity === 'backend') {
    intent.entity = 'controller'; // Assume backend continuation
  } else {
    // Default to frontend (safer)
    intent.entity = 'component';
  }
}
```

---

## 🚀 Implementation Checklist

- [ ] Implement `analyzeIntent()` function
- [ ] Implement `filterCandidates()` function
- [ ] Implement `calculateRelevance()` scoring
- [ ] Implement `selectBestTemplate()` orchestration
- [ ] Add to ADBM workflow
- [ ] Add to DDFM workflow
- [ ] Test on 20 sample requests
- [ ] Measure hit rate and average score
- [ ] Optimize threshold based on results

---

**Next**: Integrate into skills and test with real requests 🚀
