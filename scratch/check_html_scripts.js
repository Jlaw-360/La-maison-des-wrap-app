const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Extract all script tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  const scriptContent = match[1];
  if (!scriptContent.trim()) continue;
  scriptIndex++;
  console.log(`Checking Script #${scriptIndex}... (length: ${scriptContent.length})`);
  try {
    new Function(scriptContent);
    console.log(`✅ Script #${scriptIndex} compiled successfully with NO syntax errors!`);
  } catch (err) {
    console.error(`❌ SYNTAX ERROR in Script #${scriptIndex}:`, err.message);
    // Print line of error
    console.error(err.stack);
  }
}
