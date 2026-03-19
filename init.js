const fs = require('fs');
const path = require('path');

const CORE_AXIOMS_MEM = path.join(__dirname, '_core_axioms', 'memory');
const CORE_AXIOMS_EVO = path.join(__dirname, '_core_axioms', 'evolution');

const userProfile = {
  identity: { role: "Architect", experience_level: "Adaptive", language: "auto" },
  preferences: { package_manager: "npm", linter: "Biome", css_framework: "Tailwind", orm: "Prisma" },
  style_guide: { quotes: "single", semi: true, component_export: "named" }
};

const projectGraph = { projects: {}, cross_project_patterns: {} };
const patchHistory = { template_mutations: {} };

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function writeJsonSync(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('🔄 Wiping old memories and initializing World-Class Axiom Core Skills...');

ensureDirSync(CORE_AXIOMS_MEM);
ensureDirSync(CORE_AXIOMS_EVO);
ensureDirSync(path.join(CORE_AXIOMS_MEM, 'vector_vault'));

writeJsonSync(path.join(CORE_AXIOMS_MEM, 'user_profile.json'), userProfile);
writeJsonSync(path.join(CORE_AXIOMS_MEM, 'project_graph.json'), projectGraph);
writeJsonSync(path.join(CORE_AXIOMS_MEM, 'snippet_vault.json'), { snippets: {} });
writeJsonSync(path.join(CORE_AXIOMS_EVO, 'patch_history.json'), patchHistory);
writeJsonSync(path.join(CORE_AXIOMS_EVO, 'analytics.json'), { runs: 0, rejections: 0 });

console.log('✨ 🌌 Axiom Core Sentient Cognitive Memory has been completely reset.\n✨ Your AI is now a blank canvas ready for evolution.');
