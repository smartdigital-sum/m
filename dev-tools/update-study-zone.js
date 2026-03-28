const fs = require('fs');

const mainHtmlPath = 'index.html';
let mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');

const newGridContent = `
                <div class="study-zone-grid">
                    <!-- Khelona Hub Card (Featured) -->
                    <div class="study-zone-card" style="border: 2px solid var(--primary); background: rgba(99, 102, 241, 0.05);">
                        <div class="demo-icon" style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; width: 70px; height: 70px; margin: 0 auto 15px; border-radius: 16px; background: linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎮</div>
                        <h3 style="font-family: 'Fredoka One', cursive; margin-bottom: 5px; color: var(--primary);">Khelona Hub</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Explore all 10+ educational games for kids.</p>
                        <a href="khelona/index.html" class="btn btn-primary btn-sm" style="margin-top: 20px; width: 100%; border-radius: 50px;"><i class="fas fa-play-circle"></i> Play More</a>
                    </div>
                    
                    <!-- A-Z Speller -->
                    <div class="study-zone-card">
                        <div class="demo-icon" style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px; background: #fff0f0; border: 1px solid #ffd1d1;">🔤</div>
                        <h3>A-Z Speller</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Travel through every letter of the alphabet!</p>
                        <a href="khelona/games/a-z-speller/index.html" class="btn btn-outline-primary btn-sm" style="margin-top: 20px; width: 100%; border-radius: 50px;"><i class="fas fa-external-link-alt"></i> Play</a>
                    </div>

                    <!-- Number Speller -->
                    <div class="study-zone-card">
                        <div class="demo-icon" style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px; background: #f0f5ff; border: 1px solid #c9dfff;">🔢</div>
                        <h3>Number Speller</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Count the dots and spell the number!</p>
                        <a href="khelona/games/number-speller/index.html" class="btn btn-outline-primary btn-sm" style="margin-top: 20px; width: 100%; border-radius: 50px;"><i class="fas fa-external-link-alt"></i> Play</a>
                    </div>

                    <!-- Color Match -->
                    <div class="study-zone-card">
                        <div class="demo-icon" style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px; background: #fff5f0; border: 1px solid #ffdec9;">🎨</div>
                        <h3>Color Match</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Tap the right color name — fast and fun!</p>
                        <a href="khelona/games/color-match/index.html" class="btn btn-outline-primary btn-sm" style="margin-top: 20px; width: 100%; border-radius: 50px;"><i class="fas fa-external-link-alt"></i> Play</a>
                    </div>

                    <!-- Memory Match -->
                    <div class="study-zone-card">
                        <div class="demo-icon" style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 12px; background: #f8f0ff; border: 1px solid #e7c9ff;">🧠</div>
                        <h3>Memory Match</h3>
                        <p style="color: var(--gray); font-size: 14px; margin-top: 10px;">Find matching pairs of animals & fruits!</p>
                        <a href="khelona/games/memory-match/index.html" class="btn btn-outline-primary btn-sm" style="margin-top: 20px; width: 100%; border-radius: 50px;"><i class="fas fa-external-link-alt"></i> Play</a>
                    </div>
                </div>
`;

// Extract Study Zone Section
const regex = /(<div class="study-zone-grid">[\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const match = mainHtml.match(regex);
if (match) {
    mainHtml = mainHtml.replace(match[1], newGridContent);
    fs.writeFileSync(mainHtmlPath, mainHtml);
    console.log("Study Zone updated correctly!");
} else {
    console.error("Could not find the study-zone-grid to replace");
    process.exit(1);
}
