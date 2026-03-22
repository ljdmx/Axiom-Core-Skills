/**
 * schema-summarizer.js
 * Mini CLI tool to generate a lightweight projection of OpenAPI schemas.
 * Reduces 10,000+ line YAML files to <500 tokens for efficient agent context loading.
 * Usage: node schema-summarizer.js <path/to/openapi.yaml>
 */

const fs = require('fs');
const readline = require('readline');

async function summarizeSchema(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log(`[SCHEMA SUMMARY: ${filePath}]`);
  console.log(`--- ROUTES ---`);
  
  let currentPath = '';
  for await (const line of rl) {
    const trimmed = line.trim();
    if (line.startsWith('  /') && !line.startsWith('    ')) {
      currentPath = trimmed.replace(':', '');
    } else if (line.startsWith('    get:') || line.startsWith('    post:') || 
               line.startsWith('    put:') || line.startsWith('    delete:')) {
      const method = trimmed.replace(':', '').toUpperCase();
      console.log(`${method} ${currentPath}`);
    }
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  summarizeSchema(args[0]).catch(console.error);
} else {
  console.log("Usage: node schema-summarizer.js <openapi.yaml>");
}
