const fs = require('fs');

const files = ['index.html', 'kitchen.html', 'driver.html', 'admin.html'];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let idx = 0;
  console.log(`\n=== Testing ${file} ===`);
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    if (!scriptContent.trim()) continue;
    idx++;
    try {
      new Function(scriptContent);
      console.log(`✅ ${file} Script #${idx} OK!`);
    } catch (err) {
      console.error(`❌ ${file} Script #${idx} ERROR:`, err.message);
    }
  }
}
