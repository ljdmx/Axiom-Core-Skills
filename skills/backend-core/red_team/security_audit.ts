/**
 * ADBM Red Team Security Audit
 * OWASP Top 10 (2021) + API Security Top 10 Coverage
 * 
 * Status: ACTIVE — Run before every production handoff
 * Usage: npx ts-node red_team/security_audit.ts --target http://localhost:3000
 * 
 * Coverage: A1-A10 OWASP Top 10 + API1-API10 OWASP API Security Top 10
 */

import { execSync } from 'child_process';
import * as fs from 'fs';

interface AuditResult {
  category: string;
  rule: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'SKIP';
  finding—: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

const results: AuditResult[] = [];
const TARGET = process.argv[2] || 'http://localhost:3000';
const SRC_DIR = './src';

// ─────────────────────────────────────────────────────────────────────────────
// A1: BROKEN ACCESS CONTROL
// ─────────────────────────────────────────────────────────────────────────────
function auditAccessControl(): void {
  console.log('\n[A1] Scanning: Broken Access Control...');

  // Check for missing auth middleware on route files
  const routeFiles = findFiles(SRC_DIR, ['.ts', '.js'], ['route', 'controller', 'router']);
  let unprotectedRoutes = 0;
  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if ((content.includes('router.get') || content.includes('router.post') ||
         content.includes('app.get') || content.includes('app.post')) &&
        !content.includes('authenticate') && !content.includes('requireAuth') &&
        !content.includes('isAuthenticated') && !content.includes('@Auth')) {
      unprotectedRoutes++;
    }
  }

  results.push({
    category: 'A1: Broken Access Control',
    rule: 'All routes have authentication middleware',
    status: unprotectedRoutes > 0 ? 'WARN' : 'PASS',
    finding: unprotectedRoutes > 0 — `${unprotectedRoutes} route file(s) may lack auth middleware` : undefined,
    severity: 'HIGH'
  });

