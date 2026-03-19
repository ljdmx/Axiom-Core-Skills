import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MEM_DIR = os.path.join(BASE_DIR, '_core_axioms', 'memory')
EVO_DIR = os.path.join(BASE_DIR, '_core_axioms', 'evolution')

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

print("🔄 Wiping old memories and initializing World-Class Axiom Core Skills...")

ensure_dir(MEM_DIR)
ensure_dir(EVO_DIR)
ensure_dir(os.path.join(MEM_DIR, 'vector_vault'))

user_profile = {
  "identity": { "role": "Architect", "experience_level": "Adaptive", "language": "auto" },
  "preferences": { "package_manager": "npm", "linter": "Biome", "css_framework": "Tailwind", "orm": "Prisma" },
  "style_guide": { "quotes": "single", "semi": True, "component_export": "named" }
}

write_json(os.path.join(MEM_DIR, 'user_profile.json'), user_profile)
write_json(os.path.join(MEM_DIR, 'project_graph.json'), { "projects": {}, "cross_project_patterns": {} })
write_json(os.path.join(MEM_DIR, 'snippet_vault.json'), { "snippets": {} })
write_json(os.path.join(EVO_DIR, 'patch_history.json'), { "template_mutations": {} })
write_json(os.path.join(EVO_DIR, 'analytics.json'), { "runs": 0, "rejections": 0 })

print("✨ 🌌 Axiom Core Sentient Cognitive Memory has been completely reset.")
print("✨ Your AI is now a blank canvas ready for evolution.")
