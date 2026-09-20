const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Starting Hacktoberfest Showcase Automated Verification Suite...\n');

let failed = 0;
let passed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✔ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✖ [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

const rootDir = path.resolve(__dirname, '..');

// Test 1: Core Files Exist
console.log('1. Verifying Core Project Files:');
const requiredFiles = ['index.html', 'style.css', 'script.js', 'health.html', '_headers', 'vercel.json', 'nginx.conf'];
requiredFiles.forEach((file) => {
  const filePath = path.join(rootDir, file);
  assert(fs.existsSync(filePath), `File exists: ${file}`);
});

// Test 2: JavaScript Syntax Check
console.log('\n2. Verifying JavaScript Syntax:');
try {
  execSync('node --check script.js', { cwd: rootDir, stdio: 'pipe' });
  assert(true, 'script.js has valid JavaScript syntax');
} catch (err) {
  assert(false, 'script.js syntax check', err.message);
}

// Test 3: HTML Content and Performance Attributes
console.log('\n3. Verifying index.html Performance and SEO Attributes:');
const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

assert(html.includes('lang="en"'), 'HTML has valid lang="en" declaration');
assert(html.includes('<title>'), 'HTML contains a descriptive <title>');
assert(html.includes('name="description"'), 'HTML contains a meta description');
assert(html.includes('dns-prefetch'), 'HTML contains DNS prefetch resource hints');
assert(html.includes('preconnect'), 'HTML contains preconnect resource hints');

// Verify all script tags have defer
const scriptMatches = html.match(/<script[^>]*src=[^>]*>/g) || [];
const unDeferredScripts = scriptMatches.filter((tag) => !tag.includes('defer'));
assert(unDeferredScripts.length === 0, 'All external and local script tags are deferred', `${unDeferredScripts.length} un-deferred`);

// Verify original images and formats
console.log('\n4. Verifying Original Image Assets and Formats:');
const imgMatches = html.match(/<img[^>]+>/g) || [];
let allSrcsExist = true;

imgMatches.forEach((imgTag) => {
  const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
  if (srcMatch && !srcMatch[1].startsWith('http') && !srcMatch[1].startsWith('data:')) {
    const localImg = path.join(rootDir, srcMatch[1]);
    if (!fs.existsSync(localImg)) {
      allSrcsExist = false;
    }
  }
});
assert(allSrcsExist, 'All local images referenced in <img> tags exist on disk');

// Verify original formats preserved
assert(fs.existsSync(path.join(rootDir, 'img/acm-logo.jpeg')), 'acm-logo.jpeg preserved in original JPEG format');
assert(fs.existsSync(path.join(rootDir, 'img/speaker.jpeg')), 'speaker.jpeg preserved in original JPEG format');
assert(fs.existsSync(path.join(rootDir, 'img/hero-bg.webp')), 'hero-bg.webp preserved in original WebP format');
assert(fs.existsSync(path.join(rootDir, 'img/mask-1.webp')), 'mask-1.webp preserved in original WebP format');
assert(fs.existsSync(path.join(rootDir, 'img/mask-2.webp')), 'mask-2.webp preserved in original WebP format');
assert(!fs.existsSync(path.join(rootDir, 'img/speaker.webp')), 'No converted WebP for JPEG speaker image');
assert(!fs.existsSync(path.join(rootDir, 'img/acm-logo.webp')), 'No converted WebP for JPEG ACM logo');

// Test 5: CSS Performance and Cleanliness
console.log('\n5. Verifying style.css Cleanliness and Performance:');
const css = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
assert(!css.includes('.modal-overlay'), 'Orphaned modal CSS (.modal-overlay) removed');
assert(!css.includes('.digital-ticket'), 'Orphaned ticket pass CSS (.digital-ticket) removed');
assert(css.includes('content-visibility: auto'), 'Modern content-visibility performance optimization present');

// Test 6: Health Endpoint
console.log('\n6. Verifying Load Balancer Health Endpoint:');
const healthHtml = fs.readFileSync(path.join(rootDir, 'health.html'), 'utf-8');
assert(healthHtml.includes('Status: Healthy') || healthHtml.includes('OK'), 'health.html contains valid healthy response');

// Test 7: FAQ Two-Column Layout & GitHub Repositories Integration
console.log('\n7. Verifying FAQ Two-Column Layout & GitHub Dynamic Repositories:');
const scriptContent = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf-8');

assert(html.includes('class="faq-layout"'), 'index.html contains .faq-layout container');
assert(html.includes('id="githubRepoList"'), 'index.html contains #githubRepoList for dynamic repos');
assert(css.includes('.faq-layout'), 'style.css defines .faq-layout grid styling');
assert(css.includes('.repo-card'), 'style.css defines .repo-card styling');
assert(css.includes('@media (max-width: 900px)'), 'style.css contains responsive stacking breakpoint');
assert(scriptContent.includes('initGitHubRepos'), 'script.js implements initGitHubRepos()');
assert(scriptContent.includes('https://api.github.com/users/hacktober2k26/repos'), 'script.js fetches public GitHub API');
assert(!scriptContent.includes('const repositories = [') && !scriptContent.includes('const repos = ['), 'Repositories are not hardcoded in JavaScript');
assert(!scriptContent.includes('ghp_') && !scriptContent.includes('github_pat_'), 'No private GitHub token is exposed');

// Test 8: Technical Team Page & Data Structure
console.log('\n8. Verifying Technical Team Page & Data Structure:');
const teamDataPath = path.join(rootDir, 'team-data.js');
assert(fs.existsSync(teamDataPath), 'team-data.js exists');

let teamMembersData = [];
try {
  const { teamMembers } = require(teamDataPath);
  teamMembersData = teamMembers;
  assert(Array.isArray(teamMembersData) && teamMembersData.length === 6, 'team-data.js defines exactly 6 team members');
} catch (e) {
  assert(false, 'team-data.js exports teamMembers array', e.message);
}

// Verify each member has name, designation, image and image exists
let allMembersValid = true;
teamMembersData.forEach((m, idx) => {
  if (!m.name || !m.designation || !m.image) {
    allMembersValid = false;
  }
  const imgPath = path.join(rootDir, m.image);
  if (!fs.existsSync(imgPath)) {
    allMembersValid = false;
  }
});
assert(allMembersValid, 'All 6 team members have valid name, designation, and existing image assets');

// Verify tech-team/index.html exists and contains essential sections
const techTeamHtmlPath = path.join(rootDir, 'tech-team', 'index.html');
assert(fs.existsSync(techTeamHtmlPath), 'tech-team/index.html page exists');
const techTeamHtml = fs.readFileSync(techTeamHtmlPath, 'utf-8');
assert(techTeamHtml.includes('id="tech-team"'), 'tech-team/index.html contains #tech-team section');
assert(techTeamHtml.includes('id="teamGrid"'), 'tech-team/index.html contains #teamGrid');

// Verify footer link in index.html
assert(html.includes('Tech Team') && html.includes('tech-team'), 'index.html footer contains "Tech Team" quick link');

// Verify CSS rules for team grid and responsive breakpoints
assert(css.includes('.team-grid'), 'style.css defines .team-grid');
assert(css.includes('.team-card'), 'style.css defines .team-card');
assert(css.includes('@media (max-width: 992px)'), 'style.css defines tablet breakpoint for team grid');
assert(css.includes('@media (max-width: 640px)'), 'style.css defines mobile breakpoint for team grid');

// Test 9: Homepage Animated Marquee Banner & UI Density Verification
console.log('\n9. Verifying Homepage Animated Marquee Banner & UI Density:');
assert(html.includes('class="tech-marquee-banner"'), 'index.html contains .tech-marquee-banner');

// Verify banner location is between #details and audience section
const detailsIndex = html.indexOf('id="details"');
const bannerIndex = html.indexOf('class="tech-marquee-banner"');
const audienceIndex = html.indexOf('TARGET AUDIENCE');
assert(detailsIndex < bannerIndex && bannerIndex < audienceIndex, 'Banner is placed precisely between Event/Speaker section and Target Audience section');

// Verify banner is NOT in tech-team/index.html
assert(!techTeamHtml.includes('class="tech-marquee-banner"'), 'Banner is strictly on the homepage and NOT on /tech-team page');

// Verify CSS animation and reduced-motion support
assert(css.includes('.tech-marquee-banner'), 'style.css defines .tech-marquee-banner');
assert(css.includes('@keyframes marqueeScroll'), 'style.css defines marqueeScroll keyframes');
assert(css.includes('prefers-reduced-motion'), 'style.css respects prefers-reduced-motion');

// Verify no scale or zoom hacks are used
assert(!css.includes('transform: scale(0.') && !css.includes('zoom: 0.'), 'No transform: scale() or zoom: CSS hacks used');
assert(css.includes('font-size: 14.5px'), 'style.css sets refined 14.5px base font size');
assert(css.includes('max-width: 1160px'), 'style.css sets compact 1160px container max-width');
assert(css.includes('padding: 3.75rem 0'), 'style.css reduces section padding from 6rem to 3.75rem');

console.log(`\n========================================`);
console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
