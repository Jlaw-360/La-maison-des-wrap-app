const fs = require('fs');
const path = require('path');

console.log("Preparing clean public/ directory for instant Cloudflare deployment...");

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const filesToCopy = [
  'index.html',
  'kitchen.html',
  'driver.html',
  'admin.html',
  'privacy.html',
  'logo.png',
  'manifest.json',
  'menu.json',
  '_headers'
];

const foldersToCopy = [
  'app_preview',
  'assets',
  'data'
];

filesToCopy.forEach(f => {
  if (fs.existsSync(f)) {
    fs.copyFileSync(f, path.join(publicDir, f));
    console.log('✓ Copied ' + f);
  }
});

foldersToCopy.forEach(d => {
  if (fs.existsSync(d)) {
    copyRecursive(d, path.join(publicDir, d));
    console.log('✓ Copied folder ' + d);
  }
});

// Remove any conflicting _redirects in public if present
if (fs.existsSync(path.join(publicDir, '_redirects'))) {
  fs.unlinkSync(path.join(publicDir, '_redirects'));
  console.log('✓ Removed conflicting public/_redirects');
}

// Update wrangler.toml to use directory = "./public"
let wranglerToml = fs.readFileSync('wrangler.toml', 'utf8');
wranglerToml = wranglerToml.replace(/directory\s*=\s*"\."/g, 'directory = "./public"');
fs.writeFileSync('wrangler.toml', wranglerToml);
console.log('✓ Updated wrangler.toml with [assets] directory = "./public"');

