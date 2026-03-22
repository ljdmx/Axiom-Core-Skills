/**
 * validate-nexus-schema.js
 * Validates the PROJECT_NEXUS.json against the required system specification.
 */
const fs = require('fs');

function validateNexusSchema(nexusPath) {
  if (!fs.existsSync(nexusPath)) {
    console.error(`[ERROR] PROJECT_NEXUS.json not found at ${nexusPath}`);
    process.exit(1);
  }
  try {
    const data = JSON.parse(fs.readFileSync(nexusPath, 'utf8'));
    if (!data.nexus_version || !data.project_name) {
      console.error(`[ERROR] Invalid Schema: Missing required top-level fields.`);
      process.exit(1);
    }
    console.log(`[OK] PROJECT_NEXUS.json schema validation passed.`);
  } catch (err) {
    console.error(`[ERROR] Schema parse failure: ${err.message}`);
    process.exit(1);
  }
}

validateNexusSchema(process.argv[2] || './PROJECT_NEXUS.json');
