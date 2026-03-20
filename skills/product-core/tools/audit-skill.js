const fs = require('fs');
const path = require('path');

const MANDATES = [
  { name: 'Gate 0A Sovereignty (Missing PRODUCT_SPEC.md)', file: 'PRODUCT_SPEC.md', level: '🛑 HARD BLOCK', type: 'exists' },
  { name: 'Shared Brain Integrity (Missing PROJECT_NEXUS.json)', file: 'PROJECT_NEXUS.json', level: '🛑 HARD BLOCK', type: 'exists' },
  { name: 'SLO Definition Mandate', regex: /p99 Latency SLO/g, level: '⚠️ WARN', file: 'references/slo.md' },
  { name: 'Conventional Commits Mandate', file: 'package.json', level: '⚠️ WARN', type: 'contains', text: 'commitlint' },
  { name: 'Unified Telemetry Mandate (Rams Score)', file: 'PROJECT_NEXUS.json', level: '🛑 HARD BLOCK', type: 'contains', text: 'soul_scorecard' },
  { name: 'Gate 0C Security Audit (Red Team)', file: 'PROJECT_NEXUS.json', level: '⚠️ WARN', type: 'contains', text: 'audit_status' }
];

const rootDir = process.argv[2] || '.';
console.log(`🚀 Starting FSPC Elite Audit on: ${rootDir}`);

let totalViolations = 0;

MANDATES.forEach(mandate => {
  const filePath = path.join(rootDir, mandate.file || '');

  if (mandate.type === 'exists') {
    if (!fs.existsSync(filePath)) {
      console.log(`  ${mandate.level}: ${mandate.name}`);
      if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
    }
  } else if (mandate.type === 'contains' && fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(mandate.text)) {
      console.log(`  ${mandate.level}: ${mandate.name}`);
      if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
    }
  } else if (mandate.regex && fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!mandate.regex.test(content)) {
      console.log(`  ${mandate.level}: ${mandate.name}`);
      if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
    }
  }
});

if (totalViolations > 0) {
  console.log(`\n❌ Audit Failed: ${totalViolations} HARD BLOCK violations found.`);
  process.exit(1);
} else {
  console.log(`\n✅ Audit Passed with 0 HARD BLOCK violations.`);
}
