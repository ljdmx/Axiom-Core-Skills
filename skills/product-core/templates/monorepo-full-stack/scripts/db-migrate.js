#!/usr/bin/env node

/**
 * Database Migration Script
 * Handles database schema migrations
 */

const { execSync } = require('child_process');
const path = require('path');

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

function exec(command, cwd = process.cwd()) {
    try {
        execSync(command, { stdio: 'inherit', cwd });
        return true;
    } catch (error) {
        return false;
    }
}

const backend = process.env.BACKEND || 'nestjs';
const apiPath = path.join(process.cwd(), 'apps', 'api');

log('\n📊 Database Migration', 'blue');
log('━'.repeat(50), 'blue');

if (backend === 'nestjs') {
    log('\n✓ Detected NestJS backend', 'blue');

    // Check if using TypeORM or Prisma
    const usePrisma = require(path.join(apiPath, 'package.json'))
        .dependencies?.['@prisma/client'];

    if (usePrisma) {
        log('✓ Using Prisma', 'green');

        // Generate Prisma client
        log('\n1️⃣ Generating Prisma client...', 'blue');
        if (!exec('npx prisma generate', apiPath)) {
            log('❌ Prisma generate failed', 'red');
            process.exit(1);
        }

        // Run migrations
        log('\n2️⃣ Running Prisma migrations...', 'blue');
        if (!exec('npx prisma migrate deploy', apiPath)) {
            log('❌ Migration failed', 'red');
            process.exit(1);
        }

    } else {
        log('✓ Using TypeORM', 'green');

        log('\n1️⃣ Running TypeORM migrations...', 'blue');
        if (!exec('npm run migration:run', apiPath)) {
            log('❌ Migration failed', 'red');
            process.exit(1);
        }
    }

} else if (backend === 'spring-boot') {
    log('\n✓ Detected Spring Boot backend', 'blue');
    log('✓ Using Flyway', 'green');

    const backendPath = path.join(process.cwd(), 'backend');

    log('\n1️⃣ Running Flyway migrations...', 'blue');
    if (!exec('./mvnw flyway:migrate', backendPath)) {
        log('❌ Migration failed', 'red');
        process.exit(1);
    }

} else if (backend === 'go') {
    log('\n✓ Detected Go backend', 'blue');
    log('✓ Using golang-migrate', 'green');

    const backendPath = path.join(process.cwd(), 'backend');
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        log('❌ DATABASE_URL not set', 'red');
        process.exit(1);
    }

    log('\n1️⃣ Running golang-migrate...', 'blue');
    if (!exec(`migrate -path ./migrations -database "${dbUrl}" up`, backendPath)) {
        log('❌ Migration failed', 'red');
        process.exit(1);
    }
}

log('\n✅ Migration completed successfully!', 'green');
log('━'.repeat(50), 'green');
