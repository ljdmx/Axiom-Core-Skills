# Template Quality Assurance System
## Automated Validation & Excellence Enforcement

---

## 🎯 Purpose

Ensure every template meets world-class standards before deployment.

**Goal**: Zero low-quality templates, 100% compliance with design standards

---

## ✅ Quality Checklist

### 1. Structural Requirements

```typescript
interface TemplateQualityCheck {
  // Meta information
  hasMetadata: boolean;
  hasVersion: boolean;
  hasDescription: boolean;
  hasCustomizationPoints: boolean;
  hasDependencies: boolean;
  
  // Content quality
  codeComplexity: number;         // 1-10
  reusabilityScore: number;       // 1-10
  documentationQuality: number;   // 1-10
  
  // Design standards (frontend only)
  hasI18n?: boolean;
  usesOKLCH?: boolean;
  hasAnimations?: boolean;
  isResponsive?: boolean;
  
  // Security (backend only)
  hasInputValidation?: boolean;
  hasErrorHandling?: boolean;
  noHardcodedSecrets?: boolean;
  
  // Validation results
  errors: string[];
  warnings: string[];
  score: number;                  // 0-100
  passed: boolean;
}
```

---

## 🔍 Validation Rules

### Rule 1: Metadata Completeness

```typescript
function validateMetadata(template: string): {
  passed: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for TEMPLATE_META block
  if (!template.includes('// TEMPLATE_META:START')) {
    errors.push('Missing TEMPLATE_META:START marker');
  }
  
  if (!template.includes('// TEMPLATE_META:END')) {
    errors.push('Missing TEMPLATE_META:END marker');
  }
  
  // Extract metadata
  const metaMatch = template.match(
    /\/\/ TEMPLATE_META:START\s*\/\*(.*?)\*\/\s*\/\/ TEMPLATE_META:END/s
  );
  
  if (!metaMatch) {
    errors.push('Invalid TEMPLATE_META format');
    return { passed: false, errors };
  }
  
  const meta = metaMatch[1];
  
  // Required fields
  const required = [
    '@template-id',
    '@version',
    '@description',
    '@customization-points',
    '@dependencies'
  ];
  
  for (const field of required) {
    if (!meta.includes(field)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  return {
    passed: errors.length === 0,
    errors
  };
}
```

---

### Rule 2: Customization Points Validation

```typescript
function validateCustomizationPoints(template: string): {
  passed: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Extract declared customization points
  const metaMatch = template.match(/@customization-points:\s*([^\n]+)/);
  if (!metaMatch) {
    errors.push('No customization points declared');
    return { passed: false, errors, warnings };
  }
  
  const declared = metaMatch[1]
    .split(',')
    .map(p => p.trim());
  
  // Find all placeholders in template
  const placeholderRegex = /\{\{([A-Z_]+)\}\}/g;
  const found = new Set<string>();
  let match;
  
  while ((match = placeholderRegex.exec(template)) !== null) {
    found.add(match[1]);
  }
  
  // Check: All placeholders are declared
  for (const placeholder of found) {
    if (!declared.includes(placeholder)) {
      errors.push(`Undeclared placeholder: {{${placeholder}}}`);
    }
  }
  
  // Check: All declared points exist
  for (const point of declared) {
    if (!found.has(point)) {
      warnings.push(`Declared but unused: ${point}`);
    }
  }
  
  // Check: Customization markers exist
  if (!template.includes('// CUSTOMIZATION_POINT:START')) {
    warnings.push('No CUSTOMIZATION_POINT markers found');
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}
```

---

### Rule 3: Language Purity (Frontend)

