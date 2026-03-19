const fs = require('fs');
const path = require('path');

const MANDATES = [
  { name: 'Hardhat/Foundry Init', regex: /(hardhat\.config|foundry\.toml)/, level: '🛑 HARD BLOCK', type: 'dir_contains' },
  { name: 'Reentrancy Protection', regex: /function\s+\w+.*external.*\{([^}]*(?!nonReentrant)[^}]*)\.call\{value/g, level: '🛑 HARD BLOCK', fileType: '.sol', desc: 'External call with value must use nonReentrant' },
  { name: 'Console.log in Prod', regex: /console\.log\(/g, level: '⚠️ WARN', fileType: '.sol' }
];

const targetDir = process.argv[2] || '.';
console.log(`🚀 Starting web3-core Elite Audit on: ${targetDir}`);

let totalViolations = 0;

function getFiles(dir, ext) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && !['node_modules', '.git', 'out', 'cache', 'artifacts'].includes(item.name)) {
      files = [...files, ...getFiles(path.join(dir, item.name), ext)];
    } else if (item.isFile() && item.name.endsWith(ext)) {
      files.push(path.join(dir, item.name));
    }
  }
  return files;
}

MANDATES.forEach(mandate => {
  if (mandate.type === 'dir_contains') {
    const items = fs.readdirSync(targetDir);
    const found = items.some(item => mandate.regex.test(item));
    if (!found) {
      console.log(`  ${mandate.level}: ${mandate.name} (Neither Hardhat nor Foundry config found)`);
      if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
    }
  } else if (mandate.regex && mandate.fileType) {
    const files = getFiles(targetDir, mandate.fileType);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(mandate.regex);
      // Basic check, accurate parsing requires an AST parser like Slither,
      // this is a baseline heuristic lock for the AI
      if (matches && matches.length > 0) {
        console.log(`📄 File: ${file}`);
        console.log(`  ${mandate.level}: ${mandate.name} - ${mandate.desc || ''} (found ${matches.length})`);
        if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
      }
    });
  }
});

if (totalViolations > 0) {
  console.log(`\n❌ Audit Failed: ${totalViolations} HARD BLOCK violations found. Please run Slither for deep analysis.`);
  process.exit(1);
} else {
  console.log(`\n✅ Audit Passed with 0 HARD BLOCK violations.`);
}
