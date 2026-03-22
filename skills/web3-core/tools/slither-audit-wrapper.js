/**
 * slither-audit-wrapper.js
 * Automated security scanning using Slither for EVM contracts.
 */
const { execSync } = require('child_process');

function runSlither() {
  console.log('[SECURITY] Initiating Slither Audit Pipeline...');
  try {
    execSync('slither . --json slither-results.json', { stdio: 'inherit' });
    console.log('[SECURITY] Audit complete. Zero critical vulnerabilities found.');
  } catch (error) {
    console.error('[SECURITY] Vulnerabilities detected! Deep manual inspection required.');
    process.exit(1); // Fail the CI gate
  }
}

runSlither();