```typescript
function validateLanguagePurity(template: string, category: string): {
  passed: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (category !== 'frontend') {
    return { passed: true, errors }; // Skip for backend
  }
  
  // Check for i18n pattern
  const hasI18n = template.includes('const i18n = {');
  
  if (!hasI18n) {
    errors.push('Missing i18n object (required for language purity)');
  }
  
  // Check for hardcoded text (outside i18n)
  const hardcodedTextRegex = /['"`][\u4e00-\u9fa5]+['"`]/g;
  const matches = template.match(hardcodedTextRegex) || [];
  
  // Filter out i18n block
  const i18nBlock = template.match(/const i18n = \{[\s\S]*?\};/);
  const templateWithoutI18n = i18nBlock
    ? template.replace(i18nBlock[0], '')
    : template;
  
  const hardcodedInCode = templateWithoutI18n.match(hardcodedTextRegex) || [];
  
  if (hardcodedInCode.length > 0) {
    errors.push(`Hardcoded Chinese text found outside i18n: ${hardcodedInCode[0]}`);
  }
  
  // Check for mixed language in UI strings
  const mixedRegex = /['"`].*[\u4e00-\u9fa5].*[a-zA-Z].*['"`]/;
  if (mixedRegex.test(template)) {
    errors.push('Mixed Chinese-English text detected (violates language purity)');
  }
  
  // Check for hardcoded brand names
  const brandKeywords = ['AI Powered', 'v1.0', 'v2.0', 'v3.0', 'v4.0'];
  for (const brand of brandKeywords) {
    if (template.includes(brand)) {
      errors.push(`Hardcoded brand name detected: "${brand}"`);
    }
  }
  
  return {
    passed: errors.length === 0,
    errors
  };
}
```

---

### Rule 4: Design Quality (Frontend)

```typescript
function validateDesignQuality(template: string, category: string): {
  passed: boolean;
  score: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  let score = 100;
  
  if (category !== 'frontend') {
    return { passed: true, score: 100, warnings };
  }
  
  // Check: Uses OKLCH colors
  const usesOKLCH = template.includes('oklch(');
  if (!usesOKLCH) {
    warnings.push('Not using OKLCH colors (hex detected)');
    score -= 15;
  }
  
  // Check: Has animations
  const hasAnimations = 
    template.includes('framer-motion') || 
    template.includes('<motion.') ||
    template.includes('transition');
    
  if (!hasAnimations) {
    warnings.push('No animations detected (static design)');
    score -= 10;
  }
  
  // Check: Responsive design
  const isResponsive = 
    template.includes('responsive') ||
    template.includes('sm:') ||
    template.includes('md:') ||
    template.includes('lg:');
    
  if (!isResponsive) {
    warnings.push('No responsive breakpoints detected');
    score -= 10;
  }
  
  // Check: Premium styling indicators
  const hasPremiumStyles = 
    template.includes('backdrop-blur') ||
    template.includes('glassmorphism') ||
    template.includes('gradient');
    
  if (!hasPremiumStyles) {
    warnings.push('Basic styling (no glassmorphism/gradients)');
    score -= 10;
  }
  
  // Check: Accessibility
  const hasAccessibility = 
    template.includes('aria-') ||
    template.includes('role=');
    
  if (!hasAccessibility) {
    warnings.push('No ARIA attributes (accessibility concern)');
    score -= 10;
  }
  
return {
    passed: score >= 70,  // Threshold for "acceptable"
    score,
    warnings
  };
}
```

---

### Rule 5: Security (Backend)

```typescript
function validateSecurity(template: string, category: string): {
  passed: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (category !== 'backend') {
    return { passed: true, errors, warnings };
  }
  
  // Check: Input validation
  const hasValidation = template.includes('z.object') || template.includes('Schema');
  if (!hasValidation) {
    errors.push('No input validation schema detected (security risk)');
  }
  
  // Check: Error handling
  const hasErrorHandling = template.includes('try {') && template.includes('catch');
  if (!hasErrorHandling) {
    errors.push('No error handling (try-catch) detected');
  }
  
  // Check: No hardcoded secrets
  const secretPatterns = [
    /password.*=.*['"`][^'"`]+['"`]/i,
    /secret.*=.*['"`][^'"`]{10,}['"`]/i,
    /apiKey.*=.*['"`][^'"`]+['"`]/i
  ];
  
  for (const pattern of secretPatterns) {
    if (pattern.test(template)) {
      errors.push('Hardcoded secret detected (must use process.env)');
    }
  }
  
  // Check: Uses environment variables
  const usesEnv = template.includes('process.env');
  if (!usesEnv) {
    warnings.push('No process.env usage (consider environment variables)');
  }
  
  // Check: Password hashing (if auth template)
  if (template.includes('password')) {
    const hasHashing = template.includes('bcrypt') || template.includes('hash');
    if (!hasHashing) {
      errors.push('Password handling without bcrypt (security critical)');
    }
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}
```

---

## 🎯 Comprehensive Validator

```typescript
async function validateTemplate(
  filePath: string,
  metadata: TemplateMetadata
): Promise<TemplateQualityCheck> {
  
  const template = await readFile(filePath, 'utf-8');
  const category = metadata.category;
  
  // Run all validations
  const metaCheck = validateMetadata(template);
  const customizationCheck = validateCustomizationPoints(template);
  const languageCheck = validateLanguagePurity(template, category);
  const designCheck = validateDesignQuality(template, category);
  const securityCheck = validateSecurity(template, category);
  
  // Aggregate results
  const allErrors = [
    ...metaCheck.errors,
    ...customizationCheck.errors,
    ...languageCheck.errors,
    ...securityCheck.errors
  ];
  
  const allWarnings = [
    ...customizationCheck.warnings,
    ...designCheck.warnings,
    ...securityCheck.warnings
  ];
  
  // Calculate overall score
  let score = 100;
  score -= allErrors.length * 10;      // -10 per error
  score -= allWarnings.length * 5;     // -5 per warning
  score = Math.max(0, score);
  
  // Design quality impacts score
  if (category === 'frontend') {
    score = Math.min(score, designCheck.score);
  }
  
  const result: TemplateQualityCheck = {
    hasMetadata: metaCheck.passed,
    hasVersion: template.includes('@version'),
    hasDescription: template.includes('@description'),
    hasCustomizationPoints: customizationCheck.passed,
    hasDependencies: template.includes('@dependencies'),
    
    codeComplexity: metadata.complexity,
    reusabilityScore: metadata.reusability,
    documentationQuality: metaCheck.passed ? 10 : 5,
    
    // Frontend-specific
    hasI18n: category === 'frontend' ? template.includes('const i18n =') : undefined,
    usesOKLCH: category === 'frontend' ? template.includes('oklch(') : undefined,
    hasAnimations: category === 'frontend' ? template.includes('motion.') : undefined,
    isResponsive: category === 'frontend' ? template.includes('responsive') : undefined,
    
    // Backend-specific
    hasInputValidation: category === 'backend' ? template.includes('z.object') : undefined,
    hasErrorHandling: category === 'backend' ? template.includes('try {') : undefined,
    noHardcodedSecrets: category === 'backend' ? securityCheck.passed : undefined,
    
    errors: allErrors,
    warnings: allWarnings,
    score,
    passed: score >= 80 && allErrors.length === 0
  };
  
  // Report
  console.log(`\n📋 Template Quality Report: ${filePath}`);
  console.log(`   Score: ${score}/100`);
  console.log(`   Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (allErrors.length > 0) {
    console.log(`   Errors:`);
    allErrors.forEach(e => console.log(`     ❌ ${e}`));
  }
  
  if (allWarnings.length > 0) {
    console.log(`   Warnings:`);
    allWarnings.forEach(w => console.log(`     ⚠️  ${w}`));
  }
  
  return result;
}
```

---

## 🚀 Batch Validation

```typescript
async function validateAllTemplates(skillPath: string): Promise<void> {
  const meta = await loadTemplateRegistry(skillPath);
  const results: TemplateQualityCheck[] = [];
  
  for (const template of meta.templates) {
    const fullPath = path.join(skillPath, 'templates', template.path);
    const result = await validateTemplate(fullPath, template);
    results.push(result);
  }
  
  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  
  console.log(`\n📊 Batch Validation Summary:`);
  console.log(`   Total: ${results.length} templates`);
  console.log(`   Passed: ${passed} ✅`);
  console.log(`   Failed: ${failed} ❌`);
  console.log(`   Average Score: ${avgScore.toFixed(1)}/100`);
  
  if (failed > 0) {
    console.log(`\n⚠️  ${failed} templates need improvement`);
    process.exit(1);
  }
}
```

---

## 📈 Quality Standards

### Minimum Passing Criteria:

```typescript
const QUALITY_STANDARDS = {
  minimumScore: 80,
  maxErrors: 0,
  maxWarnings: 3,
  
  frontend: {
    mustHaveI18n: true,
    shouldUseOKLCH: true,
    shouldHaveAnimations: true,
    mustBeResponsive: true,
    minimumDesignScore: 70
  },
  
  backend: {
    mustValidateInput: true,
    mustHandleErrors: true,
    mustNotHaveSecrets: true,
    shouldUseEnvVars: true
  }
};
```

---

## ✅ Integration Checklist

- [ ] Implement all validation functions
- [ ] Create batch validator script
- [ ] Add to CI/CD pipeline
- [ ] Validate existing templates
- [ ] Fix any failing templates
- [ ] Add pre-commit hook
- [ ] Document quality standards

---

**Quality Gate**: Only templates scoring 80+ can be used in production 🎯
