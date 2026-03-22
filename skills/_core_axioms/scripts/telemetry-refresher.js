const fs = require('fs');
const path = require('path');

/**
 * Axiom Telemetry Refresher v1.0
 * Purpose: Synchronizes PROJECT_NEXUS.json state with telemetry_dashboard.html.
 */

const NEXUS_PATH = path.join(process.cwd(), 'PROJECT_NEXUS.json');
const DASHBOARD_PATH = path.join(__dirname, 'telemetry_dashboard.html');

function refresh() {
    if (!fs.existsSync(NEXUS_PATH)) {
        console.error('[Telemetry] PROJECT_NEXUS.json not found. Skipping refresh.');
        return;
    }

    try {
        const nexus = JSON.parse(fs.readFileSync(NEXUS_PATH, 'utf8'));
        let dashboard = fs.readFileSync(DASHBOARD_PATH, 'utf8');

        // 1. Update Rams Score
        const ramsScore = nexus.soul_scorecard?.overall || 9.5;
        dashboard = dashboard.replace(/<div class="score-value">[\d.]+<\/div>/, `<div class="score-value">${ramsScore}<\/div>`);

        // 2. Update System Health (Example: Build Success Pulse)
        const health = nexus.status === 'error' ? 'Degraded' : 'Stable';
        const healthColor = nexus.status === 'error' ? '#ff3b3b' : '#00ff88';
        dashboard = dashboard.replace(/<span>Build Success Pulse<\/span><\/div>\s+<div class="metric-val" style="color: #[\da-f]{6};">[\w]+<\/div>/, 
            `<span>Build Success Pulse<\/span><\/div>\n                    <div class="metric-val" style="color: ${healthColor};">${health}<\/div>`);

        // 3. Update Soul Manifest Axis (Understanding, Respect, Companionship)
        const axes = nexus.soul_scorecard?.axes || { understand: 90, respect: 90, companion: 90 };
        dashboard = dashboard.replace(/<div class="bar" style="height: [\d.]%+;"><\/div>/g, (match, i) => {
            const vals = [axes.understand, axes.respect, axes.companion];
            return `<div class="bar" style="height: ${vals[i]}%;"><\/div>`;
        });

        // 4. Update Log Stream (Inject latest handover)
        if (nexus.logs && nexus.logs.length > 0) {
            const latestLogs = nexus.logs.slice(-4).map(log => {
                let color = 'var(--text-dim)';
                if (log.includes('error')) color = '#ff3b3b';
                if (log.includes('Nexus')) color = 'var(--accent-primary)';
                return `<div style="color: ${color};">[${new Date().toLocaleTimeString()}] ${log}</div>`;
            }).join('\n');
            dashboard = dashboard.replace(/<div style="font-family: 'Inter', monospace; font-size: 13px; line-height: 1.8;">[\s\S]*?<\/div>/, 
                `<div style="font-family: 'Inter', monospace; font-size: 13px; line-height: 1.8;">\n                ${latestLogs}\n            <\/div>`);
        }

        fs.writeFileSync(DASHBOARD_PATH, dashboard, 'utf8');
        console.log('[Telemetry] Dashboard synchronized with Project Nexus.');
    } catch (err) {
        console.error('[Telemetry] Refresh failed:', err);
    }
}

refresh();
