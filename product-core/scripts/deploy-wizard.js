#!/usr/bin/env node

/**
 * Deployment Wizard - Interactive Deployment Wizard
 * 
 * Interactive deployment tool, supports multiple environments
 * 
 * Usage: node scripts/deploy-wizard.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function execCommand(command, description) {
    log(`\n▶ ${description}...`, 'cyan');
    try {
        execSync(command, { stdio: 'inherit' });
        log(`✅ ${description} completed`, 'green');
        return true;
    } catch (error) {
        log(`❌ ${description} failed`, 'red');
        return false;
    }
}

class DeploymentWizard {
    constructor() {
        this.config = {
            environment: null,
            target: null,
            buildCommand: 'npm run build',
            testCommand: 'npm test',
            healthCheckUrl: null
        };
    }

    async run() {
        log('\n🚀 Deployment Wizard', 'cyan');
        log('━'.repeat(60), 'cyan');

        await this.selectEnvironment();
        await this.selectTarget();
        await this.runPreDeployChecks();
        await this.buildApplication();
        await this.deployApplication();
        await this.runPostDeployChecks();
        await this.showSummary();

        rl.close();
    }

    async selectEnvironment() {
        log('\n📋 Select Environment', 'blue');
        log('  1. Development (dev)');
        log('  2. Staging (staging)');
        log('  3. Production (production)');

        const choice = await question('\nEnvironment (1-3): ');

        const envMap = {
            '1': 'development',
            '2': 'staging',
            '3': 'production'
        };

        this.config.environment = envMap[choice] || 'development';
        log(`Selected: ${this.config.environment}`, 'green');

        if (this.config.environment === 'production') {
            const confirm = await question('\n⚠️  Deploying to PRODUCTION. Are you sure? (yes/no): ');
            if (confirm.toLowerCase() !== 'yes') {
                log('Deployment cancelled', 'yellow');
                process.exit(0);
            }
        }
    }

    async selectTarget() {
        log('\n🎯 Select Deployment Target', 'blue');
        log('  1. Docker Container');
        log('  2. Vercel');
        log('  3. AWS (EC2/ECS)');
        log('  4. Heroku');
        log('  5. Custom Server (SSH)');

        const choice = await question('\nTarget (1-5): ');

        const targetMap = {
            '1': 'docker',
            '2': 'vercel',
            '3': 'aws',
            '4': 'heroku',
            '5': 'custom'
        };

        this.config.target = targetMap[choice] || 'docker';
        log(`Selected: ${this.config.target}`, 'green');
    }

    async runPreDeployChecks() {
        log('\n🔍 Running Pre-Deployment Checks', 'blue');

        const checks = [
            { name: 'Git Status', fn: () => this.checkGitStatus() },
            { name: 'Dependencies', fn: () => this.checkDependencies() },
            { name: 'Environment Variables', fn: () => this.checkEnvVars() },
            { name: 'Tests', fn: () => this.runTests() }
        ];

        for (const check of checks) {
            const result = await check.fn();
            if (!result) {
                log(`\n⚠️  Check failed: ${check.name}`, 'yellow');
                const proceed = await question('Continue anyway? (yes/no): ');
                if (proceed.toLowerCase() !== 'yes') {
                    log('Deployment cancelled', 'yellow');
                    process.exit(0);
                }
            }
        }

        log('\n✅ All pre-deployment checks passed', 'green');
    }

    checkGitStatus() {
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            if (status.trim()) {
                log('  ⚠️  Uncommitted changes detected', 'yellow');
                return false;
            }
            log('  ✅ Git status: clean', 'green');
            return true;
        } catch (error) {
            log('  ⚠️  Not a git repository', 'yellow');
            return true;
        }
    }

    checkDependencies() {
        try {
            const nodeModulesPath = path.join(process.cwd(), 'node_modules');
            if (!fs.existsSync(nodeModulesPath)) {
                log('  ❌ node_modules not found. Run npm install', 'red');
                return false;
            }
            log('  ✅ Dependencies installed', 'green');
            return true;
        } catch (error) {
            return false;
        }
    }

    checkEnvVars() {
        const requiredVars = ['NODE_ENV', 'DB_HOST', 'DB_NAME'];
        const missing = [];

        requiredVars.forEach(varName => {
            if (!process.env[varName]) {
                missing.push(varName);
            }
        });

        if (missing.length > 0) {
            log(`  ⚠️  Missing environment variables: ${missing.join(', ')}`, 'yellow');
            return false;
        }

        log('  ✅ Environment variables configured', 'green');
        return true;
    }

    runTests() {
        try {
            log('  Running tests...', 'cyan');
            execSync(this.config.testCommand, { stdio: 'inherit' });
            log('  ✅ Tests passed', 'green');
            return true;
        } catch (error) {
            log('  ❌ Tests failed', 'red');
            return false;
        }
    }

    async buildApplication() {
        log('\n🔨 Building Application', 'blue');

        const success = execCommand(
            this.config.buildCommand,
            'Building application'
        );

        if (!success) {
            log('\n❌ Build failed. Deployment aborted.', 'red');
            process.exit(1);
        }
    }

    async deployApplication() {
        log('\n🚀 Deploying Application', 'blue');

        switch (this.config.target) {
            case 'docker':
                await this.deployDocker();
                break;
            case 'vercel':
                await this.deployVercel();
                break;
            case 'aws':
                await this.deployAWS();
                break;
            case 'heroku':
                await this.deployHeroku();
                break;
            case 'custom':
                await this.deployCustom();
                break;
        }
    }

    async deployDocker() {
        log('\n🐳 Docker Deployment', 'magenta');

        const imageName = await question('Docker image name: ');
        const tag = this.config.environment;

        // Build image
        execCommand(
            `docker build -t ${imageName}:${tag} .`,
            'Building Docker image'
        );

        // Push to registry
        const pushImage = await question('Push to registry? (yes/no): ');
        if (pushImage.toLowerCase() === 'yes') {
            const registry = await question('Registry URL: ');
            execCommand(
                `docker tag ${imageName}:${tag} ${registry}/${imageName}:${tag}`,
                'Tagging image'
            );
            execCommand(
                `docker push ${registry}/${imageName}:${tag}`,
                'Pushing to registry'
            );
        }

        // Run container
        const runLocal = await question('Run container locally? (yes/no): ');
        if (runLocal.toLowerCase() === 'yes') {
            const port = await question('Port mapping (e.g., 3000:3000): ');
            execCommand(
                `docker run -d -p ${port} --name ${imageName}-${tag} ${imageName}:${tag}`,
                'Starting container'
            );
        }
    }

    async deployVercel() {
        log('\n▲ Vercel Deployment', 'magenta');

        const prod = this.config.environment === 'production' ? '--prod' : '';
        execCommand(
            `vercel ${prod}`,
            'Deploying to Vercel'
        );
    }

    async deployAWS() {
        log('\n☁️  AWS Deployment', 'magenta');
        log('  This requires AWS CLI to be configured', 'yellow');

        const service = await question('Service (EC2/ECS): ');

        if (service.toLowerCase() === 'ecs') {
            const cluster = await question('ECS Cluster name: ');
            const taskDef = await question('Task definition: ');

            execCommand(
                `aws ecs update-service --cluster ${cluster} --service ${taskDef} --force-new-deployment`,
                'Updating ECS service'
            );
        } else {
            log('  Please deploy manually to EC2', 'yellow');
        }
    }

    async deployHeroku() {
        log('\n🟣 Heroku Deployment', 'magenta');

        const appName = await question('Heroku app name: ');

        execCommand(
            `git push heroku main`,
            'Pushing to Heroku'
        );

        execCommand(
            `heroku run npm run db:migrate --app ${appName}`,
            'Running migrations'
        );
    }

    async deployCustom() {
        log('\n🔧 Custom Server Deployment (SSH)', 'magenta');

        const host = await question('Server host: ');
        const user = await question('SSH user: ');
        const deployPath = await question('Deploy path on server: ');

        // Upload files
        execCommand(
            `rsync -avz --exclude 'node_modules' ./ ${user}@${host}:${deployPath}`,
            'Uploading files'
        );

        // Install and restart
        execCommand(
            `ssh ${user}@${host} "cd ${deployPath} && npm install && pm2 restart all"`,
            'Installing and restarting'
        );
    }

    async runPostDeployChecks() {
        log('\n🔍 Running Post-Deployment Checks', 'blue');

        this.config.healthCheckUrl = await question('Health check URL (optional): ');

        if (this.config.healthCheckUrl) {
            log('  Waiting 10s for application to start...', 'cyan');
            await new Promise(resolve => setTimeout(resolve, 10000));

            try {
                const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${this.config.healthCheckUrl}`,
                    { encoding: 'utf8' });

                if (response.trim() === '200') {
                    log('  ✅ Health check passed', 'green');
                } else {
                    log(`  ⚠️  Health check returned: ${response}`, 'yellow');
                }
            } catch (error) {
                log('  ❌ Health check failed', 'red');
            }
        }
    }

    async showSummary() {
        log('\n' + '━'.repeat(60), 'cyan');
        log('✅ Deployment Complete!', 'green');
        log('━'.repeat(60), 'cyan');

        log('\n📊 Deployment Summary:', 'blue');
        log(`  Environment: ${this.config.environment}`, 'cyan');
        log(`  Target: ${this.config.target}`, 'cyan');
        log(`  Time: ${new Date().toISOString()}`, 'cyan');

        if (this.config.healthCheckUrl) {
            log(`  Health Check: ${this.config.healthCheckUrl}`, 'cyan');
        }

        log('\n📝 Next Steps:', 'blue');
        log('  1. Monitor application logs', 'cyan');
        log('  2. Verify all features work correctly', 'cyan');
        log('  3. Update deployment documentation', 'cyan');

        if (this.config.environment === 'production') {
            log('\n⚠️  Production Deployment Checklist:', 'yellow');
            log('  [ ] Notify team about deployment', 'yellow');
            log('  [ ] Monitor error rates', 'yellow');
            log('  [ ] Check performance metrics', 'yellow');
            log('  [ ] Verify database migrations', 'yellow');
        }
    }
}

// Main function
async function main() {
    const wizard = new DeploymentWizard();
    await wizard.run();
}

main().catch(error => {
    log('\n❌ Deployment Error:', 'red');
    log(error.message, 'red');
    rl.close();
    process.exit(1);
});
