/**
 * Product-Core: Automated Workspace Audit
 * Pattern: Pipeline Step 1 (Parse & Inventory)
 * 
 * Scans the current directory for tech stacks, entry points, and module distribution.
 */

const fs = require('fs');
const path = require('path');

const IGNORE = ['node_modules', '.git', '.next', 'dist', 'build', '.gemini'];

function scan(dir, depth = 0) {
    if (depth > 3) return [];
    let inventory = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (IGNORE.includes(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            inventory.push({ type: 'DIR', name: entry.name, path: fullPath });
            inventory = inventory.concat(scan(fullPath, depth + 1));
        } else {
            inventory.push({ type: 'FILE', name: entry.name, path: fullPath });
        }
    }
    return inventory;
}

function detectTechStack(inventory) {
    const files = inventory.map(i => i.name);
    const stacks = [];
    if (files.includes('package.json')) stacks.push('Node.js / NPM');
    if (files.includes('requirements.txt') || files.includes('main.py')) stacks.push('Python');
    if (files.includes('tsconfig.json')) stacks.push('TypeScript');
    if (files.includes('hardhat.config.ts') || files.includes('foundry.toml')) stacks.push('Web3 (EVM)');
    if (files.includes('App.vue') || files.includes('pages.json')) stacks.push('Mobile (uni-app)');
    return stacks;
}

console.log('🛡️  Axiom OS: Automated Workspace Audit Starting...');
const inventory = scan('.');
const tech = detectTechStack(inventory);

console.log('\n[INVENTORY SUMMARY]');
console.log(`- Total Files/Dirs: ${inventory.length}`);
console.log(`- Detected Stacks:  ${tech.join(', ') || 'Unknown'}`);

console.log('\n[CRITICAL ENTRY POINTS]');
inventory.filter(i => /main\.|app\.|index\./i.test(i.name)).forEach(i => {
    console.log(`  → ${i.path}`);
});

console.log('\n✅ Audit Complete. Pipe results to PROJECT_NEXUS.json.');
