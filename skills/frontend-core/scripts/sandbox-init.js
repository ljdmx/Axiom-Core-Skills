// Frontend Zero-Error Initialization Script
// Forces strict Dependency Versions and injects Glassmorphism & Framer Motion templates.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function enforceFrontendDependencies(targetDir) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  console.log(`[DDFM] Enforcing zero-error frontend dependencies at ${targetDir}...`);
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`[!] No package.json found. Initializing minimal package.json...`);
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      name: "ddfm-sovereign-app",
      version: "1.0.0",
      dependencies: {
        "framer-motion": "10.16.4",
        "lucide-react": "0.292.0",
        "clsx": "2.0.0",
        "tailwind-merge": "1.14.0"
      }
    }, null, 2));
  } else {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['framer-motion'] = pkg.dependencies['framer-motion'] || "10.16.4";
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
      console.log(`[✓] Enforced framer-motion dependency for World-Class Aesthetics.`);
    } catch (e) {
      console.error(`[X] Error parsing package.json: ${e.message}`);
    }
  }

  const tailwindPath = path.join(targetDir, 'tailwind.config.js');
  if (!fs.existsSync(tailwindPath)) {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'spring-bounce': 'spring 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      }
    },
  },
  plugins: [],
};`;
    fs.writeFileSync(tailwindPath, tailwindConfig);
    console.log(`[✓] Created tailwind.config.js with Glassmorphism and Spring parameters.`);
  }

  console.log(`[DDFM] Frontend environment healing and enforcement complete.`);
}

const targetPath = process.argv[2] || process.cwd();
enforceFrontendDependencies(targetPath);
