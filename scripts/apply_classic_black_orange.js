const fs = require('fs');

console.log("Applying classic Black & Orange theme with full dish images...");

function applyClassicBlackAndOrange(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Root theme variables: Permanent Black & Orange
  const oldRootRegex = /:root\s*\{[\s\S]*?body\s*\{[\s\S]*?padding-bottom:\s*95px;\s*\}/;
  
  const classicRootAndBody = `:root {
      --bg-main: #0C0C0E;
      --bg-surface: #151519;
      --bg-card: #1C1C22;
      --bg-card-hover: #262630;
      --primary: #FF5500;
      --primary-hover: #E04B00;
      --primary-glow: rgba(255, 85, 0, 0.35);
      --accent-gold: #E5A93C;
      --accent-green: #22C55E;
      --text-white: #FFFFFF;
      --text-body: #A5A5B2;
      --text-muted: #7A7A88;
      --border-subtle: rgba(255, 255, 255, 0.09);
      --font-heading: 'Plus Jakarta Sans', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      background-color: #060608;
      color: var(--text-white);
      font-family: var(--font-body);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding-bottom: 95px;
    }`;

  html = html.replace(oldRootRegex, classicRootAndBody);

  // App container
  html = html.replace(
    /box-shadow:\s*0\s*12px\s*48px\s*rgba\(90,\s*70,\s*50,\s*0\.12\);/,
    'box-shadow: 0 0 60px rgba(0, 0, 0, 0.9);'
  );

  // Top sticky header
  html = html.replace(
    /background:\s*rgba\(250,\s*247,\s*242,\s*0\.94\);/,
    'background: rgba(12, 12, 14, 0.94);'
  );

  // Bottom Navigation Bar
  html = html.replace(
    /\.bottom-nav\s*\{[\s\S]*?padding:\s*8px\s*16px;\s*[\s\S]*?box-shadow:\s*0\s*10px\s*30px\s*rgba\(90,\s*70,\s*50,\s*0\.14\);\s*\}/,
    `.bottom-nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 480px;
      background: rgba(18, 18, 22, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border-subtle);
      padding: 8px 16px 20px 16px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;
    }`
  );

  // Dish Card Styling with rich image display
  html = html.replace(
    /\.dish-card\s*\{[\s\S]*?box-shadow:\s*0\s*4px\s*16px\s*rgba\(90,\s*70,\s*50,\s*0\.04\);\s*\}/,
    `.dish-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 18px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }`
  );

  html = html.replace(
    /\.dish-card:hover\s*\{[\s\S]*?\}/,
    `.dish-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px var(--primary-glow);
    }`
  );

  // Add Button (+)
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
      transition: all 0.15s ease;
      box-shadow: 0 4px 12px var(--primary-glow);
    }
    .add-icon-btn:hover {
      transform: scale(1.1);
      background: var(--primary-hover);
    }`
  );

  // Classic Clean Home View
  const homeViewStart = html.indexOf('<div id="view-home" class="app-view active">');
  const homeViewEnd = html.indexOf('<div id="view-menu" class="app-view">', homeViewStart);

  if (homeViewStart !== -1 && homeViewEnd !== -1) {
    const classicHomeView = `<div id="view-home" class="app-view active">
      <!-- 1. Classic Brand Header -->
      <div class="top-header">
        <div class="brand-meta" onclick="switchTab('home')">
          <img src="/logo.png" alt="La Maison des Wraps" class="brand-logo-img" onerror="this.src='logo.png'">
          <div class="brand-text">
            <h1 style="color: #FFFFFF;">La Maison des Wraps</h1>
            <p style="color: var(--text-body);">998 110e Avenue, Drummondville</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="pill-btn" onclick="openAddressModal()">
            <i class="fa-solid fa-location-dot" style="color: var(--primary);"></i>
            <span id="headerAddressDisplay">Drummondville</span>
          </div>
          <div class="pill-btn" onclick="switchTab('profile')">
            <i class="fa-regular fa-user" style="color: var(--accent-gold);"></i>
          </div>
        </div>
      </div>

      <!-- 2. Store Status & Fulfillment Switch -->
      <div style="margin: 14px 18px 10px 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 8px #22C55E;"></span>
          <span style="font-size: 11px; font-weight: 700; color: #FFFFFF;">Ouvert aujourd'hui</span>
          <span style="font-size: 11px; color: var(--text-muted);">· 11h00 à 22h00</span>
        </div>
        <div style="font-size: 11px; color: var(--primary); font-weight: 700; cursor: pointer;" onclick="openAddressModal()">
          Changer adresse ▾
        </div>
      </div>

      <!-- Fulfillment Switch (Livraison vs Ramassage) -->
      <div style="margin: 0 18px 16px 18px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 4px; display: flex; gap: 4px;">
        <button id="btnFulfillDelivery" onclick="setFulfillment('delivery')" style="flex: 1; padding: 10px; border-radius: 10px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: var(--primary); color: #FFFFFF; box-shadow: 0 2px 8px var(--primary-glow);">
          🚗 Livraison Directe
        </button>
        <button id="btnFulfillPickup" onclick="setFulfillment('pickup')" style="flex: 1; padding: 10px; border-radius: 10px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-body);">
          🏬 Ramassage en Resto
        </button>
      </div>

      <!-- 3. Classic Signature Dish Showcase Banner -->
      <div style="margin: 0 18px 18px 18px; background: linear-gradient(135deg, #1C1C24 0%, #141418 100%); border: 1px solid rgba(255, 85, 0, 0.3); border-radius: 20px; padding: 18px; position: relative; overflow: hidden; display: flex; align-items: center; box-shadow: 0 8px 30px rgba(0,0,0,0.6);">
        <div style="flex: 1; z-index: 2; padding-right: 10px;">
          <span style="background: rgba(255, 85, 0, 0.15); border: 1px solid var(--primary); color: var(--primary); padding: 3px 8px; border-radius: 8px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 8px;">Four Tandoori Traditionnel</span>
          <h2 style="font-size: 18px; font-weight: 800; line-height: 1.2; margin-bottom: 6px; color: #FFFFFF;">Nos Wraps Naan & Kebabs Faits Maison</h2>
          <p style="font-size: 11px; color: var(--text-body); margin-bottom: 12px; line-height: 1.3;">Pains naan frais cuits sur place, viandes marinées et sauces savoureuses.</p>
          <button onclick="switchTab('menu')" style="background: var(--primary); color: #FFFFFF; border: none; padding: 9px 18px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px var(--primary-glow);">
            Voir le Menu Complet <i class="fa-solid fa-arrow-right" style="font-size: 10px;"></i>
          </button>
        </div>
        <div style="width: 120px; height: 120px; border-radius: 16px; overflow: hidden; background: #0C0C0E; border: 1.5px solid var(--border-subtle); flex-shrink: 0; box-shadow: 0 6px 20px rgba(0,0,0,0.5);">
          <img src="/assets/food/trio_naan_poulet_tikka.png" alt="Signature Naan" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/food/trio_naan_poulet_tikka.png'">
        </div>
      </div>

      <!-- 4. Categories Quick Bar -->
      <div style="margin-bottom: 18px;">
        <div style="padding: 0 18px 10px 18px; font-size: 13px; font-weight: 800; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center;">
          <span>Catégories du Menu</span>
          <span onclick="switchTab('menu')" style="font-size: 11px; color: var(--primary); cursor: pointer; font-weight: 700;">Tout Voir →</span>
        </div>
        <div style="display: flex; gap: 8px; overflow-x: auto; padding: 0 18px 4px 18px; scrollbar-width: none;" class="no-scrollbar">
          <button class="cat-btn active" onclick="openMenuAtCategory('Nos Wraps & Kebabs')">🌯 Wraps & Kebabs</button>
          <button class="cat-btn" onclick="openMenuAtCategory('Bols de Curry & Combos')">🍛 Bols de Curry</button>
          <button class="cat-btn" onclick="openMenuAtCategory('Nos Assiettes')">🍽️ Assiettes & Grillades</button>
          <button class="cat-btn" onclick="openMenuAtCategory('Biryani')">🍚 Biryani Royal</button>
          <button class="cat-btn" onclick="openMenuAtCategory('Nos Poutines')">🍟 Poutines Gourmet</button>
          <button class="cat-btn" onclick="openMenuAtCategory('Nos Burgers')">🍔 Burgers</button>
          <button class="cat-btn" onclick="openMenuAtCategory('À Côté & Naans')">🥟 Naans & Entrées</button>
          <button class="cat-btn" onclick="openMenuAtCategory('Desserts & Boissons')">🥤 Boissons & Desserts</button>
        </div>
      </div>

      <!-- 5. Popular Picks (Choix Populaires) - With Large Clear Food Images -->
      <div style="margin-bottom: 24px;">
        <div style="padding: 0 18px 12px 18px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-family: var(--font-heading); font-size: 15px; font-weight: 800; color: #FFFFFF;">⭐ Plats Populaires de Drummondville</h3>
          <span onclick="switchTab('menu')" style="font-size: 11px; color: var(--primary); cursor: pointer; font-weight: 700;">Voir Tout →</span>
        </div>
        <div id="homeFeaturedGrid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 0 18px;">
          <!-- Rendered dynamically by renderHomeFeatured -->
        </div>
      </div>

      <!-- 6. Rewards Loyalty Card -->
      <div style="margin: 0 18px 24px 18px; background: linear-gradient(135deg, #1C1C22 0%, #121216 100%); border: 1px solid rgba(229, 169, 60, 0.3); border-radius: 18px; padding: 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(229, 169, 60, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span style="font-size: 22px;">🌟</span>
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 2px;">Programme Récompenses La Maison</h4>
          <p style="font-size: 11px; color: var(--text-body); line-height: 1.3;">10 points par dollar dépensé. Échangez 200 points contre 1 Wrap gratuit.</p>
        </div>
        <button onclick="switchTab('scan')" style="background: var(--primary); color: #FFFFFF; border: none; padding: 8px 14px; border-radius: 16px; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 8px var(--primary-glow);">
          Scanner QR
        </button>
      </div>

      <!-- 7. Restaurant Details Footer -->
      <div style="margin: 0 18px 20px 18px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 14px 16px; font-size: 11px; color: var(--text-muted); text-align: center;">
        <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">📍 La Maison des Wraps Drummondville</div>
        <div>998 110e Avenue, Drummondville, QC J2B 6X2</div>
        <div>📞 (819) 850-3972 · Livraison & Ramassage 7j/7</div>
      </div>
    </div>\n\n`;

    html = html.substring(0, homeViewStart) + classicHomeView + html.substring(homeViewEnd);
  }

  // Update renderHomeFeatured to render food images on every featured card
  const newRenderHomeFeatured = `function renderHomeFeatured() {
  const container = document.getElementById('homeFeaturedGrid');
  if (!container) return;
  const featured = BOARD_DISHES.filter(d => d.is_featured);

  container.innerHTML = featured.map(dish => \`
    <div class="dish-card" onclick="openDishModal('\${dish.name_fr.replace(/'/g, "\\\\'")}')">
      <div style="width: 100%; height: 120px; border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: #121216; position: relative;">
        <img src="\${dish.image || '/assets/food/wrap_kebab_poulet.png'}" alt="\${dish.name_fr}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/food/wrap_kebab_poulet.png'">
        <div style="position: absolute; top: 6px; left: 6px; background: rgba(12, 12, 14, 0.85); backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; color: var(--accent-gold);">
          \${dish.cat}
        </div>
      </div>
      <div class="dish-title" style="font-size: 13px; font-weight: 700; color: #FFFFFF; line-height: 1.3; margin-bottom: 4px;">
        \${dish.name_fr}
      </div>
      <div class="dish-desc" style="font-size: 11px; color: var(--text-body); line-height: 1.3; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 28px;">
        \${dish.desc_fr}
      </div>
      <div class="dish-price-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
        <span class="price-text" style="font-size: 14px; font-weight: 800; color: var(--primary);">$\${dish.price.toFixed(2)} CAD</span>
        <button class="add-icon-btn"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
  \`).join('');
}`;

  html = html.replace(/function renderHomeFeatured\(\)\s*\{[\s\S]*?\n\}/, newRenderHomeFeatured);

  // Update renderMenuDishes to ensure images render perfectly
  const newRenderMenuDishes = `function renderMenuDishes(query = '') {
  const container = document.getElementById('fullMenuGrid');
  if (!container) return;
  const filtered = BOARD_DISHES.filter(d => {
    const matchesCat = d.cat === activeCat;
    const matchesQuery = !query || d.name_fr.toLowerCase().includes(query) || d.desc_fr.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const catTitleEl = document.getElementById('menuCategoryTitle');
  if (catTitleEl) catTitleEl.innerText = activeCat;
  const countEl = document.getElementById('menuItemsCountLabel');
  if (countEl) countEl.innerText = \`\${filtered.length} plats\`;

  container.innerHTML = filtered.map(dish => \`
    <div class="dish-card" onclick="openDishModal('\${dish.name_fr.replace(/'/g, "\\\\'")}')">
      <div style="width: 100%; height: 120px; border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: #121216; position: relative;">
        <img src="\${dish.image || '/assets/food/wrap_kebab_poulet.png'}" alt="\${dish.name_fr}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/food/wrap_kebab_poulet.png'">
        <div style="position: absolute; top: 6px; left: 6px; background: rgba(12, 12, 14, 0.85); backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; color: var(--accent-gold);">
          \${dish.cat}
        </div>
      </div>
      <div class="dish-title" style="font-size: 13px; font-weight: 700; color: #FFFFFF; line-height: 1.3; margin-bottom: 4px;">
        \${dish.name_fr}
      </div>
      <div class="dish-desc" style="font-size: 11px; color: var(--text-body); line-height: 1.3; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 28px;">
        \${dish.desc_fr}
      </div>
      <div class="dish-price-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
        <span class="price-text" style="font-size: 14px; font-weight: 800; color: var(--primary);">$\${dish.price.toFixed(2)} CAD</span>
        <button class="add-icon-btn"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
  \`).join('');
}`;

  html = html.replace(/function renderMenuDishes\(query = ''\)\s*\{[\s\S]*?\n\}/, newRenderMenuDishes);

  fs.writeFileSync(filePath, html);
  console.log('Successfully updated file to classic Black & Orange with full dish images: ' + filePath);
}

applyClassicBlackAndOrange('index.html');
applyClassicBlackAndOrange('app_preview/index.html');

