const fs = require('fs');

console.log("Applying Nandos gourmet warm design to web app...");

function applyNandosThemeToHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Update CSS Theme Variables and Global Styles
  const oldRootRegex = /:root\s*\{[\s\S]*?body\s*\{[\s\S]*?padding-bottom:\s*95px;\s*\}/;
  
  const newRootAndBody = `:root {
      --bg-main: #FAF7F2;
      --bg-surface: #F2ECE1;
      --bg-card: #FFFFFF;
      --bg-card-hover: #FFF9F5;
      --primary: #E34A26;
      --primary-hover: #CC3814;
      --primary-glow: rgba(227, 74, 38, 0.25);
      --accent-gold: #E5A93C;
      --accent-green: #22C55E;
      --text-white: #1C1917;
      --text-body: #57534E;
      --text-muted: #8C857B;
      --border-subtle: #EBE5DA;
      --font-heading: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      background-color: #EFE9DE;
      color: var(--text-white);
      font-family: var(--font-body);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding-bottom: 95px;
    }`;

  html = html.replace(oldRootRegex, newRootAndBody);

  // Update app-container styling
  html = html.replace(
    /box-shadow:\s*0\s*0\s*60px\s*rgba\(0,\s*0,\s*0,\s*0\.9\);/,
    'box-shadow: 0 12px 48px rgba(90, 70, 50, 0.12);'
  );

  // Update top sticky header to warm porcelain glass
  html = html.replace(
    /background:\s*rgba\(12,\s*12,\s*14,\s*0\.92\);/,
    'background: rgba(250, 247, 242, 0.94);'
  );

  // Update floating bottom nav to rounded floating pill container
  html = html.replace(
    /\.bottom-nav\s*\{[\s\S]*?padding:\s*10px\s*18px\s*18px\s*18px;\s*\}/,
    `.bottom-nav {
      position: fixed;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 448px;
      background: #FFFFFF;
      border: 1px solid #EBE5DA;
      border-radius: 40px;
      padding: 8px 16px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;
      box-shadow: 0 10px 30px rgba(90, 70, 50, 0.14);
    }`
  );

  // Update nav-item active color
  html = html.replace(
    /\.nav-item\.active\s*\{[\s\S]*?\}/,
    `.nav-item.active {
      color: var(--primary);
    }
    .nav-item.active .nav-icon {
      color: var(--primary);
      transform: scale(1.1);
    }`
  );

  // Update center QR / Cart floating button
  html = html.replace(
    /\.center-scan-btn\s*\{[\s\S]*?\}/,
    `.center-scan-btn {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E34A26 0%, #C43818 100%);
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(227, 74, 38, 0.4);
      margin-top: -24px;
      cursor: pointer;
      border: 3px solid #FAF7F2;
      transition: all 0.2s ease;
    }
    .center-scan-btn:hover {
      transform: scale(1.06);
    }`
  );

  // Update dish card styling for clean white cards with subtle shadow
  html = html.replace(
    /\.dish-card\s*\{[\s\S]*?transition:\s*all\s*0\.15s\s*ease;\s*\}/,
    `.dish-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 16px rgba(90, 70, 50, 0.04);
    }`
  );

  html = html.replace(
    /\.dish-card:hover\s*\{[\s\S]*?\}/,
    `.dish-card:hover {
      background: var(--bg-card-hover);
      border-color: rgba(227, 74, 38, 0.3);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(227, 74, 38, 0.08);
    }`
  );

  // Update add-icon-btn to vibrant orange circle + button like Nando's
  html = html.replace(
    /\.add-icon-btn\s*\{[\s\S]*?\}/,
    `.add-icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      transition: transform 0.15s ease, background 0.15s ease;
      box-shadow: 0 4px 10px rgba(227, 74, 38, 0.35);
    }
    .add-icon-btn:hover {
      transform: scale(1.1);
      background: var(--primary-hover);
    }`
  );

  // Update Home View HTML Structure to Nando's Layout
  const homeViewStart = html.indexOf('<div id="view-home" class="app-view active">');
  const homeViewEnd = html.indexOf('<div id="view-menu" class="app-view">', homeViewStart);

  if (homeViewStart !== -1 && homeViewEnd !== -1) {
    const newHomeView = `<div id="view-home" class="app-view active">
      <!-- 1. Top Brand Header with Notification & Account -->
      <div class="top-header" style="background: transparent; border-bottom: none; padding-top: 16px;">
        <div class="brand-meta" onclick="switchTab('home')">
          <img src="/logo.png" alt="Logo" class="brand-logo-img" style="width: 40px; height: 40px; border-radius: 12px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div class="brand-text">
            <h1 style="font-size: 16px; font-weight: 800; color: #1C1917; line-height: 1.2;">La Maison des Wraps</h1>
            <p style="font-size: 11px; color: var(--primary); font-weight: 600;">Grillé au Four Tandoori · Drummondville</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="pill-btn" onclick="openQrRewardsModal()" style="width: 38px; height: 38px; border-radius: 50%; padding: 0; justify-content: center; background: #FFFFFF; border: 1px solid #EBE5DA; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <i class="fa-regular fa-bell" style="font-size: 15px; color: #1C1917;"></i>
          </button>
          <button class="pill-btn" onclick="switchTab('profile')" style="width: 38px; height: 38px; border-radius: 50%; padding: 0; justify-content: center; background: #FFFFFF; border: 1px solid #EBE5DA; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <i class="fa-regular fa-user" style="font-size: 15px; color: #1C1917;"></i>
          </button>
        </div>
      </div>

      <!-- 2. Delivery Address Selector Card (Nando's Style) -->
      <div style="margin: 6px 18px 14px 18px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 20px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 14px rgba(90, 70, 50, 0.04); cursor: pointer;" onclick="openAddressModal()">
        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #FFF2ED; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-location-dot" style="color: var(--primary); font-size: 14px;"></i>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px;">Livrer à / Deliver to</div>
            <div id="homeDeliveryAddressDisplay" style="font-size: 13px; font-weight: 700; color: #1C1917; display: flex; align-items: center; gap: 4px;">
              998 110e Avenue, Drummondville <i class="fa-solid fa-chevron-down" style="font-size: 10px; color: var(--primary);"></i>
            </div>
          </div>
        </div>
        <div style="width: 34px; height: 34px; border-radius: 50%; background: #FAF7F2; display: flex; align-items: center; justify-content: center;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 13px; color: #57534E;"></i>
        </div>
      </div>

      <!-- 3. Fulfillment Mode Selector (Livraison vs Ramassage) -->
      <div style="margin: 0 18px 14px 18px; background: #EDE7DC; border-radius: 14px; padding: 4px; display: flex; gap: 4px;">
        <button id="btnFulfillDelivery" onclick="setFulfillment('delivery')" style="flex: 1; padding: 8px; border-radius: 10px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #1C1917; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
          🛵 Livraison Directe
        </button>
        <button id="btnFulfillPickup" onclick="setFulfillment('pickup')" style="flex: 1; padding: 8px; border-radius: 10px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: #78716C;">
          🏬 Ramassage au Resto
        </button>
      </div>

      <!-- 4. Hero Flame-Grilled Promo Banner (Nando's Bold Showcase) -->
      <div style="margin: 0 18px 18px 18px; border-radius: 24px; background: linear-gradient(135deg, #D33A18 0%, #E34A26 100%); padding: 20px; color: #FFFFFF; position: relative; overflow: hidden; box-shadow: 0 10px 28px rgba(227, 74, 38, 0.32); display: flex; align-items: center;">
        <div style="flex: 1; z-index: 2; padding-right: 8px;">
          <span style="background: rgba(0,0,0,0.25); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 12px; font-size: 9px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; margin-bottom: 8px;">AU FEU TANDOOR</span>
          <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; line-height: 1.15; margin-bottom: 6px; color: #FFFFFF;">Wraps Grillés au Feu.<br>Saveurs Intenses.</h2>
          <p style="font-size: 11px; opacity: 0.9; margin-bottom: 14px; font-weight: 500;">Pain Naan ou Tortilla fait maison avec trio frites & boisson.</p>
          <button onclick="switchTab('menu')" style="background: #1C1917; color: #FFFFFF; border: none; padding: 9px 18px; border-radius: 24px; font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            Commander <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
          </button>
        </div>
        <div style="width: 130px; height: 130px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.1); border: 3px solid rgba(255,255,255,0.3); flex-shrink: 0; box-shadow: 0 6px 20px rgba(0,0,0,0.25);">
          <img src="/assets/food/trio_naan_poulet_tikka.png" alt="Signature Dish" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/logo.png'">
        </div>
      </div>

      <!-- 5. Category Pills Bar (Nando's Rounded Squircles) -->
      <div style="margin-bottom: 20px;">
        <div style="padding: 0 18px 10px 18px; font-size: 13px; font-weight: 800; color: #1C1917; display: flex; justify-content: space-between; align-items: center;">
          <span>Catégories</span>
          <span onclick="switchTab('menu')" style="font-size: 11px; color: var(--primary); cursor: pointer; font-weight: 700;">Tout Voir →</span>
        </div>
        <div style="display: flex; gap: 10px; overflow-x: auto; padding: 0 18px 6px 18px; scrollbar-width: none;" class="no-scrollbar">
          <div onclick="selectCategoryFilter('all')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1.5px solid var(--primary); border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(227, 74, 38, 0.08);">
            <div style="font-size: 22px;">🔥</div>
            <span style="font-size: 11px; font-weight: 700; color: var(--primary);">Favoris</span>
          </div>
          <div onclick="selectCategoryFilter('wraps')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🌯</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">Wraps</span>
          </div>
          <div onclick="selectCategoryFilter('curry')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🍛</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">Curry</span>
          </div>
          <div onclick="selectCategoryFilter('biryani')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🍚</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">Biryani</span>
          </div>
          <div onclick="selectCategoryFilter('assiettes')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🍽️</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">Assiettes</span>
          </div>
          <div onclick="selectCategoryFilter('burgers')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🍔</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">Burgers</span>
          </div>
          <div onclick="selectCategoryFilter('poutines')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🍟</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">Poutines</span>
          </div>
          <div onclick="selectCategoryFilter('sides')" style="min-width: 72px; padding: 12px 8px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size: 22px;">🥟</div>
            <span style="font-size: 11px; font-weight: 700; color: #1C1917;">À Côté</span>
          </div>
        </div>
      </div>

      <!-- 6. Popular Picks (Choix Populaires) - 3 Cards with Photo & Round Orange + Button -->
      <div style="margin-bottom: 22px;">
        <div style="padding: 0 18px 12px 18px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #1C1917;">⭐ Choix Populaires</h3>
          <span onclick="switchTab('menu')" style="font-size: 12px; color: var(--primary); cursor: pointer; font-weight: 700;">Voir Tout →</span>
        </div>
        <div id="homeFeaturedGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 18px;">
          <!-- Rendered dynamically by renderHomeFeatured -->
        </div>
      </div>

      <!-- 7. La Maison Rewards Banner (Nando's Loyalty Style) -->
      <div style="margin: 0 18px 24px 18px; background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 22px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 16px rgba(90, 70, 50, 0.05);">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #FFF2ED; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span style="font-size: 26px;">🌶️</span>
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 13px; font-weight: 800; color: #1C1917; margin-bottom: 2px;">Club Privilège La Maison</h4>
          <p style="font-size: 11px; color: var(--text-body); line-height: 1.3;">Gagnez des points à chaque commande et débloquez des repas gratuits.</p>
        </div>
        <button onclick="switchTab('scan')" style="background: #1C1917; color: #FFFFFF; border: none; padding: 8px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          Échanger
        </button>
      </div>

      <!-- 8. Restaurant Info Footer Card -->
      <div style="margin: 0 18px 24px 18px; background: #FAF7F2; border: 1px solid #EDE8DE; border-radius: 20px; padding: 14px 16px; font-size: 11px; color: var(--text-muted); text-align: center;">
        <div style="font-weight: 700; color: #1C1917; margin-bottom: 4px;">📍 La Maison des Wraps Drummondville</div>
        <div>998 110e Avenue, Drummondville, QC J2B 6X2</div>
        <div>📞 (819) 850-3972 · Ouvert 7 jours sur 7</div>
      </div>
    </div>\n\n`;

    html = html.substring(0, homeViewStart) + newHomeView + html.substring(homeViewEnd);
  }

  // Update renderHomeFeatured to output Nando's 3-card layout
  html = html.replace(
    /document\.getElementById\('homeFeaturedGrid'\)\.innerHTML = featured\.map\(d => `[\s\S]*?`\)\.join\(''\);/,
    `document.getElementById('homeFeaturedGrid').innerHTML = featured.slice(0, 3).map(d => \`
    <div style="background: #FFFFFF; border: 1px solid #EBE5DA; border-radius: 18px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 14px rgba(90, 70, 50, 0.04); cursor: pointer; transition: transform 0.15s ease;" onclick="openDishModal('\${d.name_fr.replace(/'/g, "\\\\'")}')">
      <div style="width: 100%; height: 85px; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #F3EFE6;">
        <img src="\${d.image || '/assets/food/wrap_kebab_poulet.png'}" alt="\${d.name_fr}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/logo.png'">
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #1C1917; line-height: 1.2; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 26px;">
        \${d.name_fr}
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
        <span style="font-size: 12px; font-weight: 800; color: var(--primary);">$\${d.price.toFixed(2)}</span>
        <button style="width: 26px; height: 26px; border-radius: 50%; background: var(--primary); color: #FFFFFF; border: none; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 6px rgba(227, 74, 38, 0.4); cursor: pointer;">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  \`).join('');`
  );

  fs.writeFileSync(filePath, html);
  console.log('Successfully updated HTML file with Nandos theme: ' + filePath);
}

applyNandosThemeToHtml('index.html');
applyNandosThemeToHtml('app_preview/index.html');

