#!/usr/bin/env node

/**
 * Deployment Script
 * Handles build, push, and deployment to various targets
 */

const { execSync } = require('child_process');
const fs = require('fs');
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
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        return false;
    }
}

async function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function selectEnvironment() {
    log('\n📍 Select deployment environment:', 'blue');
    log('  1. staging', 'cyan');
    log('  2. production', 'cyan');

    const choice = await question('\nEnvironment (1-2): ');

    switch (choice) {
        case '1':
            return 'staging';
        case '2':
            return 'production';
        default:
            log('Invalid choice, using staging', 'yellow');
            return 'staging';
    }
}

async function selectTarget() {
    log('\n🎯 Select deployment target:', 'blue');
    log('  1. Docker Compose (VPS)', 'cyan');
    log('  2. Kubernetes', 'cyan');
    log('  3. Serverless (Vercel + AWS Lambda)', 'cyan');

    const choice = await question('\nTarget (1-3): ');

    switch (choice) {
        case '1':
            return 'docker';
        case '2':
            return 'kubernetes';
        case '3':
            return 'serverless';
        default:
            log('Invalid choice, using Docker', 'yellow');
            return 'docker';
    }
}

async function runTests() {
    log('\n🧪 Running tests...', 'blue');

    if (!exec('npm run test')) {
        log('❌ Tests failed', 'red');
        const proceed = await question('Continue deployment anyway? (y/n): ');
        if (proceed.toLowerCase() !== 'y') {
            process.exit(1);
        }
    }

    log('✓ Tests passed', 'green');
}

async function buildImages(env) {
    log('\n📦 Building Docker images...', 'blue');

    const version = process.env.VERSION || new Date().toISOString().split('T')[0];

    if (!exec(`docker-compose -f docker-compose.${env}.yml build`)) {
        log('❌ Build failed', 'red');
        process.exit(1);
    }

    // Tag with version
    log('✓ Tagging images...', 'blue');
    exec(`docker tag myapp-web:latest myapp-web:${version}`);
    exec(`docker tag myapp-api:latest myapp-api:${version}`);

    log('✓ Images built and tagged', 'green');
    return version;
}

async function pushImages(env, version) {
    log('\n🚀 Pushing images to registry...', 'blue');

    const registry = process.env.DOCKER_REGISTRY || 'registry.example.com';

    // Login to registry
    if (process.env.REGISTRY_TOKEN) {
        exec(`echo ${process.env.REGISTRY_TOKEN} | docker login ${registry} -u ${process.env.REGISTRY_USER} --password-stdin`);
    }

    // Tag for registry
    exec(`docker tag myapp-web:${version} ${registry}/myapp-web:${version}`);
    exec(`docker tag myapp-api:${version} ${registry}/myapp-api:${version}`);
    exec(`docker tag myapp-web:${version} ${registry}/myapp-web:latest`);
    exec(`docker tag myapp-api:${version} ${registry}/myapp-api:latest`);

    // Push
    if (!exec(`docker push ${registry}/myapp-web:${version}`) ||
        !exec(`docker push ${registry}/myapp-api:${version}`) ||
        !exec(`docker push ${registry}/myapp-web:latest`) ||
        !exec(`docker push ${registry}/myapp-api:latest`)) {
        log('❌ Push failed', 'red');
        process.exit(1);
    }

    log('✓ Images pushed', 'green');
}

async function deployDocker(env) {
    log('\n🐳 Deploying to Docker Compose...', 'blue');

    const sshHost = process.env[`SSH_HOST_${env.toUpperCase()}`];

    if (!sshHost) {
        log('❌ SSH_HOST not configured', 'red');
        process.exit(1);
    }

    const commands = [
        'cd /app',
        'git pull origin main',
        `docker-compose -f docker-compose.${env}.yml pull`,
        `docker-compose -f docker-compose.${env}.yml up -d`,
        'docker-compose exec -T api npm run db:migrate',
    ];

    const sshCommand = `ssh ${sshHost} "${commands.join(' && ')}"`;

    if (!exec(sshCommand)) {
        log('❌ Deployment failed', 'red');
        process.exit(1);
    }

    log('✓ Deployed to Docker Compose', 'green');
}

