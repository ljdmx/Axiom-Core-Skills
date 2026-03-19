const fs = require('fs');
const path = require('path');

const MANDATES = [
  { name: 'Security Sovereignty (No password/token in logs)', regex: /console\.log\(.*(password|token|secret).*\)/gi, level: '🛑 HARD BLOCK' },
  { name: 'Entity Integrity (Missing UUID/Snowflake)', regex: /model\s+\w+\s+\{([^}]*)\}/g, level: '⚠️ WARN', filter: (m) => !m.includes('id') },
  { name: 'Audit Coverage (Missing updated_at/created_at)', regex: /model\s+\w+\s+\{([^}]*)\}/g, level: '⚠️ WARN', filter: (m) => !m.includes('updated_at') },
  { name: 'API Versioning Gate', regex: /@\w+\(['"]\/(?!api\/v\d)/g, level: '🛑 HARD BLOCK' }
];

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = [];
  
  MANDATES.forEach(mandate => {
    const matches = content.match(mandate.regex);
    if (matches) {
      const filtered = mandate.filter ? matches.filter(mandate.filter) : matches;
      if (filtered.length > 0) {
        results.push({ ...mandate, count: filtered.length });
      }
    }
  });
  
  return results;
}

const targetDir = process.argv[2] || './src';
console.log(`🚀 Starting ADBM Elite Audit on: ${targetDir}`);

function getFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && !['node_modules', '.git', 'dist'].includes(item.name)) {
      files = [...files, ...getFiles(path.join(dir, item.name))];
    } else if (item.isFile() && /\.(js|ts|py|go|prisma)$/.test(item.name)) {
      files.push(path.join(dir, item.name));
    }
  }
  return files;
}

const files = getFiles(targetDir);
let totalViolations = 0;

files.forEach(file => {
  const violations = auditFile(file);
  if (violations.length > 0) {
    console.log(`\n📄 File: ${file}`);
    violations.forEach(v => {
      console.log(`  ${v.level}: ${v.name} (found ${v.count})`);
      if (v.level === '🛑 HARD BLOCK') totalViolations++;
    });
  }
});

if (totalViolations > 0) {
  console.log(`\n❌ Audit Failed: ${totalViolations} HARD BLOCK violations found.`);
  process.exit(1);
} else {
  console.log(`\n✅ Audit Passed with 0 HARD BLOCK violations.`);
}
