const fs = require('fs');
const path = require('path');

// 1. Copy menu.json into app_preview folder
const menuSrc = path.join(__dirname, '../data/menu.json');
const menuDest = path.join(__dirname, '../app_preview/menu.json');
fs.copyFileSync(menuSrc, menuDest);
console.log("✅ Copied menu.json to app_preview/menu.json");

const menu = JSON.parse(fs.readFileSync(menuSrc, 'utf8'));

// 2. Read existing index.html
const indexPath = path.join(__dirname, '../app_preview/index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Replace menuItems initialization in index.html to embed the full array directly
const menuJsonString = JSON.stringify(menu);
const embeddedMenuCode = `
    const RAW_MENU_DATA = ${menuJsonString};
    menuItems = RAW_MENU_DATA;
    renderCategories();
    renderMenu();
`;

indexHtml = indexHtml.replace(
  /\/\/ Load Full 59 Dishes Menu JSON[\s\S]*?renderMenu\(\);\s*\}\);/,
  `// Embedded Full 59 Dishes Menu directly for 100% reliable deployment
${embeddedMenuCode}`
);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log(`✅ Embedded ${menu.length} dishes directly into app_preview/index.html`);
