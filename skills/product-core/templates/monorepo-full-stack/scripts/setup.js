#!/usr/bin/env node

/**
 * FSPC Project Setup Script
 * Automates first-time project initialization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
    try {
        execSync(command, { stdio: 'inherit', ...options });
        return true;
    } catch (error) {
        return false;
    }
}

async function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function checkPrerequisites() {
    log('\n🔍 Checking prerequisites...', 'blue');

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1));
    if (majorVersion < 18) {
        log('❌ Node.js 18+ required. Current: ' + nodeVersion, 'red');
        process.exit(1);
    }
    log(`✓ Node.js ${nodeVersion}`, 'green');

    // Check Docker
    const hasDocker = exec('docker --version', { stdio: 'pipe' });
    if (hasDocker) {
        log('✓ Docker installed', 'green');
    } else {
        log('⚠️  Docker not found (optional for local development)', 'yellow');
    }

    // Check Git
    const hasGit = exec('git --version', { stdio: 'pipe' });
    if (hasGit) {
        log('✓ Git installed', 'green');
    } else {
        log('⚠️  Git not found (optional)', 'yellow');
    }
}

async function installDependencies() {
    log('\n📦 Installing dependencies...', 'blue');

    if (!exec('npm install')) {
        log('❌ Failed to install dependencies', 'red');
        process.exit(1);
    }

    log('✓ Dependencies installed', 'green');
}

async function setupEnvironment() {
    log('\n⚙️  Setting up environment variables...', 'blue');

    if (!fs.existsSync('.env')) {
        if (fs.existsSync('.env.example')) {
            fs.copyFileSync('.env.example', '.env');
            log('✓ Created .env file from .env.example', 'green');
            log('  Please update .env with your configuration', 'yellow');
        } else {
            log('⚠️  No .env.example found', 'yellow');
        }
    } else {
        log('✓ .env file already exists', 'green');
    }
}

async function startDockerServices() {
    log('\n🐳 Starting Docker services...', 'blue');

    const startDocker = await question('Start PostgreSQL and Redis with Docker? (y/n): ');

    if (startDocker.toLowerCase() === 'y') {
        if (!exec('docker-compose up -d')) {
            log('❌ Failed to start Docker services', 'red');
            log('  Make sure Docker is running and try again', 'yellow');
            return false;
        }

        log('✓ Docker services started', 'green');
        log('  PostgreSQL: localhost:5432', 'blue');
        log('  Redis: localhost:6379', 'blue');

        // Wait for database to be ready
        log('\n⏳ Waiting for database to be ready...', 'blue');
        await waitForDatabase();

        return true;
    } else {
        log('⚠️  Skipping Docker setup (make sure you have PostgreSQL and Redis running)', 'yellow');
        return false;
    }
}

async function waitForDatabase(maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Try to connect to PostgreSQL
            const result = exec(
                'docker-compose exec -T postgres pg_isready -U postgres',
                { stdio: 'pipe' }
            );

            if (result) {
                log('✓ Database is ready', 'green');
                return true;
            }
        } catch (error) {
            // Continue waiting
        }

        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    log('\n⚠️  Database health check timed out', 'yellow');
    return false;
}

async function runMigrations() {
    log('\n📊 Running database migrations...', 'blue');

    const runMigrations = await question('Run database migrations? (y/n): ');

    if (runMigrations.toLowerCase() === 'y') {
        if (!exec('npm run db:migrate')) {
            log('❌ Migration failed', 'red');
            return false;
        }
        log('✓ Migrations completed', 'green');
        return true;
    } else {
        log('⚠️  Skipping migrations', 'yellow');
        return false;
    }
}

async function seedDatabase() {
    log('\n🌱 Seeding database...', 'blue');

    const seedDb = await question('Seed database with initial data? (y/n): ');

    if (seedDb.toLowerCase() === 'y') {
        if (!exec('npm run db:seed')) {
            log('❌ Seeding failed', 'red');
            return false;
        }

        log('✓ Database seeded', 'green');
        log('\n📝 Default admin credentials:', 'blue');
        log('   Email: admin@example.com', 'yellow');
        log('   Password: admin123 (change immediately!)', 'yellow');
        return true;
    } else {
        log('⚠️  Skipping database seeding', 'yellow');
        return false;
    }
}

async function main() {
    log('\n🚀 FSPC Project Setup', 'blue');
    log('━'.repeat(50), 'blue');

    try {
        await checkPrerequisites();
        await installDependencies();
        await setupEnvironment();

        const dockerStarted = await startDockerServices();

        if (dockerStarted) {
            await runMigrations();
            await seedDatabase();
        }

        log('\n✅ Setup complete!', 'green');
        log('━'.repeat(50), 'green');
        log('\n📚 Next steps:', 'blue');
        log('   1. Update .env with your configuration', 'yellow');
        log('   2. Run "npm run dev" to start development servers', 'yellow');
        log('   3. Visit http://localhost:3000 (frontend)', 'yellow');
        log('   4. API docs at http://localhost:4000/api', 'yellow');
        log('\n');

    } catch (error) {
        log('\n❌ Setup failed: ' + error.message, 'red');
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
