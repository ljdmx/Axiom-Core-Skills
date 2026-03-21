/**
 * Automated 3D Asset Compressor
 * Employs Draco/Meshopt to squish assets for the Spatial Canvas.
 */

const { execSync } = require('child_process');
const path = require('path');

function optimizeGLTF(inputPath) {
    console.log(\`[GLTF Optimizer] Processing \${inputPath}\`);
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, \`-optimized\${ext}\`);
    
    // Assumes gltf-pipeline is globally installed via the _core_axioms pre-flight setup.
    try {
        console.log(\`[GLTF Optimizer] Applying Draco compression. Target: \${outputPath}\`);
        execSync(\`gltf-pipeline -i \${inputPath} -o \${outputPath} -d\`, { stdio: 'inherit' });
        return outputPath;
    } catch (error) {
        console.error(\`[GLTF Optimizer] Optimization failed.\`, error);
        return inputPath;
    }
}

module.exports = { optimizeGLTF };
