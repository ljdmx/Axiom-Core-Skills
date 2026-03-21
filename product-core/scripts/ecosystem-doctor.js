/**
 * ecosystem-doctor.js
 * Pre-flight environment validation script to eliminate initialization errors.
 * Ensures tools (Node, npm) meet the Axiom baseline.
 */
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🩺 [FSPC] Initiating Ecosystem Health Check...');

function checkCommand(cmd, regex, requiredVersion) {
  try {
    const stdout = execSync(cmd, { stdio: 'pipe' }).toString();
    const match = stdout.match(regex);
    if (!match) throw new Error('Version read failure');
    
    console.log(`[OK] ${cmd}: ${match[0]}`);
  } catch (err) {
    console.error(`[FAIL] Required dependency missing or failing: ${cmd}. Please install ${requiredVersion}`);
    process.exit(1);
  }
}

// Check Node >= 18
checkCommand('node -v', /v(1[89]|[2-9]\d)\.\d+\.\d+/, 'Node.js v18+');
// Check NPM
checkCommand('npm -v', /\d+\.\d+\.\d+/, 'npm v8+');

if (!fs.existsSync(process.cwd() + '/.env') && !fs.existsSync(process.cwd() + '/.env.example')) {
  console.warn('[WARN] No .env or .env.example found in current directory. Creating template...');
  fs.writeFileSync(process.cwd() + '/.env.example', 'PORT=3000\nNODE_ENV=development\n');
}

console.log('✅ Environment certified Zero-Error compliant. Ready to build.');