async function deployKubernetes(env) {
    log('\n☸️  Deploying to Kubernetes...', 'blue');

    // Apply configs
    if (!exec(`kubectl apply -f k8s/${env}/`)) {
        log('❌ Kubernetes apply failed', 'red');
        process.exit(1);
    }

    // Wait for rollout
    log('⏳ Waiting for rollout...', 'blue');
    exec(`kubectl rollout status deployment/myapp-api -n ${env}`);
    exec(`kubectl rollout status deployment/myapp-web -n ${env}`);

    // Run migrations (job)
    log('📊 Running database migrations...', 'blue');
    exec(`kubectl apply -f k8s/${env}/migration-job.yaml`);
    exec(`kubectl wait --for=condition=complete job/migration-job -n ${env} --timeout=300s`);

    log('✓ Deployed to Kubernetes', 'green');
}

async function deployServerless(env) {
    log('\n⚡ Deploying to Serverless...', 'blue');

    // Deploy frontend to Vercel
    log('📦 Deploying frontend to Vercel...', 'blue');
    const vercelEnv = env === 'production' ? '--prod' : '';
    if (!exec(`cd apps/web && vercel ${vercelEnv}`)) {
        log('❌ Vercel deployment failed', 'red');
        process.exit(1);
    }

    // Deploy backend to AWS Lambda
    log('📦 Deploying backend to AWS Lambda...', 'blue');
    if (!exec(`cd apps/api && serverless deploy --stage ${env}`)) {
        log('❌ Lambda deployment failed', 'red');
        process.exit(1);
    }

    log('✓ Deployed to Serverless', 'green');
}

async function healthCheck(env) {
    log('\n🏥 Running health check...', 'blue');

    const url = process.env[`API_URL_${env.toUpperCase()}`] || `https://${env}.myapp.com`;

    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
        try {
            execSync(`curl -f ${url}/health`, { stdio: 'pipe' });
            log('✓ Health check passed', 'green');
            return true;
        } catch (error) {
            log(`  Retry ${i + 1}/${maxRetries}...`, 'yellow');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    log('❌ Health check failed', 'red');
    return false;
}

async function main() {
    log('\n🚀 FSPC Deployment Script', 'blue');
    log('━'.repeat(50), 'blue');

    try {
        const env = await selectEnvironment();
        const target = await selectTarget();

        log(`\n📋 Deployment Summary:`, 'cyan');
        log(`   Environment: ${env}`, 'cyan');
        log(`   Target: ${target}`, 'cyan');

        const confirm = await question('\nProceed with deployment? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            log('Deployment cancelled', 'yellow');
            process.exit(0);
        }

        // Run tests
        await runTests();

        // Build images (except for serverless frontend)
        let version;
        if (target !== 'serverless') {
            version = await buildImages(env);
        }

        // Push images (for kubernetes)
        if (target === 'kubernetes') {
            await pushImages(env, version);
        }

        // Deploy based on target
        switch (target) {
            case 'docker':
                await deployDocker(env);
                break;
            case 'kubernetes':
                await deployKubernetes(env);
                break;
            case 'serverless':
                await deployServerless(env);
                break;
        }

        // Health check
        const healthy = await healthCheck(env);

        if (healthy) {
            log('\n✅ Deployment successful!', 'green');
            log('━'.repeat(50), 'green');
            log(`\n🌐 URLs:`, 'blue');
            log(`   Frontend: https://${env}.myapp.com`, 'cyan');
            log(`   Backend: https://api-${env}.myapp.com`, 'cyan');
            log(`   API Docs: https://api-${env}.myapp.com/api`, 'cyan');
        } else {
            log('\n⚠️  Deployment completed but health check failed', 'yellow');
            log('   Please check logs for issues', 'yellow');
        }

    } catch (error) {
        log('\n❌ Deployment failed: ' + error.message, 'red');
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
