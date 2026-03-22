const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 🌌 Axiom Core Skills - Zenith Initialization Engine (v10.2)
 * =========================================================
 * Portable Bootstrap System:
 * Can be run from ANY directory to scaffold a new 'Axiom-Aware' project.
 * 
 * Usage:
 * node /path/to/Axiom-Core-Skills/init.js
 */

const TARGET_DIR = process.cwd();
const SCRIPT_DIR = __dirname;

console.log("\x1b[35m🌌 Axiom Core Skills - Zenith Initialization\x1b[0m");
console.log(`[SYS] Target Directory: ${TARGET_DIR}`);
console.log("=================================================");

const platform = os.platform();
console.log(`[SYS] Platform: ${platform} | Release: ${os.release()}`);

// 1. Define Evolution Matrix (Target Local)
const evolutionDir = path.join(TARGET_DIR, '.axiom_evolution');
const dirsToCreate = [
    evolutionDir,
    path.join(evolutionDir, 'logs'),
    path.join(evolutionDir, 'custom_templates'),
    path.join(evolutionDir, 'patches'),
    path.join(evolutionDir, 'antibodies'),
    path.join(evolutionDir, 'telemetry'),
    path.join(evolutionDir, 'session_cache')
];

// 2. Define State Templates
const stateFiles = {
    'SOUL_MANIFEST.json': {
        initialized_at: new Date().toISOString(),
        evolution_stage: "genesis",
        design_intensity_level: "L3",
        rams_score_history: [],
        aesthetic_gan_rejections: 0,
        platform: platform
    },
    'EVALUATION_LOG.json': {
        fatal_errors_caught: 0,
        patches_generated: 0,
        incidents: []
    },
    'antibodies.json': {
        sequenced_at: new Date().toISOString(),
        immunities: [],
        hazard_blocks: []
    }
};

const nexusTemplate = {
    project_name: path.basename(TARGET_DIR),
    soul_scorecard: {
        overall: 0,
        understanding: 0,
        respect: 0,
        companionship: 0
    },
    sub_skill_outputs: {
        fspc: { status: "pending" },
        ddfm: { status: "pending", dil_level: "L3" },
        adbm: { status: "pending" },
        mobile_core: { status: "pending" },
        web3_core: { status: "pending" }
    }
};

try {
    // Phase 1: Scaffolding Directories
    console.log("\n[1/4] \x1b[36mScaffolding Sovereign Evolution Matrix...\x1b[0m");
    dirsToCreate.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`  \x1b[32m✓\x1b[0m Created: ${path.relative(TARGET_DIR, dir)}`);
        } else {
            console.log(`  \x1b[34m-\x1b[0m Exists:  ${path.relative(TARGET_DIR, dir)}`);
        }
    });

    // Phase 2: Writing Neural State Files
    console.log("\n[2/4] \x1b[36mWriting Neural State & Nexus Templates...\x1b[0m");
    Object.entries(stateFiles).forEach(([filename, content]) => {
        const filePath = path.join(evolutionDir, filename);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
            console.log(`  \x1b[32m✓\x1b[0m Initialized: ${filename}`);
        }
    });
    
    // PROJECT_NEXUS.json template in root (if not exists)
    const nexusPath = path.join(TARGET_DIR, 'PROJECT_NEXUS.json');
    if (!fs.existsSync(nexusPath)) {
        fs.writeFileSync(nexusPath, JSON.stringify(nexusTemplate, null, 2), 'utf8');
        console.log(`  \x1b[32m✓\x1b[0m Initialized: PROJECT_NEXUS.json (Shared Brain)`);
    }

    // Phase 3: Privacy & Security (Git Protection)
    console.log("\n[3/4] \x1b[36mEnforcing Privacy & Security (Git Isolation)...\x1b[0m");
    const gitignorePath = path.join(TARGET_DIR, '.gitignore');
    const sensitiveItems = ['.axiom_evolution/', '.axiom_env', 'PROJECT_NEXUS.json'];
    
    let gitignoreContent = "";
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    let addedCount = 0;
    sensitiveItems.forEach(item => {
        if (!gitignoreContent.includes(item)) {
            gitignoreContent += (gitignoreContent.endsWith('\n') ? '' : '\n') + item;
            addedCount++;
        }
    });

    if (addedCount > 0) {
        fs.writeFileSync(gitignorePath, gitignoreContent, 'utf8');
        console.log(`  \x1b[32m✓\x1b[0m Hardened .gitignore (${addedCount} patterns added)`);
    } else {
        console.log(`  \x1b[34m-\x1b[0m .gitignore already hardened.`);
    }

    // Phase 4: Environment Bindings
    console.log("\n[4/4] \x1b[36mBinding Environment Capabilities...\x1b[0m");
    const envFile = path.join(TARGET_DIR, '.axiom_env');
    const envContent = `AXIOM_EVOLUTION_PATH=.axiom_evolution\nAXIOM_PLATFORM=${platform}\nAXIOM_STRICT_MODE=true\nAXIOM_DIL_DEFAULT=L3\nAXIOM_ENGINE_ROOT=${SCRIPT_DIR}`;
    fs.writeFileSync(envFile, envContent, 'utf8');
    console.log(`  \x1b[32m✓\x1b[0m Wrote bindings: .axiom_env`);

    console.log("\n\x1b[32m✅ ZENITH INITIALIZATION COMPLETE.\x1b[0m");
    console.log(`\nLocation: ${TARGET_DIR}`);
    console.log("\nYour Sovereign Agent ecosystem is now secured. All future architecture learnings,");
    console.log("aesthetic self-corrections, and custom templates will be securely stored in the");
    console.log("'.axiom_evolution/' directory. This directory is now ignored by Git.");

} catch (error) {
    console.error("\n\x1b[31m❌ INITIALIZATION FAILED:\x1b[0m", error.message);
    process.exit(1);
}
