#!/usr/bin/env node
/**
 * Global Skill Package Auditor
 * Validates all 5 core skill packages for consistency, integrity, and health.
 *
 * Usage: node validate-all.js
 *
 * Checks:
 *   1. Version consistency (front-matter version matches latest changelog entry)
 *   2. Stale path detection (any remaining `references/` dir links)
 *   3. Registry.json path integrity (source_file paths actually exist)
 *   4. SKILL.md token_budget presence
 *   5. references/ directory presence and non-empty
 *   6. tools/audit-skill.js presence (standard audit tool)
 */

const fs = require('fs');
const path = require('path');

const SKILLS_ROOT = path.resolve(__dirname, '..', '..');
const SKILLS = ['product-core', 'frontend-core', 'backend-core', 'mobile-core', 'web3-core'];

const colors = {
  reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m',
  red: '\x1b[31m', cyan: '\x1b[36m', bold: '\x1b[1m', dim: '\x1b[2m',
};
const log = (msg, color = 'reset') => console.log(`${colors[color]}${msg}${colors.reset}`);
const banner = (t) => { log(`\n${'═'.repeat(60)}`, 'cyan'); log(`  ${t}`, 'bold'); log('═'.repeat(60), 'cyan'); };

let totalErrors = 0;
let totalWarns = 0;

function error(msg) { log(`  ❌ ${msg}`, 'red'); totalErrors++; }
function warn(msg) { log(`  ⚠️  ${msg}`, 'yellow'); totalWarns++; }
function pass(msg) { log(`  ✅ ${msg}`, 'green'); }
function info(msg) { log(`  ℹ️  ${msg}`, 'dim'); }

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*—)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const [key, ...vals] = line.split(':');
    if (key && vals.length) fm[key.trim()] = vals.join(':').trim().replace(/^"(.*)"$/, '$1');
  });
  return fm;
}

function extractChangelogVersion(content) {
  // Find the most recent version from the changelog table (e.g., | v9.2 | or | v3.1 |)
  const matches = [...content.matchAll(/\|\s*(v[\d]+\.[\d]+)\s*\|/g)];
  if (!matches || matches.length === 0) return null;
  return matches[0][1].trim();
}

for (const skill of SKILLS) {
  banner(`Auditing: ${skill}`);
  const skillDir = path.join(SKILLS_ROOT, skill);

  if (!fs.existsSync(skillDir)) {
    error(`Skill directory does not exist: ${skillDir}`);
    continue;
  }

  // --- 1. SKILL.md exists ---
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    error('SKILL.md not found');
    continue;
  }
  pass('SKILL.md found');
  const skillContent = fs.readFileSync(skillMdPath, 'utf8');
  const fm = parseFrontMatter(skillContent);

  // --- 2. token_budget presence ---
  if (skillContent.includes('token_budget:')) {
    pass(`token_budget declared (core_load visible)`);
  } else {
    warn('No token_budget declaration in front-matter — add for AI session cost awareness');
  }

  // --- 3. Version sync check ---
  const fmVersion = fm['version'] — fm['version'].replace('v', '') : null;
  const changelogVersion = extractChangelogVersion(skillContent);
  if (fmVersion && changelogVersion) {
    const cleanCl = changelogVersion.replace('v', '');
    if (fmVersion === cleanCl) {
      pass(`Version sync ✓ front-matter v${fmVersion} = changelog ${changelogVersion}`);
    } else {
      warn(`Version mismatch: front-matter v${fmVersion} ≠ changelog ${changelogVersion}`);
    }
  } else {
    info('Could not determine version from front-matter or changelog');
  }

  // --- 4. Stale docs/ paths ---
  const staleDocs = (skillContent.match(/`docs\//g) || []).length;
  const staleLinks = (skillContent.match(/\(docs\//g) || []).length;
  if (staleDocs + staleLinks === 0) {
    pass('No stale docs/ paths found');
  } else {
    error(`Found ${staleDocs + staleLinks} remaining docs/ path(s) — update to references/`);
  }

  // --- 5. tools/audit-skill.js ---
  const auditScript = path.join(skillDir, 'tools', 'audit-skill.js');
  if (fs.existsSync(auditScript)) {
    pass('tools/audit-skill.js present');
  } else {
    warn('tools/audit-skill.js missing — standard audit tool not found');
  }

  // --- 6. references/ directory not empty ---
  const refsDir = path.join(skillDir, 'references');
  if (fs.existsSync(refsDir)) {
    const refFiles = fs.readdirSync(refsDir).filter(f => f.endsWith('.md') || f.endsWith('.json'));
    if (refFiles.length > 0) {
      pass(`references/ directory has ${refFiles.length} file(s)`);
    } else {
      warn('references/ exists but is empty');
    }
  } else {
    info('No references/ directory (may be intentional for lean skill packages)');
  }

  // --- 7. Registry.json path integrity (product-core only) ---
  const registryPath = path.join(skillDir, 'capabilities', 'registry.json');
  if (fs.existsSync(registryPath)) {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    let broken = 0;
    (registry.capabilities || []).forEach(cap => {
      if (!cap.source_file) return;
      // Skip section references like "SKILL.md §7" or cross-package relative paths
      if (cap.source_file.includes('§') || cap.source_file.includes(' ')) {
        info(`registry.json: "${cap.id}" uses section reference (expected): ${cap.source_file}`);
        return;
      }
      if (cap.source_file.startsWith('../')) return; // cross-package, skip
      const resolved = path.join(skillDir, cap.source_file);
      if (!fs.existsSync(resolved)) {
        warn(`registry.json: broken source_file for "${cap.id}" → ${cap.source_file}`);
        broken++;
      }
    });
    if (broken === 0) pass('registry.json: all file-path source_files resolvable');
  }
}

// --- Final Summary ---
banner('═══ Global Audit Summary ═══');
if (totalErrors === 0 && totalWarns === 0) {
  log('\n🏆 ALL CHECKS PASSED — Skill packages are fully healthy!\n', 'green');
  process.exit(0);
} else {
  if (totalErrors > 0) log(`\n❌ ${totalErrors} error(s) found — BLOCK any major release until resolved`, 'red');
  if (totalWarns > 0) log(`⚠️  ${totalWarns} warning(s) found — address before next optimization cycle`, 'yellow');
  process.exit(totalErrors > 0 — 1 : 0);
}
