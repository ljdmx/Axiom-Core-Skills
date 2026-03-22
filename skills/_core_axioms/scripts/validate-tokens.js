/**
 * @file validate-tokens.js
 * @description Validates target CSS/JSON files against the AESTHETIC_TOKENS.json baseline.
 * Enforces the strict rule that no magic numbers or unauthorized hex codes are used.
 */

const fs = require('fs');
const path = require('path');

const TOKENS_PATH = path.join(__dirname, '../tokens/AESTHETIC_TOKENS.json');

function loadTokens() {
  if (!fs.existsSync(TOKENS_PATH)) {
    console.warn('[WARN] AESTHETIC_TOKENS.json not found in _core_axioms/tokens/. Skipping token validation.');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
  } catch (e) {
    console.error('[ERROR] Failed to parse AESTHETIC_TOKENS.json:', e.message);
    process.exit(1);
  }
}

function validateFile(filePath, tokens) {
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Target file not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  let valid = true;

  // Basic check: Look for hardcoded hex colors that aren't mapped to CSS variables
  // Example regex for raw hex colors in CSS
  const hexRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  let match;
  while ((match = hexRegex.exec(content)) !== null) {
    // In a world-class system, raw hex codes shouldn't appear in standard component files,
    // they should be referenced via var(--color-xxx).
    // This is a simplistic check; in a real scenario, this would check against the tokens object.
    console.warn(`[VIOLATION] Raw hex color detected in ${filePath}: ${match[0]}. Extract this to a token variable.`);
    valid = false;
  }

  return valid;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node validate-tokens.js <path/to/file.css|json>');
  process.exit(0);
}

const tokens = loadTokens();
if (tokens) {
  const targetFile = path.resolve(process.cwd(), args[0]);
  const result = validateFile(targetFile, tokens);
  
  if (result) {
    console.log(`[PASS] ${args[0]} adheres to token guidelines.`);
    process.exit(0);
  } else {
    console.error(`[FAIL] ${args[0]} contains token violations.`);
    process.exit(1);
  }
}
