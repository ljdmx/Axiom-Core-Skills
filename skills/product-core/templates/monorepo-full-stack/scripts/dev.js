#!/usr/bin/env node

/**
 * Development Server Launcher
 * Starts all services concurrently with color-coded output
 */

const { spawn } = require('child_process');
const chalk = require('chalk');

const services = [
    {
        name: 'frontend',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: './apps/web',
        color: chalk.blue,
        port: 3000,
    },
    {
        name: 'backend',
        command: 'npm',
        args: ['run', 'start:dev'],
        cwd: './apps/api',
        color: chalk.green,
        port: 4000,
    },
];

const processes = [];

function log(service, message, isError = false) {
    const prefix = service.color(`[${service.name}]`);
    const color = isError ? chalk.red : service.color;
    console.log(`${prefix} ${color(message)}`);
}

function startService(service) {
    log(service, `Starting on port ${service.port}...`);

    const proc = spawn(service.command, service.args, {
        cwd: service.cwd,
        shell: true,
    });

    proc.stdout.on('data', (data) => {
        const lines = data.toString().trim().split('\n');
        lines.forEach(line => log(service, line));
    });

    proc.stderr.on('data', (data) => {
        const lines = data.toString().trim().split('\n');
        lines.forEach(line => log(service, line, true));
    });

    proc.on('close', (code) => {
        if (code !== 0) {
            log(service, `Process exited with code ${code}`, true);
            killAll();
        }
    });

    processes.push({ service, proc });
    return proc;
}

function killAll() {
    console.log(chalk.yellow('\n🛑 Stopping all services...\n'));
    processes.forEach(({ service, proc }) => {
        log(service, 'Stopping...');
        proc.kill();
    });
    process.exit(0);
}

// Handle Ctrl+C
process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);

// Main
console.log(chalk.blue.bold('\n🚀 Starting Development Servers\n'));
console.log(chalk.gray('━'.repeat(60)));
console.log();

services.forEach(startService);

console.log();
console.log(chalk.gray('━'.repeat(60)));
console.log(chalk.green('✓ All services started'));
console.log();
console.log(chalk.blue('📍 Frontend:  ') + chalk.cyan('http://localhost:3000'));
console.log(chalk.green('📍 Backend:   ') + chalk.cyan('http://localhost:4000'));
console.log(chalk.green('📍 API Docs:  ') + chalk.cyan('http://localhost:4000/api'));
console.log();
console.log(chalk.gray('Press Ctrl+C to stop all services'));
console.log(chalk.gray('━'.repeat(60)));
console.log();
