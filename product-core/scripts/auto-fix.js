#!/usr/bin/env node

/**
 * Auto-Fix Engine
 * 
 * Automatically detects and fixes common development environment issues
 * 
 * Usage: node scripts/auto-fix.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

class AutoFixer {
    constructor() {
        this.issues = [];
        this.fixes = [];
    }

    // Detect issues
    async detectIssues() {
        log('\n🔍 Detecting issues...', 'blue');

        await this.checkPackageJson();
        await this.checkTsConfig();
        await this.checkEnvFile();
        await this.checkDependencies();
        await this.checkWorkspacePackages();

        return this.issues.length;
    }

    // Check package.json
    async checkPackageJson() {
        const apiPackagePath = path.join(process.cwd(), 'apps', 'api', 'package.json');

        if (!fs.existsSync(apiPackagePath)) {
            this.issues.push({
                type: 'missing_file',
                file: apiPackagePath,
                message: 'API package.json not found'
            });
            return;
        }

        try {
            const pkg = JSON.parse(fs.readFileSync(apiPackagePath, 'utf8'));

            // Check required dependencies
            const requiredDeps = {
                '@nestjs/config': '^3.0.0',
                'reflect-metadata': '^0.1.13',
                'mysql2': '^3.6.0',
                'dotenv': '^16.3.0'
            };

            for (const [dep, version] of Object.entries(requiredDeps)) {
                if (!pkg.dependencies?.[dep]) {
                    this.issues.push({
                        type: 'missing_dependency',
                        dependency: dep,
                        version,
                        file: apiPackagePath,
                        message: `Missing dependency: ${dep}`
                    });
                }
            }

            // Check required scripts
            const requiredScripts = {
                'dev': 'ts-node-dev --respawn --transpile-only src/main.ts',
                'schema:sync': 'npm run typeorm -- schema:sync -d src/data-source.ts',
                'seed': 'ts-node -r tsconfig-paths/register src/database/seeds/main.seed.ts'
            };

            for (const [script, command] of Object.entries(requiredScripts)) {
                if (!pkg.scripts?.[script]) {
                    this.issues.push({
                        type: 'missing_script',
                        script,
                        command,
                        file: apiPackagePath,
                        message: `Missing script: ${script}`
                    });
                }
            }

        } catch (error) {
            this.issues.push({
                type: 'invalid_json',
                file: apiPackagePath,
                message: 'Invalid JSON in package.json',
                error: error.message
            });
        }
    }

    // Check tsconfig.json
    async checkTsConfig() {
        const tsconfigPath = path.join(process.cwd(), 'apps', 'api', 'tsconfig.json');

        if (!fs.existsSync(tsconfigPath)) {
            this.issues.push({
                type: 'missing_file',
                file: tsconfigPath,
                message: 'tsconfig.json not found'
            });
            return;
        }

        try {
            const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

            // Check paths configuration
            if (!tsconfig.compilerOptions?.paths) {
                this.issues.push({
                    type: 'missing_paths',
                    file: tsconfigPath,
                    message: 'Missing TypeScript paths configuration'
                });
            }
        } catch (error) {
            this.issues.push({
                type: 'invalid_json',
                file: tsconfigPath,
                message: 'Invalid JSON in tsconfig.json'
            });
        }
    }

    // Check .env file
    async checkEnvFile() {
        const envPath = path.join(process.cwd(), '.env');

        if (!fs.existsSync(envPath)) {
            this.issues.push({
                type: 'missing_env',
                message: '.env file not found',
                severity: 'critical'
            });
        }
    }

    // Check if dependencies are installed
    async checkDependencies() {
        const nodeModulesPath = path.join(process.cwd(), 'node_modules');

        if (!fs.existsSync(nodeModulesPath)) {
            this.issues.push({
                type: 'missing_modules',
                message: 'node_modules not found',
                severity: 'critical'
            });
        }
    }

    // Check workspace packages
    async checkWorkspacePackages() {
        const packagesDir = path.join(process.cwd(), 'packages');

        if (fs.existsSync(packagesDir)) {
            const packages = fs.readdirSync(packagesDir);

            for (const pkg of packages) {
                const distPath = path.join(packagesDir, pkg, 'dist');
                if (!fs.existsSync(distPath)) {
                    this.issues.push({
                        type: 'unbuilt_package',
                        package: pkg,
                        message: `Workspace package not built: ${pkg}`
                    });
                }
            }
        }
    }

    // Apply fixes
    async applyFixes() {
        log('\n🔧 Applying fixes...', 'blue');

        for (const issue of this.issues) {
            try {
                switch (issue.type) {
                    case 'missing_dependency':
                        await this.fixMissingDependency(issue);
                        break;
                    case 'missing_script':
                        await this.fixMissingScript(issue);
                        break;
                    case 'missing_paths':
                        await this.fixMissingPaths(issue);
                        break;
                    case 'missing_env':
                        await this.fixMissingEnv();
                        break;
                    case 'missing_modules':
                        await this.fixMissingModules();
                        break;
                    case 'unbuilt_package':
                        await this.fixUnbuiltPackage(issue);
                        break;
                    default:
                        log(`  ⚠️  Cannot auto-fix: ${issue.message}`, 'yellow');
                }
            } catch (error) {
                log(`  ❌ Failed to fix: ${issue.message}`, 'red');
            }
        }
    }

    async fixMissingDependency(issue) {
        log(`  Adding dependency: ${issue.dependency}`, 'cyan');
        const pkg = JSON.parse(fs.readFileSync(issue.file, 'utf8'));

        if (!pkg.dependencies) pkg.dependencies = {};
        pkg.dependencies[issue.dependency] = issue.version;

        fs.writeFileSync(issue.file, JSON.stringify(pkg, null, 4));
        this.fixes.push(`Added ${issue.dependency}`);
        log(`    ✅ Fixed`, 'green');
    }

    async fixMissingScript(issue) {
        log(`  Adding script: ${issue.script}`, 'cyan');
        const pkg = JSON.parse(fs.readFileSync(issue.file, 'utf8'));

        if (!pkg.scripts) pkg.scripts = {};
        pkg.scripts[issue.script] = issue.command;

        fs.writeFileSync(issue.file, JSON.stringify(pkg, null, 4));
        this.fixes.push(`Added script: ${issue.script}`);
        log(`    ✅ Fixed`, 'green');
    }

    async fixMissingPaths(issue) {
        log(`  Adding TypeScript paths`, 'cyan');
        const tsconfig = JSON.parse(fs.readFileSync(issue.file, 'utf8'));

        if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
        tsconfig.compilerOptions.paths = {
            "@enterprise/shared-types": ["../../packages/shared-types/src"],
            "@enterprise/permission-model": ["../../packages/permission-model/src"]
        };

        fs.writeFileSync(issue.file, JSON.stringify(tsconfig, null, 4));
        this.fixes.push('Added TypeScript paths');
        log(`    ✅ Fixed`, 'green');
    }

    async fixMissingEnv() {
        log(`  Creating .env file from template`, 'cyan');
        const examplePath = path.join(process.cwd(), '.env.example');
        const envPath = path.join(process.cwd(), '.env');

        if (fs.existsSync(examplePath)) {
            fs.copyFileSync(examplePath, envPath);
            this.fixes.push('Created .env from .env.example');
            log(`    ✅ Fixed - Please update with your credentials`, 'green');
        } else {
            log(`    ⚠️  No .env.example found, run smart-config.js`, 'yellow');
        }
    }

    async fixMissingModules() {
        log(`  Installing dependencies...`, 'cyan');
        try {
            execSync('npm install', { stdio: 'inherit' });
            this.fixes.push('Installed dependencies');
            log(`    ✅ Fixed`, 'green');
        } catch (error) {
            log(`    ❌ npm install failed`, 'red');
        }
    }

    async fixUnbuiltPackage(issue) {
        log(`  Building package: ${issue.package}`, 'cyan');
        const pkgPath = path.join(process.cwd(), 'packages', issue.package);

        try {
            execSync('npm run build', { cwd: pkgPath, stdio: 'ignore' });
            this.fixes.push(`Built ${issue.package}`);
            log(`    ✅ Fixed`, 'green');
        } catch (error) {
            log(`    ❌ Build failed`, 'red');
        }
    }

    // Generate report
    generateReport() {
        log('\n' + '━'.repeat(60), 'cyan');
        log('📊 Auto-Fix Report', 'cyan');
        log('━'.repeat(60), 'cyan');

        log(`\n✅ Fixed: ${this.fixes.length} issues`, 'green');
        this.fixes.forEach(fix => log(`  • ${fix}`, 'green'));

        const unfixed = this.issues.length - this.fixes.length;
        if (unfixed > 0) {
            log(`\n⚠️  Remaining: ${unfixed} issues`, 'yellow');
        }

        log('\n💡 Recommendations:', 'blue');
        log('  1. Run: npm install (if dependencies were added)', 'cyan');
        log('  2. Run: node scripts/smart-config.js (if .env is missing)', 'cyan');
        log('  3. Run: node scripts/db-init.js (to setup database)', 'cyan');
    }
}

// Main function
async function main() {
    log('\n🤖 Auto-Fix Engine', 'cyan');
    log('━'.repeat(60), 'cyan');

    const fixer = new AutoFixer();

    const issueCount = await fixer.detectIssues();

    if (issueCount === 0) {
        log('\n✅ No issues detected!', 'green');
        log('Your project looks healthy 🎉', 'green');
        return;
    }

    log(`\n📋 Found ${issueCount} issue(s)`, 'yellow');

    await fixer.applyFixes();
    fixer.generateReport();
}

main().catch(error => {
    log('\n❌ Error:', 'red');
    log(error.message, 'red');
    process.exit(1);
});