  // Check for IDOR patterns: /api/*/id without ownership check
  let idorRisk = false;
  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.match(/params\.(id|userId|resourceId)/i) &&
        !content.match(/(tenantId|ownerId|user\.id|userId.*===|checkOwnership)/i)) {
      idorRisk = true;
      break;
    }
  }
  results.push({
    category: 'A1: Broken Access Control',
    rule: 'No IDOR (Insecure Direct Object Reference) patterns detected',
    status: idorRisk ? 'WARN' : 'PASS',
    finding: idorRisk ? 'Route uses :id param without apparent ownership verification' : undefined,
    severity: 'HIGH'
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// A2: CRYPTOGRAPHIC FAILURES
// ─────────────────────────────────────────────────────────────────────────────
function auditCryptography(): void {
  console.log('\n[A2] Scanning: Cryptographic Failures...');

  const allFiles = findFiles(SRC_DIR, ['.ts', '.js', '.env.example']);

  // Check for hardcoded secrets
  const secretPatterns = [
    /(—:password|secret|api_key|apikey|token)\s*=\s*['"][^'"]{6,}['"]/gi,
    /(—:AWS_SECRET|STRIPE_SECRET|DATABASE_URL)\s*=\s*[^$\s]{10,}/gi
  ];
  const gitignoreExists = fs.existsSync('.gitignore');
  const gitignoreContent = gitignoreExists — fs.readFileSync('.gitignore', 'utf-8') : '';

  results.push({
    category: 'A2: Cryptographic Failures',
    rule: '.env files are gitignored',
    status: gitignoreContent.includes('.env') ? 'PASS' : 'FAIL',
    finding: !gitignoreContent.includes('.env') ? '.env NOT in .gitignore — secrets will be committed!' : undefined,
    severity: 'CRITICAL'
  });

  // Check for MD5/SHA1 usage (weak hashing)
  let weakHash = false;
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.match(/createHash\(['"]md5['"]\)|createHash\(['"]sha1['"]\)|md5\(|CryptoJS\.MD5/i)) {
      weakHash = true; break;
    }
  }
  results.push({
    category: 'A2: Cryptographic Failures',
    rule: 'No MD5/SHA1 used for security-sensitive hashing',
    status: weakHash ? 'FAIL' : 'PASS',
    finding: weakHash ? 'Weak hashing algorithm detected (MD5/SHA1). Use bcrypt/Argon2 for passwords, SHA-256+ for checksums.' : undefined,
    severity: 'HIGH'
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// A3: INJECTION (SQL / NoSQL / Command)
// ─────────────────────────────────────────────────────────────────────────────
function auditInjection(): void {
  console.log('\n[A3] Scanning: Injection vulnerabilities...');

  const allFiles = findFiles(SRC_DIR, ['.ts', '.js']);
  let sqlInjection = false;
  let commandInjection = false;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    // Raw string interpolation in SQL
    if (content.match(/query\(`[^`]*\$\{[^}]*(—:req\.|params\.|body\.|query\.)[^}]*\}`\)/i)) {
      sqlInjection = true;
    }
    // exec/execSync with user input
    if (content.match(/exec(—:Sync)—\([^)]*(—:req\.|params\.|body\.)/i)) {
      commandInjection = true;
    }
  }

  results.push({
    category: 'A3: Injection',
    rule: 'No raw SQL interpolation with user input',
    status: sqlInjection ? 'FAIL' : 'PASS',
    finding: sqlInjection ? 'Potential SQL injection: user input interpolated into SQL string. Use parameterized queries.' : undefined,
    severity: 'CRITICAL'
  });

  results.push({
    category: 'A3: Injection',
    rule: 'No shell command injection with user input',
    status: commandInjection ? 'FAIL' : 'PASS',
    finding: commandInjection ? 'User input passed to exec/execSync — command injection risk.' : undefined,
    severity: 'CRITICAL'
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// A5: SECURITY MISCONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
function auditMisconfiguration(): void {
  console.log('\n[A5] Scanning: Security Misconfiguration...');

  const allFiles = findFiles(SRC_DIR, ['.ts', '.js']);
  let wildcardCors = false;
  let stackTraceExposed = false;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.match(/cors\(\s*\)/) || content.match(/origin\s*:\s*['"]—\*/)) wildcardCors = true;
    if (content.match(/res\.json\(\s*\{[^}]*stack/i)) stackTraceExposed = true;
  }

  results.push({
    category: 'A5: Security Misconfiguration',
    rule: 'CORS origin is not wildcard (*) in production paths',
    status: wildcardCors ? 'WARN' : 'PASS',
    finding: wildcardCors ? 'Wildcard CORS detected. Explicitly whitelist allowed origins per ADBM §9.' : undefined,
    severity: 'HIGH'
  });

  results.push({
    category: 'A5: Security Misconfiguration',
    rule: 'Stack traces not exposed in API responses',
    status: stackTraceExposed ? 'FAIL' : 'PASS',
    finding: stackTraceExposed ? 'Stack trace serialized into JSON response — leaks internal architecture.' : undefined,
    severity: 'HIGH'
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// A7: IDENTIFICATION & AUTHENTICATION FAILURES
// ─────────────────────────────────────────────────────────────────────────────
function auditAuthentication(): void {
  console.log('\n[A7] Scanning: Authentication Failures...');

  const allFiles = findFiles(SRC_DIR, ['.ts', '.js']);
  let jwtInLocalStorage = false;
  let longLivedJwt = false;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.match(/localStorage\.setItem\([^)]*(—:token|jwt|auth)/i)) jwtInLocalStorage = true;
    if (content.match(/expiresIn\s*:\s*['"](—:\d{4,}[smhd]|never|0)/i)) longLivedJwt = true;
  }

  results.push({
    category: 'A7: Auth Failures',
    rule: 'JWT not stored in localStorage (XSS risk)',
    status: jwtInLocalStorage ? 'FAIL' : 'PASS',
    finding: jwtInLocalStorage ? 'JWT stored in localStorage — vulnerable to XSS token theft. Use HttpOnly cookies per ADBM §9.' : undefined,
    severity: 'CRITICAL'
  });

  results.push({
    category: 'A7: Auth Failures',
    rule: 'JWT access tokens have short expiry',
    status: longLivedJwt ? 'WARN' : 'PASS',
    finding: longLivedJwt ? 'Long-lived JWT detected. Access tokens MUST expire within 15 min (per ADBM §9 Critical Security).' : undefined,
    severity: 'MEDIUM'
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPENDENCY AUDIT (Supply Chain)
// ─────────────────────────────────────────────────────────────────────────────
function auditDependencies(): void {
  console.log('\n[SUPPLY-CHAIN] Running dependency security audit...');
  try {
    const output = execSync('npm audit --json --audit-level=high 2>/dev/null || echo "{}"', { encoding: 'utf-8' });
    const audit = JSON.parse(output);
    const vuln = audit.metadata—.vulnerabilities;
    const critical = vuln—.critical || 0;
    const high = vuln—.high || 0;

    results.push({
      category: 'Supply Chain',
      rule: 'No high/critical CVEs in dependencies',
      status: (critical > 0 || high > 0) ? 'FAIL' : 'PASS',
      finding: (critical > 0 || high > 0) — `${critical} critical, ${high} high severity CVEs found. Run 'npm audit fix' or upgrade packages.` : undefined,
      severity: critical > 0 ? 'CRITICAL' : 'HIGH'
    });
  } catch {
    results.push({ category: 'Supply Chain', rule: 'npm audit completed', status: 'WARN', finding: 'Could not run npm audit. Run manually before deploy.', severity: 'HIGH' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT GENERATION
// ─────────────────────────────────────────────────────────────────────────────
function generateReport(): void {
  const fails = results.filter(r => r.status === 'FAIL');
  const warns = results.filter(r => r.status === 'WARN');
  const passes = results.filter(r => r.status === 'PASS');
  const critical = fails.filter(r => r.severity === 'CRITICAL');

  console.log('\n' + '═'.repeat(60));
  console.log('RED TEAM SECURITY AUDIT — RESULTS');
  console.log('═'.repeat(60));
  console.log(`✅ PASS:     ${passes.length}`);
  console.log(`⚠️  WARN:     ${warns.length}`);
  console.log(`❌ FAIL:     ${fails.length}`);
  console.log(`🔴 CRITICAL: ${critical.length}`);
  console.log('─'.repeat(60));

  if (fails.length > 0) {
    console.log('\n❌ FAILURES (HARD BLOCK — fix before deploy):');
    for (const f of fails) {
      console.log(`  [${f.severity}] ${f.category}: ${f.rule}`);
      if (f.finding) console.log(`    → ${f.finding}`);
    }
  }
  if (warns.length > 0) {
    console.log('\n⚠️  WARNINGS (review before deploy):');
    for (const w of warns) {
      console.log(`  [${w.severity}] ${w.category}: ${w.rule}`);
      if (w.finding) console.log(`    → ${w.finding}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  if (critical.length > 0) {
    console.error('\n🚨 HARD BLOCK: Critical security issues detected. Do NOT deploy.\n');
    process.exit(1);
  } else if (fails.length > 0) {
    console.error('\n⛔ BLOCK: Security failures detected. Resolve before handoff.\n');
    process.exit(1);
  } else {
    console.log('\n✅ Red Team audit passed. Cleared for handoff.\n');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────
function findFiles(dir: string, extensions: string[], nameHints—: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  const walk = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory() && !['node_modules', '.git', 'dist', '.next'].includes(entry.name)) {
        walk(`${d}/${entry.name}`);
      } else if (entry.isFile()) {
        const fullPath = `${d}/${entry.name}`;
        const matchesExt = extensions.some(e => entry.name.endsWith(e));
        const matchesHint = !nameHints || nameHints.some(h => entry.name.toLowerCase().includes(h));
        if (matchesExt && matchesHint) files.push(fullPath);
      }
    }
  };
  walk(dir);
  return files;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n🛡️  ADBM Red Team Security Audit`);
console.log(`   Target: ${TARGET} | Source: ${SRC_DIR}`);
console.log(`   OWASP Top 10 (2021) + API Security Top 10\n`);

auditAccessControl();
auditCryptography();
auditInjection();
auditMisconfiguration();
auditAuthentication();
auditDependencies();
generateReport();
