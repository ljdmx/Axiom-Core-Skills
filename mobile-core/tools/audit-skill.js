const fs = require('fs');
const path = require('path');

const MANDATES = [
  { name: 'Architecture Purity (pages.json required)', file: 'pages.json', level: '🛑 HARD BLOCK', type: 'exists' },
  { name: 'App Definition (manifest.json required)', file: 'manifest.json', level: '🛑 HARD BLOCK', type: 'exists' },
  { name: 'UX Principles (No implicit any in UTS)', regex: /:\s*any/g, level: '⚠️ WARN', fileType: '.uts' },
  { name: 'Modern CSS Framework (No @import in SCSS)', regex: /@import\s+['"]/g, level: '🛑 HARD BLOCK', fileType: '.scss' }
];

const targetDir = process.argv[2] || '.';
console.log(`🚀 Starting mobile-core Elite Audit on: ${targetDir}`);

let totalViolations = 0;

function getFiles(dir, ext) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && !['node_modules', '.git', 'unpackage', 'dist'].includes(item.name)) {
      files = [...files, ...getFiles(path.join(dir, item.name), ext)];
    } else if (item.isFile() && item.name.endsWith(ext)) {
      files.push(path.join(dir, item.name));
    }
  }
  return files;
}

MANDATES.forEach(mandate => {
  if (mandate.type === 'exists') {
    const filePath = path.join(targetDir, mandate.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  ${mandate.level}: ${mandate.name}`);
      if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
    }
  } else if (mandate.regex && mandate.fileType) {
    const files = getFiles(targetDir, mandate.fileType);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(mandate.regex);
      if (matches && matches.length > 0) {
        console.log(`📄 File: ${file}`);
        console.log(`  ${mandate.level}: ${mandate.name} (found ${matches.length})`);
        if (mandate.level === '🛑 HARD BLOCK') totalViolations++;
      }
    });
  }
});

if (totalViolations > 0) {
  console.log(`\n❌ Audit Failed: ${totalViolations} HARD BLOCK violations found.`);
  process.exit(1);
} else {
  console.log(`\n✅ Audit Passed with 0 HARD BLOCK violations.`);
}
