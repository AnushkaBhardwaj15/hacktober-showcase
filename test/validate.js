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

// Verify images have dimensions and proper lazy loading
console.log('\n4. Verifying Image Optimization & CLS Prevention:');
const imgMatches = html.match(/<img[^>]+>/g) || [];
let allHaveDims = true;
let allSrcsExist = true;

imgMatches.forEach((imgTag) => {
  const hasWidth = /width=["']?\d+["']?/.test(imgTag);
  const hasHeight = /height=["']?\d+["']?/.test(imgTag);
  if (!hasWidth || !hasHeight) {
    allHaveDims = false;
  }
  const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
  if (srcMatch && !srcMatch[1].startsWith('http') && !srcMatch[1].startsWith('data:')) {
    const localImg = path.join(rootDir, srcMatch[1]);
    if (!fs.existsSync(localImg)) {
      allSrcsExist = false;
    }
  }
});
assert(allHaveDims, 'All <img> tags define explicit width and height attributes (zero CLS)');
assert(allSrcsExist, 'All local images referenced in <img> tags exist on disk');

// Verify below-the-fold image lazy loading
assert(html.includes('loading="lazy"'), 'Below-the-fold images specify loading="lazy"');
assert(html.includes('decoding="async"'), 'Images specify decoding="async"');
assert(html.includes('fetchpriority="high"'), 'LCP Hero image specifies fetchpriority="high"');

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

console.log(`\n========================================`);
console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
