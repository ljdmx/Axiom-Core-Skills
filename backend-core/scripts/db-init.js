#!/usr/bin/env node

/**
 * Database Initialization Toolkit
 * 
 * Synchronizes database schema and performs data seeding.
 * 
 * Usage: node scripts/db-init.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
    try {
        log(`  ▶ ${command}`, 'cyan');
        execSync(command, {
            cwd,
            stdio: 'inherit'
        });
        return true;
    } catch (error) {
        log(`  ❌ Command failed: ${command}`, 'red');
        return false;
    }
}

async function main() {
    log('\n🗄️  Database Initialization Toolkit', 'cyan');
    log('━'.repeat(60), 'cyan');

    // Check .env file
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        log('\n❌ .env file not found!', 'red');
        log('   Please run: node scripts/smart-config.js first', 'yellow');
        process.exit(1);
    }

    // Load environment variables
    require('dotenv').config();

    log('\n📋 Configuration:', 'blue');
    log(`  Database: ${process.env.DB_NAME}`, 'cyan');
    log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`, 'cyan');
    log(`  User: ${process.env.DB_USER}`, 'cyan');

    // Step 1: Check database connection
    log('\n1️⃣  Checking database connection...', 'blue');
    const testCmd = process.env.DB_PASSWORD
        ? `mysql -h ${process.env.DB_HOST} -P ${process.env.DB_PORT} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} -e "SELECT 1"`
        : `mysql -h ${process.env.DB_HOST} -P ${process.env.DB_PORT} -u ${process.env.DB_USER} -e "SELECT 1"`;

    try {
        execSync(testCmd, { stdio: 'ignore' });
        log('  ✅ Database connection successful', 'green');
    } catch (error) {
        log('  ❌ Cannot connect to database', 'red');
        log('  Please check your database credentials in .env', 'yellow');
        process.exit(1);
    }

    // Step 2: Install dependencies (if needed)
    const apiPath = path.join(process.cwd(), 'apps', 'api');
    const nodeModulesPath = path.join(apiPath, 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
        log('\n2️⃣  Installing dependencies...', 'blue');
        if (!execCommand('npm install', process.cwd())) {
            process.exit(1);
        }
    } else {
        log('\n2️⃣  Dependencies already installed ✅', 'green');
    }

    // Step 3: Build workspace packages
    log('\n3️⃣  Building workspace packages...', 'blue');
    const packagesPath = path.join(process.cwd(), 'packages');

    if (fs.existsSync(packagesPath)) {
        const packages = fs.readdirSync(packagesPath);
        for (const pkg of packages) {
            const pkgPath = path.join(packagesPath, pkg);
            const pkgJsonPath = path.join(pkgPath, 'package.json');

            if (fs.existsSync(pkgJsonPath)) {
                const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
                if (pkgJson.scripts && pkgJson.scripts.build) {
                    log(`  Building @enterprise/${pkg}...`, 'cyan');
                    if (!execCommand('npm run build', pkgPath)) {
                        log(`  ⚠️  Failed to build ${pkg}, continuing...`, 'yellow');
                    }
                }
            }
        }
    }

    // Step 4: Synchronize Database Schema
    log('\n4️⃣  Synchronizing database schema...', 'blue');
    if (!execCommand('npm run schema:sync', apiPath)) {
        log('  ❌ Schema sync failed', 'red');
        process.exit(1);
    }
    log('  ✅ Schema synchronized', 'green');

    // Step 5: Seed database
    log('\n5️⃣  Seeding database...', 'blue');
    if (!execCommand('npm run seed', apiPath)) {
        log('  ❌ Seeding failed', 'red');
        log('  Please check your seed scripts', 'yellow');
        process.exit(1);
    }
    log('  ✅ Database seeded', 'green');

    // Completion
    log('\n' + '━'.repeat(60), 'cyan');
    log('✅ Database Initialization Complete!', 'green');
    log('\n📋 Summary:', 'blue');
    log('  ✅ Database connection verified', 'green');
    log('  ✅ Dependencies installed', 'green');
    log('  ✅ Workspace packages built', 'green');
    log('  ✅ Database schema synchronized', 'green');
    log('  ✅ Initial data seeded', 'green');

    log('\n🚀 Next Steps:', 'blue');
    log('  Start development server: npm run dev', 'cyan');
    log('  Default login: admin@enterprise.com / admin123', 'cyan');

    log('\n📚 Documentation:', 'blue');
    log('  API Docs: http://localhost:4000/api/docs', 'cyan');
    log('  See DATABASE_INIT.md for troubleshooting', 'cyan');
}

main().catch(error => {
    log('\n❌ Fatal Error:', 'red');
    log(error.message, 'red');
    process.exit(1);
});
