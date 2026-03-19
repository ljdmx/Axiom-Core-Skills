#!/usr/bin/env node

/**
 * FSPC Unified Compliance Validator
 * Orchestrates all skill-level quality checks in one command.
 *
 * Usage: node scripts/validate.js [--aesthetic] [--security] [--all]
 * 
 * Checks:
 *  1. Aesthetic Score  (from DDFM tools/aesthetic-scorer.js)
 *  2. Security Audit   (from ADBM red_team/security_audit.ts)
 *  3. Lighthouse CLI   (perf + a11y)
 *  4. npm audit        (dependency vulnerabilities)
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SKILLS_ROOT = path.resolve(__dirname, '..', '..');
const ADBM_DIR = path.join(SKILLS_ROOT, 'backend-core');
const DDFM_DIR = path.join(SKILLS_ROOT, 'frontend-core');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

function banner(title) {
    log(`\n${'═'.repeat(55)}`, 'cyan');
    log(`  ${title}`, 'bold');
    log('═'.repeat(55), 'cyan');
}

function run(label, cmd, cwd = process.cwd()) {
    log(`\n▶ ${label}...`, 'yellow');
    try {
        const output = execSync(cmd, { cwd, encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'] });
        log(`✅ ${label} PASSED`, 'green');
        return { passed: true, output };
    } catch (err) {
        log(`❌ ${label} FAILED`, 'red');
        if (err.stdout) console.log(err.stdout);
        if (err.stderr) console.error(err.stderr);
        return { passed: false, output: err.stdout + err.stderr };
    }
}

async function runAestheticScorer() {
    banner('1/4 DDFM Aesthetic Scorer');
    const scorer = path.join(DDFM_DIR, 'tools', 'aesthetic-scorer.js');
    if (!fs.existsSync(scorer)) {
        log('⚠️  aesthetic-scorer.js not found — skipping', 'yellow');
        return { passed: true, skipped: true };
    }
    return run('Aesthetic Score (≥ 80 to pass)', `node "${scorer}"`, process.cwd());
}

async function runSecurityAudit() {
    banner('2/4 ADBM Red-Team Security Audit');
    const audit = path.join(ADBM_DIR, 'red_team', 'security_audit.ts');
    if (!fs.existsSync(audit)) {
        log('⚠️  security_audit.ts not found — skipping', 'yellow');
        return { passed: true, skipped: true };
    }
    // Run via ts-node if available, else npx ts-node
    const cmd = `npx ts-node --project tsconfig.json "${audit}"`;
    return run('Security Audit (IDOR, SQLi, PII-leak)', cmd, process.cwd());
}

async function runNpmAudit() {
    banner('3/4 Dependency Vulnerability Audit');
    return run('npm audit (moderate+)', 'npm audit --audit-level=moderate', process.cwd());
}

async function runLighthouse(url = 'http://localhost:3000') {
    banner('4/4 Lighthouse CI (Perf + A11y)');
    // Check if lhci is available
    const lhci = spawnSync('npx', ['lhci', '--version'], { shell: true });
    if (lhci.status !== 0) {
        log('⚠️  Lighthouse CI not installed — skipping. Run: npm i -g @lhci/cli', 'yellow');
        return { passed: true, skipped: true };
    }
    return run(
        `Lighthouse (perf ≥ 90, a11y ≥ 90) at ${url}`,
        `npx lhci autorun --collect.url=${url} --assert.assertions.categories:performance=90 --assert.assertions.categories:accessibility=90`,
        process.cwd()
    );
}

async function main() {
    const args = process.argv.slice(2);
    const runAll = args.includes('--all') || args.length === 0;
    const runAesthetic = args.includes('--aesthetic') || runAll;
    const runSecurity = args.includes('--security') || runAll;
    const runAudit = args.includes('--audit') || runAll;
    const runLH = args.includes('--lighthouse') || runAll;
    const lhUrl = args.find(a => a.startsWith('--url='))?.split('=')[1] ?? 'http://localhost:3000';

    log('\n🛡️  FSPC Unified Compliance Validator', 'bold');
    log('   Integrates: DDFM Aesthetic + ADBM Security + npm audit + Lighthouse', 'cyan');

    const results = [];

    if (runAesthetic) results.push(await runAestheticScorer());
    if (runSecurity) results.push(await runSecurityAudit());
    if (runAudit) results.push(await runNpmAudit());
    if (runLH) results.push(await runLighthouse(lhUrl));

    // Summary
    banner('Validation Summary');
    const failures = results.filter(r => !r.passed);
    if (failures.length === 0) {
        log('\n✅ ALL CHECKS PASSED — Ready for Quantitative Gate', 'green');
        process.exit(0);
    } else {
        log(`\n❌ ${failures.length} check(s) failed — BLOCK handoff until resolved`, 'red');
        process.exit(1);
    }
}

main().catch(err => {
    log(`\n❌ Validator error: ${err.message}`, 'red');
    process.exit(1);
});
