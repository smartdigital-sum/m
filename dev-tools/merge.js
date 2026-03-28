const fs = require('fs');

const upgradeHtmlPath = 'smart digital -to- upgrade/index.html';
const mainHtmlPath = 'index.html';
const cssPath = 'assets/css/style.css';
const jsPath = 'assets/js/script.js';

let upgradeHtml = fs.readFileSync(upgradeHtmlPath, 'utf8');
let mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');
let styleCss = fs.readFileSync(cssPath, 'utf8');
let scriptJs = fs.readFileSync(jsPath, 'utf8');

// 1. EXTRACT AND PREFIX CSS
const styleMatch = upgradeHtml.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
    console.error("No <style> block found in upgrade HTML");
    process.exit(1);
}
let aiCss = styleMatch[1];

// Remove generic things that we don't need (like import fonts, *, body)
aiCss = aiCss.replace(/@import url[^;]+;/g, '');
aiCss = aiCss.replace(/\* {[^}]*}/, '');
aiCss = aiCss.replace(/body {[^}]*}/, '');
aiCss = aiCss.replace(/:root {([\s\S]*?)}/, ''); 
// We will retain the CSS variables by scoping them or just adding them to a wrapper. Actually, we can just prefix them!
// Let's replace variable usages that conflict, wait, the AI portal uses var(--card-bg), var(--card-border). 
// The main site might use different vars, but the AI CSS uses standard variables in its root. 
// Let's just create an overarching .ai-services-wrapper for variables

const vars = `
.ai-services-wrapper {
    --ai-primary: #6366f1;
    --ai-primary-hover: #4f46e5;
    --ai-bg: transparent;
    --ai-card-bg: rgba(17, 24, 39, 0.7);
    --ai-card-border: rgba(255, 255, 255, 0.08);
    --ai-text-main: #f9fafb;
    --ai-text-muted: #9ca3af;
    --ai-glass: blur(12px) saturate(180%);
}
`;

// Replace all usages of these variables in the aiCss
aiCss = aiCss.replace(/var\(--primary\)/g, 'var(--ai-primary)');
aiCss = aiCss.replace(/var\(--primary-hover\)/g, 'var(--ai-primary-hover)');
aiCss = aiCss.replace(/var\(--bg\)/g, 'var(--ai-bg)');
aiCss = aiCss.replace(/var\(--card-bg\)/g, 'var(--ai-card-bg)');
aiCss = aiCss.replace(/var\(--card-border\)/g, 'var(--ai-card-border)');
aiCss = aiCss.replace(/var\(--text-main\)/g, 'var(--ai-text-main)');
aiCss = aiCss.replace(/var\(--text-muted\)/g, 'var(--ai-text-muted)');
aiCss = aiCss.replace(/var\(--glass\)/g, 'var(--ai-glass)');

// Prefix Classes to avoid conflicts
const prefixMap = {
    '.search-container': '.ai-search-container',
    '.search-input': '.ai-search-input',
    '.search-icon': '.ai-search-icon',
    '.badge': '.ai-badge',
    '.badge-new': '.ai-badge-new',
    '.badge-beta': '.ai-badge-beta',
    '.no-results': '.ai-no-results',
    '.grid': '.ai-grid', // Careful with simple 'grid', we must replace exactly '.grid {' and '.grid ' etc.
    '.card': '.ai-card', // Very generic, must prefix
    '.card-icon': '.ai-card-icon',
    '.card-tag': '.ai-card-tag',
    '.card-footer': '.ai-card-footer',
};

// Apply prefixes to CSS strictly
for (let [orig, prefixed] of Object.entries(prefixMap)) {
    // we match ClassName exactly (not parts of others like .card-body if we are doing .card)
    // using regex boundary wouldn't work easily on . so we just use negative lookaheads
    const regex = new RegExp(`\\${orig}(?![a-zA-Z0-9_-])`, 'g');
    aiCss = aiCss.replace(regex, prefixed);
}

// Ensure the new CSS is wrapped clearly
const finalCssToAppend = `\n\n/* ======================================================== */\n/* AI SERVICES PORTAL MERGED CSS */\n/* ======================================================== */\n${vars}\n${aiCss}`;
fs.appendFileSync(cssPath, finalCssToAppend);

// 2. EXTRACT AND PREFIX HTML
const searchMatch = upgradeHtml.match(/<div class="search-container">([\s\S]*?)<\/div>\s*<div class="grid" id="toolGrid">/);
const gridMatch = upgradeHtml.match(/<div class="grid" id="toolGrid">([\s\S]*?)<\/div>\s*<\/section>/);

if (!searchMatch || !gridMatch) {
    console.error("Could not find search or grid in upgrade HTML");
    process.exit(1);
}

let searchHtml = '<div class="search-container">' + searchMatch[1] + '</div>';
let gridHtml = '<div class="grid" id="toolGrid">' + gridMatch[1] + '</div>';

// Replace paths: apps/bizwrite/index.html -> apps/bizwrite/index.html (Wait, they're already relative, so they're fine since we are in root!)
// But wait! Prefix the HTML classes too!
for (let [orig, prefixed] of Object.entries(prefixMap)) {
    // In HTML, classes are without the dot. 
    // orig is .card, so we look for "card"
    const origClass = orig.substring(1);
    const prefClass = prefixed.substring(1);
    
    // We match class="(something) origClass (something)"
    // Or just substring replace safely because these names are pretty specific "search-container"
    const regex = new RegExp(`\\b${origClass}\\b`, 'g');
    searchHtml = searchHtml.replace(regex, prefClass);
    gridHtml = gridHtml.replace(regex, prefClass);
}

// We will inject this into `#ai-services-tab`
const aiServicesWrapper = `
    <!-- AI Services Migrated Portal -->
    <div class="ai-services-wrapper">
        <div class="section-head" style="margin-bottom: 2rem;">
            <div class="ai-card-tag" style="text-align: center; margin-bottom: 10px;">Smart Digital Hub</div>
            <p style="text-align: center; color: var(--gray);">Access our suite of professional AI-powered tools designed to streamline your business and personal growth.</p>
        </div>
        ${searchHtml}
        ${gridHtml}
    </div>
`;

// Replace placeholder in main HTML
// The main html has:
// <div id="ai-services-tab" class="tab-content service-tab">
//     <div class="ai-services-placeholder">
//         <i class="fas fa-robot" style="font-size: 3rem; color: var(--primary);"></i>
//         <p>AI Powered Services Coming Soon!</p>
//     </div>
// </div>

const targetBlockRegEx = /<div id="ai-services-tab" class="tab-content service-tab">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const replacement = `<div id="ai-services-tab" class="tab-content service-tab">\n${aiServicesWrapper}\n            </div>\n        </div>\n    </section>`;
mainHtml = mainHtml.replace(targetBlockRegEx, replacement);
fs.writeFileSync(mainHtmlPath, mainHtml);

// 3. JS MERGING
const scriptLogic = `

// ─── AI PORTAL TOOL SEARCH ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const aiSearchInput = document.getElementById('toolSearch');
    const aiToolCards = document.querySelectorAll('.ai-card');
    const aiNoResults = document.getElementById('noResults');

    if (aiSearchInput) {
        aiSearchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            let hasVisible = false;

            aiToolCards.forEach(card => {
                const name = card.getAttribute('data-name');
                if (name.includes(term)) {
                    card.style.display = 'flex';
                    hasVisible = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (aiNoResults) {
                aiNoResults.style.display = hasVisible ? 'none' : 'block';
            }
        });
    }
});
`;

fs.appendFileSync(jsPath, scriptLogic);

console.log("Merge script complete!");
