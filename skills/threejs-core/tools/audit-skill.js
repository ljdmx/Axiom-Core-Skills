const fs = require('fs');
const path = require('path');

const MANDATES = [
  { name: 'Zero-AI-Aesthetic (No href="#")', regex: /href="#"/g, level: '🛑 HARD BLOCK' },
  { name: 'Clean Production (No console.log)', regex: /console\.log\(/g, level: '⚠️ WARN' },
  { name: 'Design Token Integrity (No hardcoded hex)', regex: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g, level: '🛑 HARD BLOCK' },
  { name: 'Design Token Integrity (No hardcoded px)', regex: /\d+px/g, level: '⚠️ WARN' },
  { name: 'Language Purity (i18n mandate)', regex: />[A-Z\u4e00-\u9fa5][^<]+</g, level: '⚠️ WARN', filter: (match) => !match.includes('{') }
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
console.log(`🚀 Starting DDFM Elite Audit on: ${targetDir}`);

// Recursive file search (simplified)
function getFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && !['node_modules', '.git', 'dist'].includes(item.name)) {
      files = [...files, ...getFiles(path.join(dir, item.name))];
    } else if (item.isFile() && /\.(js|jsx|ts|tsx|vue|css|scss)$/.test(item.name)) {
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

// Zero-Error Compilation Guarantee (AST level check)
console.log(`\n🔍 Running AST-level Zero-Error Compilation Check...`);
try {
  const { execSync } = require('child_process');
  let cmd = '';
  if (fs.existsSync(path.join(targetDir, 'tsconfig.json'))) {
      if (fs.existsSync(path.join(targetDir, 'vite.config.ts')) && contentHasVue(targetDir)) {
          cmd = 'npx vue-tsc --noEmit';
      } else {
          cmd = 'npx tsc --noEmit';
      }
      console.log(`Executing: ${cmd}`);
      execSync(cmd, { cwd: targetDir, stdio: 'pipe' });
      console.log(`✅ AST Compilation Check Passed. Zero errors detected.`);
  } else {
      console.log(`ℹ️ No tsconfig.json found in ${targetDir}. Skipping AST compilation check.`);
  }
} catch (e) {
  console.error(`\n❌ AST Compilation Check Failed: Syntactic or Type errors detected.`);
  console.error(e.stdout ? e.stdout.toString() : e.message);
  console.error(`AI MUST loop and resolve these syntax errors before proceeding.`);
  process.exit(1);
}

function contentHasVue(dir) {
    const checkFiles = fs.readdirSync(dir);
    return checkFiles.some(f => f.endsWith('.vue'));
}
