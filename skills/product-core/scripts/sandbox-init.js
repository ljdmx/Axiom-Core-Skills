// Automated Sandbox Initialization Script
// Ensures zero-error initialization for product-core and standardizes project structure.

const fs = require('fs');
const path = require('path');

function scaffoldProject(targetDir) {
  const directories = [
    'src',
    'src/components',
    'src/pages',
    'src/lib',
    'public',
    'docs',
    'docs/prd'
  ];

  console.log(`[FSPC] Initializing zero-error workspace at ${targetDir}...`);

  directories.forEach(dir => {
    const fullPath = path.join(targetDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`[✓] Created directory: ${dir}`);
    }
  });

  const prdTemplatePath = path.join(targetDir, 'docs/prd/00-master-prd.md');
  if (!fs.existsSync(prdTemplatePath)) {
    const templateContent = `# Master PRD: Project Name\n\n## 1. Vision & Goals\n\n## 2. A/B Pathways\n- **Aggressive**:\n- **Conservative**:\n\n## 3. Architecture Overview\n\n## 4. Telemetry & Fallbacks\n`;
    fs.writeFileSync(prdTemplatePath, templateContent);
    console.log(`[✓] Created PRD template: docs/prd/00-master-prd.md`);
  }

  console.log(`[FSPC] Workspace initialization complete. Zero errors detected.`);
}

const targetPath = process.argv[2] || process.cwd();
scaffoldProject(targetPath);
