/**
 * sandbox-init.js
 * 
 * Provides a highly reliable sandbox initialization script that acts as a mock context
 * for the skill package if the `_core_axioms` are missing or unavailable.
 * Ensures the package can run 100% independently across different environments.
 */

const fs = require('fs');
const path = require('path');

function initSandbox() {
  const sandboxDir = path.join(process.cwd(), '.axiom_evolution');
  console.log(`[Sandbox Init] Initializing isolated environment at: ${sandboxDir}`);

  if (!fs.existsSync(sandboxDir)) {
    fs.mkdirSync(sandboxDir, { recursive: true });
  }

  const soulManifestPath = path.join(sandboxDir, 'SOUL_MANIFEST.json');
  if (!fs.existsSync(soulManifestPath)) {
    fs.writeFileSync(soulManifestPath, JSON.stringify({
      version: "1.0",
      coreAesthetics: {
        theme: "dark",
        primaryColor: "#000000"
      }
    }, null, 2));
  }

  console.log('[Sandbox Init] Threejs-core sandboxing complete. Ready for independent execution.');
}

if (require.main === module) {
  initSandbox();
}

module.exports = { initSandbox };
