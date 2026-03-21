const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("🌌 Axiom Core Skills - Environment Initialization");
console.log("=================================================");

// Detect OS
const platform = os.platform();
console.log(`[SYS] Detected Platform: ${platform} (${os.release()})`);

// Define evolution directories
const evolutionDir = path.join(__dirname, '.axiom_evolution');
const dirsToCreate = [
    evolutionDir,
    path.join(evolutionDir, 'logs'),
    path.join(evolutionDir, 'custom_templates'),
    path.join(evolutionDir, 'patches')
];

// Define core state files
const stateFiles = {
    'SOUL_MANIFEST.json': {
        initialized_at: new Date().toISOString(),
        evolution_stage: "genesis",
        rams_score_history: [],
        aesthetic_gan_rejections: 0,
        platform: platform
    },
    'EVALUATION_LOG.json': {
        fatal_errors_caught: 0,
        patches_generated: 0,
        incidents: []
    }
};

try {
    // Scaffold Directories
    console.log("\n[1/3] Scaffolding isolated evolution matrix...");
    dirsToCreate.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`  ✓ Created directory: ${path.relative(__dirname, dir)}`);
        } else {
            console.log(`  - Directory exists: ${path.relative(__dirname, dir)}`);
        }
    });

    // Scaffold State Files
    console.log("\n[2/3] Writing neural state files...");
    Object.entries(stateFiles).forEach(([filename, content]) => {
        const filePath = path.join(evolutionDir, filename);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`  ✓ Initialized state: ${filename}`);
        } else {
            console.log(`  - State preserved: ${filename}`);
        }
    });

    // Write Environment Bindings
    console.log("\n[3/3] Binding environment capabilities...");
    const envFile = path.join(__dirname, '.axiom_env');
    const envContent = `AXIOM_EVOLUTION_PATH=${evolutionDir}\nAXIOM_PLATFORM=${platform}\nAXIOM_STRICT_MODE=true`;
    fs.writeFileSync(envFile, envContent);
    console.log(`  ✓ Wrote environment bindings (.axiom_env)`);

    console.log("\n✅ INITIALIZATION COMPLETE.");
    console.log("\nYour Sovereign Agent ecosystem is now isolated. All future architecture learnings,");
    console.log("aesthetic self-corrections, and custom templates will be securely stored in the");
    console.log("'.axiom_evolution/' directory. This directory should typically be added to .gitignore");
    console.log("if you are distributing this engine, but backed up securely for your own 'Agent Brain'.");

} catch (error) {
    console.error("\n❌ INITIALIZATION FAILED:", error.message);
    process.exit(1);
}
