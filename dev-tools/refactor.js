const fs = require('fs');

const FILE_PATH = 'index.html';
let html = fs.readFileSync(FILE_PATH, 'utf8');

// Helper to extract a section by ID and its outer HTML
function extractSection(id) {
    const regex = new RegExp(`(<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>)`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
}

// Extracted outer HTMLs
const demosOuter = extractSection('demos');
const gamesOuter = extractSection('games');
const servicesOuter = extractSection('services');

// If we can't find them, abort safely
if (!demosOuter || !gamesOuter || !servicesOuter) {
    console.error("Could not find all sections to refactor!");
    process.exit(1);
}

// Extract the .demos-grid content
const demosGridMatch = demosOuter.match(/<div class="demos-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
const demosGridContent = demosGridMatch ? demosGridMatch[1] : '';

// Extract the .games-grid content
const gamesGridMatch = gamesOuter.match(/<div class="games-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
const gamesGridContent = gamesGridMatch ? gamesGridMatch[1] : '';

// Extract the .services-grid content
const servicesGridMatch = servicesOuter.match(/<div class="services-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);
const servicesGridContent = servicesGridMatch ? servicesGridMatch[1] : '';

// Now let's build the new sections!

const NEW_STUDY_ZONE = `
    <!-- ===== STUDY ZONE ===== -->
    <section class="study-zone-section" id="study-zone">
        <div class="container">
            <div class="section-head">
                <h2 class="section-title" data-en="Study Zone" data-as="ষ্টাডি জ'ন">Study Zone</h2>
                <p class="section-sub" data-en="Educational websites for kids" data-as="শিশুসকলৰ বাবে শিক্ষামূলক ৱেবছাইট">Educational websites for kids</p>
            </div>
            <div class="scroll-wrapper">
                <div class="study-zone-grid">
                    <div class="study-zone-card">
                        <div class="demo-icon icon-bg-school" style="font-size: 2rem; color: #fff; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px;"><i class="fas fa-child"></i></div>
                        <h3>Kids Math</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Fun math exercises.</p>
                        <a href="#" class="btn btn-primary btn-sm" style="margin-top: 20px;"><i class="fas fa-external-link-alt"></i> Visit Site</a>
                    </div>
                    <div class="study-zone-card">
                        <div class="demo-icon icon-bg-primary" style="font-size: 2rem; color: #fff; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px;"><i class="fas fa-book"></i></div>
                        <h3>Story Time</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Interactive stories.</p>
                        <a href="#" class="btn btn-primary btn-sm" style="margin-top: 20px;"><i class="fas fa-external-link-alt"></i> Visit Site</a>
                    </div>
                    <div class="study-zone-card">
                        <div class="demo-icon icon-bg-quiz" style="font-size: 2rem; color: #fff; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px;"><i class="fas fa-puzzle-piece"></i></div>
                        <h3>Puzzle Solving</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Brain teasers and puzzles.</p>
                        <a href="#" class="btn btn-primary btn-sm" style="margin-top: 20px;"><i class="fas fa-external-link-alt"></i> Visit Site</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const NEW_WEBSITES = `
    <!-- ===== WEBSITES (Demos & Games) ===== -->
    <section class="demos-section" id="websites">
        <div class="container">
            <div class="section-head">
                <h2 class="section-title" data-en="Websites" data-as="ৱেবছাইট">Websites</h2>
                <p class="section-sub" data-en="Check out our demo sites and interactive projects" data-as="আমাৰ ডেমো ছাইট আৰু ইণ্টাৰেক্টিভ প্ৰজেক্ট চাওক">Check out our demo sites and interactive projects</p>
                <div class="punch-widget-inline" data-id="games-hype" style="justify-content: center; margin: 1.5rem auto 0; width: fit-content; display: flex;">
                    <button class="punch-btn-sm" onclick="doPunch(this)">👊</button>
                    <span class="punch-count-sm">0</span>
                    <span class="punch-label-sm" data-en="Fun!" data-as="মজা!">Fun!</span>
                </div>
            </div>
            
            <div class="tab-container">
                <button class="filter-btn active" onclick="switchTab('website', 'demo-sites-tab', this)">Demo Sites</button>
                <button class="filter-btn" onclick="switchTab('website', 'games-projects-tab', this)">Games & Projects</button>
            </div>
            
            <div id="demo-sites-tab" class="tab-content website-tab active">
                <div class="scroll-wrapper">
                    <div class="demos-grid">
                        ${demosGridContent}
                    </div>
                </div>
            </div>

            <div id="games-projects-tab" class="tab-content website-tab">
                <div class="scroll-wrapper">
                    <div class="games-grid" style="padding-top: 10px;">
                        ${gamesGridContent}
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const NEW_SERVICES = `
    <!-- ===== SERVICES ===== -->
    <section class="services-section" id="services">
        <div class="container">
            <div class="section-head">
                <h2 class="section-title" data-en="Our Services" data-as="আমাৰ সেৱাসমূহ">Our Services</h2>
                <p class="section-sub" data-en="Comprehensive digital solutions for everyone" data-as="সকলোৰ বাবে সম্পূৰ্ণ ডিজিটেল সমাধান">Comprehensive digital solutions for everyone</p>
            </div>

            <div class="tab-container">
                <button class="filter-btn active" onclick="switchTab('service', 'offline-services-tab', this)">Offline Services</button>
                <button class="filter-btn" onclick="switchTab('service', 'ai-services-tab', this)">AI Powered Services</button>
            </div>

            <div id="offline-services-tab" class="tab-content service-tab active">
                <div class="services-grid">
                    ${servicesGridContent}
                </div>
            </div>
            
            <div id="ai-services-tab" class="tab-content service-tab">
                <div class="ai-services-placeholder">
                    <i class="fas fa-robot" style="font-size: 3rem; color: var(--primary);"></i>
                    <p>AI Powered Services Coming Soon!</p>
                </div>
            </div>
        </div>
    </section>
`;

// Remove original sections safely by generating a sequence
// Since we want #updates -> #study-zone -> #websites -> #services
// Let's replace the whole block from #demos to #games with our new structured content, carefully leaving out calculator if possible.
// Actually, it's easier to just strip them all out, and inject the layout exactly after #updates.

// 1. Remove old sections from html
html = html.replace(demosOuter, '');
html = html.replace(gamesOuter, '');
html = html.replace(servicesOuter, '');

// Clean up any stray `</section><section class="demos-section" id="demos">` connection if it was there
html = html.replace(/<\/section>\s*<section class="demos-section" id="demos">/, '</section>\n');

// 2. Insert new blocks after #updates
const updatesOuter = extractSection('updates');
if (updatesOuter) {
    const replacement = updatesOuter + '\n' + NEW_STUDY_ZONE + '\n' + NEW_WEBSITES + '\n' + NEW_SERVICES;
    html = html.replace(updatesOuter, replacement);
}

// 3. Let's fix the Nav Menu to point to `#websites`
// It currently points to `#demos` and `#games`
html = html.replace(/<li><a href="#demos" class="nav-link"[^>]*>Websites<\/a><\/li>/, '<li><a href="#websites" class="nav-link" data-en="Websites" data-as="ৱেবছাইট">Websites</a></li>');
// Remove the Games nav link since it's now in websites
html = html.replace(/<li><a href="#games" class="nav-link"[^>]*>Games<\/a><\/li>/, '');

// 4. Remove the inline JS that reorders #demos at the bottom
html = html.replace(/const demosSection = document\.getElementById\('demos'\);[\s\S]*?updatesSection\.nextSibling\);\s*\}/, '// DOM reordering removed');

fs.writeFileSync(FILE_PATH, html);
console.log("Refactored successfully!");
