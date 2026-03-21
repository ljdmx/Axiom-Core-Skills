#!/usr/bin/env node

/**
 * Aesthetic Scorer - Professional UI Visual Quality Auditor
 * 
 * Automatically audits UI components for aesthetic quality against Manifest standards.
 * 
 * Usage: node tools/aesthetic-scorer.js <path-to-file>
 */

const fs = require('fs');
const path = require('path');

class AestheticScorer {
    constructor() {
        this.scores = {
            spacing: 0,
            color: 0,
            typography: 0,
            motion: 0,
            accessibility: 0
        };
        this.feedback = [];
    }

    audit(filePath) {
        console.log(`\n🔍 Auditing: ${path.basename(filePath)}`);
        const content = fs.readFileSync(filePath, 'utf8');

        this.scoreSpacing(content);
        this.scoreColor(content);
        this.scoreTypography(content);
        this.scoreMotion(content);
        this.scoreAccessibility(content);

        this.report();
    }

    scoreSpacing(content) {
        // Evaluate visual text density (whitespace proxy)
        const densityScore = this.calculateDensity(content);
        if (densityScore < 0.25) {
            this.scores.spacing += 50;
        } else {
            this.feedback.push('Spacing: Failed visual density gate. Excessive cramming detected. Introduce more padding/margin/whitespace around components.');
        }

        // Check for 8pt grid or Golden Ratio
        if (content.includes('8px') || content.includes('rem') || content.includes('φ') || content.includes('1.618')) {
            this.scores.spacing += 50;
        } else {
            this.scores.spacing += 20;
            this.feedback.push('Spacing: Recommend using an 8pt grid or Golden Ratio system.');
        }
    }

    calculateDensity(content) {
        // High density of text/tags compared to structural properties implies cramming
        const tags = (content.match(/<[a-z]+/gi) || []).length;
        const textNodes = (content.match(/>([^<]{5,})</g) || []).length;
        const structuralAttrs = (content.match(/margin|padding|gap|space-between/g) || []).length;
        
        if (structuralAttrs === 0) return 1.0;
        return (tags + textNodes) / (structuralAttrs * 10);
    }

    scoreColor(content) {
        // Check for HSL, variable usage, or modern palettes
        if (content.includes('hsl(') || content.includes('--') || content.includes('gradient')) {
            this.scores.color = 100;
        } else {
            this.scores.color = 50;
            this.feedback.push('Color: Recommend using HSL and CSS Variables for color orchestration.');
        }
    }

    scoreTypography(content) {
        // Check for font-family, line-height, letter-spacing
        if (content.includes('font-family') && content.includes('line-height')) {
            this.scores.typography = 100;
        } else {
            this.scores.typography = 40;
            this.feedback.push('Typography: Missing explicit font-family or line-height definitions.');
        }
    }

    scoreMotion(content) {
        // Check for cubic-bezier, transition, transform
        if (content.includes('cubic-bezier') || content.includes('transition')) {
            this.scores.motion = 100;
        } else {
            this.scores.motion = 30;
            this.feedback.push('Motion: Add fluid transitions and cubic-bezier curves for premium feel.');
        }
    }

    scoreAccessibility(content) {
        // Check for aria, contrast, prefers-reduced-motion
        if (content.includes('aria-') || content.includes('prefers-reduced-motion')) {
            this.scores.accessibility = 100;
        } else {
            this.scores.accessibility = 50;
            this.feedback.push('Accessibility: Recommend adding ARIA labels and reduced-motion support.');
        }
    }

    report() {
        const total = Object.values(this.scores).reduce((a, b) => a + b, 0);
        const average = Math.round(total / 5);

        console.log('\n--- Aesthetic Score Report ---');
        console.log(`Average Score: ${average}/100`);
        console.log('-----------------------------');
        Object.entries(this.scores).forEach(([key, val]) => {
            console.log(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`);
        });

        if (this.feedback.length > 0) {
            console.log('\nImprovement Suggestions:');
            this.feedback.forEach(msg => console.log(`• ${msg}`));
        }

        if (average >= 90) {
            console.log('\n🌟 Status: Sovereign Level Aesthetic');
        } else if (average >= 70) {
            console.log('\n✅ Status: Professional Level');
        } else {
            console.log('\n⚠️  Status: Needs Improvement');
        }
    }
}

// Main logic
const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node tools/aesthetic-scorer.js <path-to-file>');
    process.exit(1);
}

const scorer = new AestheticScorer();
scorer.audit(filePath);
