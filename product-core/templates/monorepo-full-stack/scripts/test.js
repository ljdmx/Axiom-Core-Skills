#!/usr/bin/env node

/**
 * Testing Script
 * Runs unit tests, integration tests, and E2E tests
 */

const { spawn } = require('child_process');
const chalk = require('chalk');

const args = process.argv.slice(2);
const testType = args[0] || 'all';

const testSuites = {
    unit: [
        {
            name: 'Backend Unit Tests',
            command: 'npm',
            args: ['run', 'test:unit'],
            cwd: './apps/api',
        },
        {
            name: 'Frontend Unit Tests',
            command: 'npm',
            args: ['run', 'test'],
            cwd: './apps/web',
        },
    ],

    integration: [
        {
            name: 'API Integration Tests',
            command: 'npm',
            args: ['run', 'test:integration'],
            cwd: './apps/api',
        },
    ],

    e2e: [
        {
            name: 'E2E Tests',
            command: 'npm',
            args: ['run', 'test:e2e'],
            cwd: './apps/web',
        },
    ],
};

async function runTest(test) {
    return new Promise((resolve, reject) => {
        console.log(chalk.blue(`\n━━━ ${test.name} ━━━\n`));

        const proc = spawn(test.command, test.args, {
            cwd: test.cwd,
            shell: true,
            stdio: 'inherit',
        });

        proc.on('close', (code) => {
            if (code === 0) {
                console.log(chalk.green(`\n✓ ${test.name} passed\n`));
                resolve();
            } else {
                console.log(chalk.red(`\n✗ ${test.name} failed\n`));
                reject(new Error(`${test.name} failed with code ${code}`));
            }
        });
    });
}

async function main() {
    console.log(chalk.blue.bold('\n🧪 Running Tests\n'));
    console.log(chalk.gray('━'.repeat(60)));

    let suitesToRun = [];

    if (testType === 'all') {
        suitesToRun = [...testSuites.unit, ...testSuites.integration, ...testSuites.e2e];
    } else if (testSuites[testType]) {
        suitesToRun = testSuites[testType];
    } else {
        console.log(chalk.red(`Unknown test type: ${testType}`));
        console.log(chalk.yellow('Usage: npm run test [unit|integration|e2e|all]'));
        process.exit(1);
    }

    const startTime = Date.now();
    let failed = 0;

    for (const test of suitesToRun) {
        try {
            await runTest(test);
        } catch (error) {
            failed++;
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(chalk.gray('━'.repeat(60)));

    if (failed === 0) {
        console.log(chalk.green.bold(`\n✅ All tests passed (${duration}s)\n`));
        process.exit(0);
    } else {
        console.log(chalk.red.bold(`\n❌ ${failed}/${suitesToRun.length} test suites failed (${duration}s)\n`));
        process.exit(1);
    }
}

main();
