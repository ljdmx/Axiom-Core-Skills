/**
 * foundry-invariant-tester.js
 * Invariant Fuzzing CI gate for Forge.
 */
const { execSync } = require('child_process');

function runInvariantTests() {
  console.log('[TESTING] Running Foundry Invariant Tests...');
  try {
    execSync('forge test --match-path "test/invariant/**/*.sol"', { stdio: 'inherit' });
    console.log('[TESTING] All invariants held. Proceeding to deployment gate.');
  } catch (error) {
    console.error('[TESTING] Invariant breach detected! Halt deployment.');
    process.exit(1);
  }
}

runInvariantTests();
