const fs = require('fs');

console.log("Upgrading customer app UI to match the reference design...");

function upgradeCustomerApp(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Inject reference CSS styling for header, cards, pills, details sheet, and buttons
  const luxuryCss = `
    /* ==================== LUXURY REFERENCE UI (BLACK & ORANGE) ==================== */
    :root {
      --bg-main: #0B0B0F;
      --bg-surface: #14141A;
      --bg-card: #181820;
      --bg-card-elevated: #1F1F2A;
      --primary: #FF5500;
      --primary-hover: #E04B00;
      --primary-glow: rgba(255, 85, 0, 0.4);
      --accent-gold: #E5A93C;
      --accent-green: #22C55E;
      --text-white: #FFFFFF;
      --text-body: #9D9DAE;
      --text-muted: #707080;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-card: rgba(255, 255, 255, 0.06);
    }

    body {
      background-color: #050507;
      color: var(--text-white);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Reference Header: Avatar | Drummondville | Action */
    .ref-header {
      padding: 14px 18px 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(11, 11, 15, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--border-subtle);
    }

    .ref-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF5500 0%, #E5A93C 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }

    .ref-location {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
    }

    .ref-location span {
      font-size: 11px;
      font-weight: 700;
      color: #E2E2E8;
    }

    .ref-action-btn {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      position: relative;
    }

    /* Greeting Section */
    .ref-greeting {
      padding: 16px 18px 8px 18px;
    }

    .ref-greeting h1 {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.4px;
      line-height: 1.2;
    }

    .ref-greeting p {
      font-size: 12px;
      color: var(--text-body);
      margin-top: 4px;
    }

    /* Category Filter Pills (Horizontal Scroll) */
    .ref-category-scroll {
      display: flex;
      gap: 8px;
      padding: 12px 18px 8px 18px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }

    .ref-category-scroll::-webkit-scrollbar { display: none; }

    .ref-cat-pill {
      background: #181820;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #D1D1DB;
      padding: 8px 16px;
      border-radius: 24px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ref-cat-pill.active {
      background: #FF5500;
      border-color: #FF5500;
      color: #FFFFFF;
      box-shadow: 0 4px 16px rgba(255, 85, 0, 0.35);
    }

    /* Section Title */
    .ref-section-head {
      padding: 16px 18px 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ref-section-head h2 {
      font-size: 17px;
      font-weight: 800;
      color: #FFFFFF;
    }

    .ref-section-head a, .ref-section-head button {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      background: transparent;
      border: none;
      cursor: pointer;
    }

    /* Big Visual Food Cards (Reference Mockup Style) */
    .ref-cards-container {
      padding: 0 18px 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ref-food-card {
      position: relative;
      border-radius: 26px;
      overflow: hidden;
      background: #14141A;
      border: 1px solid rgba(255, 255, 255, 0.07);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .ref-food-card:active {
      transform: scale(0.985);
    }

    .ref-card-img-wrap {
      width: 100%;
      height: 220px;
      position: relative;
      background: #0D0D12;
    }

    .ref-card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .ref-food-card:hover .ref-card-img-wrap img {
      transform: scale(1.03);
    }

    .ref-card-gradient {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 40%, rgba(12,12,16,0.92) 90%);
      pointer-events: none;
    }

    .ref-card-top-badges {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      z-index: 2;
    }

    .ref-card-price-badge {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ref-price-val {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
      letter-spacing: -0.3px;
    }

    .ref-rating-val {
      font-size: 10px;
      font-weight: 700;
      color: #E5A93C;
      display: flex;
      align-items: center;
      gap: 3px;
      text-shadow: 0 1px 4px rgba(0,0,0,0.8);
    }

    .ref-fav-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(18, 18, 24, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      cursor: pointer;
    }

    .ref-fav-btn.active { color: #FF5500; }

    /* Bottom Glass Overlay Info inside Card */
    .ref-card-bottom-bar {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      background: rgba(22, 22, 30, 0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
    }

    .ref-card-info-left h3 {
      font-size: 14px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.2;
    }

    .ref-card-info-left p {
      font-size: 10px;
      color: var(--text-body);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }

    .ref-card-arrow-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #FFFFFF;
      color: #0C0C0E;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.2s, background 0.2s;
    }

    .ref-food-card:hover .ref-card-arrow-btn {
      background: #FF5500;
      color: #FFFFFF;
      transform: rotate(45deg);
    }

    /* Screen 3: Details & Customizer Sheet Modal */
    .ref-details-modal {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(14px);
      z-index: 9999;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }

    .ref-details-modal.open {
      display: flex;
    }

    .ref-details-sheet {
      width: 100%;
      max-width: 480px;
      background: #111116;
      border-radius: 28px 28px 0 0;
      border-top: 1.5px solid rgba(255, 255, 255, 0.12);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUpDetails 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUpDetails {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .ref-sheet-top-nav {
      position: absolute;
      top: 14px; left: 14px; right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .ref-circle-nav-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(18, 18, 24, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    }

    .ref-details-hero-img-wrap {
      width: 100%;
      height: 220px;
      position: relative;
      background: #08080C;
    }

    .ref-details-hero-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ref-details-body {
      padding: 18px 20px 20px 20px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ref-dish-header-row {
      background: #171720;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .ref-dish-thumb-round {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #FF5500;
      box-shadow: 0 0 14px rgba(255, 85, 0, 0.4);
      flex-shrink: 0;
    }

    .ref-dish-meta-title h2 {
      font-size: 16px;
      font-weight: 800;
      color: #FFFFFF;
    }

    .ref-dish-meta-price {
      font-size: 18px;
      font-weight: 800;
      color: #FF5500;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ref-meta-badges-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .ref-meta-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 700;
      color: #D1D1DB;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ref-details-bottom-bar {
      padding: 12px 20px 20px 20px;
      border-top: 1px solid var(--border-subtle);
      background: #111116;
      display: flex;
      gap: 10px;
    }

    .ref-btn-cart-secondary {
      flex: 1;
      padding: 14px;
      background: #1E1E28;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .ref-btn-order-primary {
      flex: 1.3;
      padding: 14px;
      background: #FF5500;
      border: none;
      border-radius: 16px;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 6px 20px rgba(255, 85, 0, 0.4);
    }
  `;

  if (!html.includes('LUXURY REFERENCE UI')) {
    html = html.replace('</style>', luxuryCss + '\n</style>');
  }

  // 2. Replace top-header with the reference header layout
  const newHeaderHtml = `
  <!-- Reference Header (Avatar | Drummondville Location | Cart & Loyalty) -->
  <header class="ref-header">
    <div class="ref-avatar" onclick="switchTab('profile')" title="Mon Profil">
      <span id="headerUserInitial">W</span>
    </div>

    <div class="ref-location" onclick="openAddressEditPrompt()">
      <i class="fa-solid fa-location-dot" style="color: #FF5500; font-size: 11px;"></i>
      <span id="lblTopAddress">Drummondville, QC</span>
      <i class="fa-solid fa-chevron-down" style="color: var(--text-muted); font-size: 9px;"></i>
    </div>

    <div style="display: flex; align-items: center; gap: 8px;">
      <!-- Loyalty Points -->
      <button class="pill-btn" onclick="switchTab('scan')" style="background: rgba(229, 169, 60, 0.12); border: 1px solid rgba(229, 169, 60, 0.35); color: #E5A93C; padding: 6px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 4px; cursor: pointer;">
        <i class="fa-solid fa-crown" style="font-size: 10px;"></i>
        <span id="lblHeaderPointsVal">50 Pts</span>
      </button>

      <!-- Cart Button with Floating Counter -->
      <button class="ref-action-btn" onclick="openCartModal()" title="Panier">
        <i class="fa-solid fa-bag-shopping"></i>
        <span id="cartCountBadge" style="display: none; position: absolute; top: -4px; right: -4px; background: #FF5500; color: #FFFFFF; font-size: 9px; font-weight: 900; width: 16px; height: 16px; border-radius: 50%; align-items: center; justify-content: center; border: 1.5px solid #0C0C0E;">0</span>
      </button>
    </div>
  </header>
  `;

  html = html.replace(/<header class="top-header"[\s\S]*?<\/header>/, newHeaderHtml);

  // 3. Update Home View with Greeting, Category Filter Pills, and Full-Bleed Cards
  const newHomeTop = `
  <!-- ==================== VIEW 1: HOME (ACCUEIL) ==================== -->
  <div class="app-view active" id="view-home">
    
    <!-- Reference Greeting Section -->
    <div class="ref-greeting">
      <h1 id="greetingUserName">Bonjour, Walkse</h1>
      <p>Explorez les Meilleurs Wraps & Saveurs Tandoor de Drummondville</p>
    </div>

    <!-- Fulfillment Mode Selector (Livraison vs Cueillette) -->
    <div style="margin: 4px 18px 12px 18px; background: #14141A; border: 1px solid rgba(255, 85, 0, 0.25); border-radius: 18px; padding: 10px; display: flex; gap: 8px;">
      <button type="button" class="cat-btn active" id="btnModeDelivery" onclick="selectTimsMode('delivery')" style="flex: 1; text-align: center; font-size: 12px; font-weight: 700; padding: 10px 6px; border-radius: 12px;">
        <i class="fa-solid fa-motorcycle"></i> Livraison
      </button>
      <button type="button" class="cat-btn" id="btnModePickup" onclick="selectTimsMode('pickup')" style="flex: 1; text-align: center; font-size: 12px; font-weight: 700; padding: 10px 6px; border-radius: 12px;">
        <i class="fa-solid fa-bag-shopping"></i> Cueillette
      </button>
    </div>

    <!-- Reference Category Filter Pills (Horizontal Scroll) -->
    <div class="ref-category-scroll">
      <button class="ref-cat-pill active" onclick="filterLuxuryCategory('all', this)">Tous les Plats</button>
      <button class="ref-cat-pill" onclick="filterLuxuryCategory('wraps', this)">🌯 Wraps Naan</button>
      <button class="ref-cat-pill" onclick="filterLuxuryCategory('assiettes', this)">🍲 Assiettes & Riz</button>
      <button class="ref-cat-pill" onclick="filterLuxuryCategory('trios', this)">🍟 Trios Combos</button>
      <button class="ref-cat-pill" onclick="filterLuxuryCategory('kebabs', this)">🍔 Kebabs & Burgers</button>
      <button class="ref-cat-pill" onclick="filterLuxuryCategory('desserts', this)">🥤 Lassis & Desserts</button>
    </div>

    <!-- Section Title -->
    <div class="ref-section-head">
      <h2>Nos Spécialités Chaudes</h2>
      <button onclick="switchTab('menu')">Voir Tout <i class="fa-solid fa-arrow-right"></i></button>
    </div>

    <!-- Big Visual Food Cards List (Reference Mockup Style) -->
    <div class="ref-cards-container" id="luxuryFeaturedCardsContainer">
      <!-- Dynamically populated by renderLuxuryCards() -->
    </div>
  `;

  html = html.replace(/<!-- ==================== VIEW 1: HOME \(ACCUEIL\) ==================== -->[\s\S]*?<!-- Featured Items Carousel & Grid -->[\s\S]*?<div class="featured-grid" id="homeFeaturedGrid">[\s\S]*?<\/div>/, newHomeTop);

  // 4. Details Sheet Modal HTML (Screen 3 Reference Design)
  const detailsModalHtml = `
<!-- Reference Screen 3: Details & Customizer Bottom Sheet Modal -->
<div class="ref-details-modal" id="refDetailsModal">
  <div class="ref-details-sheet">
    <!-- Top Nav -->
    <div class="ref-sheet-top-nav">
      <div class="ref-circle-nav-btn" onclick="closeRefDetailsModal()"><i class="fa-solid fa-chevron-left"></i></div>
      <div style="font-weight: 800; font-size: 14px; color: #FFFFFF;">Détails du Plat</div>
      <div class="ref-circle-nav-btn" onclick="closeRefDetailsModal(); openCartModal();"><i class="fa-solid fa-bag-shopping"></i></div>
    </div>

    <!-- Hero Image -->
    <div class="ref-details-hero-img-wrap">
      <img id="refModalHeroImg" src="/assets/food/wrap_naan_poulet_tikka.png" alt="Dish Hero">
      <div class="ref-card-gradient"></div>
    </div>

    <!-- Scrollable Content -->
    <div class="ref-details-body">
      <!-- Dish Header Card -->
      <div class="ref-dish-header-row">
        <img id="refModalThumbImg" src="/assets/food/wrap_naan_poulet_tikka.png" alt="Thumb" class="ref-dish-thumb-round">
        <div class="ref-dish-meta-title" style="flex: 1;">
          <h2 id="refModalTitle">Wrap Naan Poulet Tikka</h2>
          <div class="ref-dish-meta-price">
            <span id="refModalPrice">$13.99 CAD</span>
            <span style="font-size: 11px; color: #E5A93C; font-weight: 700;">★ 4.9/5 <span style="color: var(--text-muted);">(500+ avis)</span></span>
          </div>
        </div>
      </div>

      <!-- Meta Badges -->
      <div class="ref-meta-badges-row">
        <div class="ref-meta-pill"><i class="fa-solid fa-location-dot" style="color: #FF5500;"></i> Drummondville</div>
        <div class="ref-meta-pill"><i class="fa-solid fa-fire" style="color: #FF5500;"></i> 580 Kcal</div>
        <div class="ref-meta-pill"><i class="fa-solid fa-clock" style="color: #22C55E;"></i> 15-20 min</div>
      </div>

      <!-- Description -->
      <div>
        <h3 style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Description</h3>
        <p id="refModalDesc" style="font-size: 12px; color: var(--text-body); line-height: 1.5;">
          Pain naan artisanal cuit minute au four tandoor, garni de suprêmes de poulet marinés aux 12 épices, oignons rouges croustillants et sauce menthe fraîche maison.
        </p>
      </div>

      <!-- Customization Options (Format Seul vs Trio) -->
      <div>
        <h3 style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">1. Choisissez votre Format</h3>
        <div style="display: flex; gap: 10px;">
          <label style="flex: 1; background: #181820; border: 1.5px solid #FF5500; border-radius: 14px; padding: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #fff;">Sandwich Seul</div>
              <div style="font-size: 11px; color: var(--text-body);" id="lblPriceSeul">$13.99</div>
            </div>
            <input type="radio" name="refDishFormat" value="solo" checked onchange="calcRefModalPrice()">
          </label>

          <label style="flex: 1; background: #181820; border: 1.5px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #fff;">Formule Trio 🍟🥤</div>
              <div style="font-size: 11px; color: #FF5500; font-weight: 700;">+ $5.30</div>
            </div>
            <input type="radio" name="refDishFormat" value="trio" onchange="calcRefModalPrice()">
          </label>
        </div>
      </div>
    </div>

    <!-- Bottom Sticky Action Bar -->
    <div class="ref-details-bottom-bar">
      <button class="ref-btn-cart-secondary" onclick="addCurrentDishToCart(false)">
        <i class="fa-solid fa-cart-plus"></i>
        <span>Ajouter au Panier</span>
      </button>
      <button class="ref-btn-order-primary" onclick="addCurrentDishToCart(true)">
        <span>Commander</span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</div>
`;

  if (!html.includes('id="refDetailsModal"')) {
    html = html.replace('</body>', detailsModalHtml + '\n</body>');
  }

  // 5. JavaScript function to render the reference luxury cards
  const luxuryJs = `
let currentRefDish = null;
let currentRefCategory = 'all';

function renderLuxuryCards() {
  const container = document.getElementById('luxuryFeaturedCardsContainer');
  if (!container) return;

  const dishes = [
    {
      id: "wrap-naan-poulet-tikka",
      name: "Wrap Naan Poulet Tikka",
      cat: "wraps",
      price: 13.99,
      rating: "4.9/5",
      reviews: "500+ avis",
      img: "/assets/food/wrap_naan_poulet_tikka.png",
      desc: "Pain naan artisanal cuit minute au four tandoor, garni de suprêmes de poulet marinés aux 12 épices, oignons rouges croustillants et sauce menthe fraîche maison."
    },
    {
      id: "assiette-mix-2-viandes",
      name: "Assiette Mix Royale (2 Viandes)",
      cat: "assiettes",
      price: 16.99,
      rating: "4.9/5",
      reviews: "380+ avis",
      img: "/assets/food/assiette_mix_2_viandes.png",
      desc: "Généreuse assiette dégustation combinant Poulet Tikka et Kebab épicé, servie avec riz basmati parfumé et salade fraîche."
    },
    {
      id: "trio-naan-poulet-tikka",
      name: "Trio Festin Naan & Frites",
      cat: "trios",
      price: 19.29,
      rating: "4.8/5",
      reviews: "420+ avis",
      img: "/assets/food/trio_naan_poulet_tikka.png",
      desc: "Le combo signature le plus populaire : 1 Wrap Naan garni + Grande portion de frites dorées + 1 Boisson fraîche au choix."
    },
    {
      id: "wrap-kebab-poulet",
      name: "Wrap Kebab Épicé",
      cat: "kebabs",
      price: 12.99,
      rating: "4.8/5",
      reviews: "290+ avis",
      img: "/assets/food/wrap_kebab_poulet.png",
      desc: "Brochettes de kebab assaisonnées aux herbes fraîches et piments doux, roulées dans un pain naan avec sauce blanche à l'ail."
    },
    {
      id: "lassi-mangue",
      name: "Lassi Mangue Royale",
      cat: "desserts",
      price: 5.99,
      rating: "5.0/5",
      reviews: "640+ avis",
      img: "/assets/food/lassi_mangue.png",
      desc: "Boisson traditionnelle au yaourt crémeux et pulpe de mangue Alphonso mûrie au soleil. Très rafraîchissant."
    },
    {
      id: "assiette-biryani",
      name: "Assiette Biryani Poulet",
      cat: "assiettes",
      price: 15.49,
      rating: "4.9/5",
      reviews: "310+ avis",
      img: "/assets/food/assiette_biryani.png",
      desc: "Riz basmati mijoté aux épices royales avec morceaux de poulet tendre, safran et sauce raïta onctueuse."
    }
  ];

  const filtered = currentRefCategory === 'all' ? dishes : dishes.filter(d => d.cat === currentRefCategory);

  container.innerHTML = filtered.map(dish => {
    return \`
      <div class="ref-food-card" onclick="openRefDetailsModal('\${dish.id}')">
        <div class="ref-card-img-wrap">
          <img src="\${dish.img}" alt="\${dish.name}" onerror="this.src='/logo.png'">
          <div class="ref-card-gradient"></div>
        </div>

        <!-- Top Badges -->
        <div class="ref-card-top-badges">
          <div class="ref-card-price-badge">
            <div class="ref-price-val">$\${dish.price.toFixed(2)}</div>
            <div class="ref-rating-val">★ \${dish.rating} <span style="color: rgba(255,255,255,0.6);">(\${dish.reviews})</span></div>
          </div>
          <div class="ref-fav-btn" onclick="event.stopPropagation(); this.classList.toggle('active'); showToast('Ajouté aux favoris !', '⭐');">
            <i class="fa-solid fa-star"></i>
          </div>
        </div>

        <!-- Bottom Glass Overlay Info -->
        <div class="ref-card-bottom-bar">
          <div class="ref-card-info-left">
            <h3>\${dish.name}</h3>
            <p>\${dish.desc}</p>
          </div>
          <button class="ref-card-arrow-btn" onclick="event.stopPropagation(); openRefDetailsModal('\${dish.id}')">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
        </div>
      </div>
    \`;
  }).join('');
}

function filterLuxuryCategory(cat, btn) {
  currentRefCategory = cat;
  document.querySelectorAll('.ref-cat-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderLuxuryCards();
}

function openRefDetailsModal(dishId) {
  const dishes = [
    { id: "wrap-naan-poulet-tikka", name: "Wrap Naan Poulet Tikka", price: 13.99, img: "/assets/food/wrap_naan_poulet_tikka.png", desc: "Pain naan artisanal cuit minute au four tandoor, garni de suprêmes de poulet marinés aux 12 épices, oignons rouges croustillants et sauce menthe fraîche maison." },
    { id: "assiette-mix-2-viandes", name: "Assiette Mix Royale (2 Viandes)", price: 16.99, img: "/assets/food/assiette_mix_2_viandes.png", desc: "Généreuse assiette dégustation combinant Poulet Tikka et Kebab épicé, servie avec riz basmati parfumé et salade fraîche." },
    { id: "trio-naan-poulet-tikka", name: "Trio Festin Naan & Frites", price: 19.29, img: "/assets/food/trio_naan_poulet_tikka.png", desc: "Le combo signature le plus populaire : 1 Wrap Naan garni + Grande portion de frites dorées + 1 Boisson fraîche au choix." },
    { id: "wrap-kebab-poulet", name: "Wrap Kebab Épicé", price: 12.99, img: "/assets/food/wrap_kebab_poulet.png", desc: "Brochettes de kebab assaisonnées aux herbes fraîches et piments doux, roulées dans un pain naan avec sauce blanche à l'ail." },
    { id: "lassi-mangue", name: "Lassi Mangue Royale", price: 5.99, img: "/assets/food/lassi_mangue.png", desc: "Boisson traditionnelle au yaourt crémeux et pulpe de mangue Alphonso mûrie au soleil. Très rafraîchissant." },
    { id: "assiette-biryani", name: "Assiette Biryani Poulet", price: 15.49, img: "/assets/food/assiette_biryani.png", desc: "Riz basmati mijoté aux épices royales avec morceaux de poulet tendre, safran et sauce raïta onctueuse." }
  ];

  const found = dishes.find(d => d.id === dishId) || dishes[0];
  currentRefDish = found;

  document.getElementById('refModalHeroImg').src = found.img;
  document.getElementById('refModalThumbImg').src = found.img;
  document.getElementById('refModalTitle').innerText = found.name;
  document.getElementById('lblPriceSeul').innerText = '$' + found.price.toFixed(2);
  document.getElementById('refModalDesc').innerText = found.desc;

  document.querySelector('input[name="refDishFormat"][value="solo"]').checked = true;
  calcRefModalPrice();

  document.getElementById('refDetailsModal').classList.add('open');
}

function closeRefDetailsModal() {
  const modal = document.getElementById('refDetailsModal');
  if (modal) modal.classList.remove('open');
}

function calcRefModalPrice() {
  if (!currentRefDish) return;
  const isTrio = document.querySelector('input[name="refDishFormat"][value="trio"]')?.checked;
  const finalPrice = isTrio ? (currentRefDish.price + 5.30) : currentRefDish.price;
  document.getElementById('refModalPrice').innerText = '$' + finalPrice.toFixed(2) + ' CAD';
}

function addCurrentDishToCart(andCheckout = false) {
  if (!currentRefDish) return;
  const isTrio = document.querySelector('input[name="refDishFormat"][value="trio"]')?.checked;
  const price = isTrio ? (currentRefDish.price + 5.30) : currentRefDish.price;
  const name = isTrio ? (currentRefDish.name + " (Trio Frites & Boisson)") : currentRefDish.name;

  addToCart(currentRefDish.id, name, price, currentRefDish.img);
  closeRefDetailsModal();

  if (andCheckout) {
    openCartModal();
  } else {
    showToast("Ajouté au panier !", "🛒");
  }
}
`;

  if (!html.includes('renderLuxuryCards()')) {
    html = html.replace('window.onload = function() {', luxuryJs + '\nwindow.onload = function() {\n  renderLuxuryCards();');
  }

  fs.writeFileSync(filePath, html);
  console.log('✓ Upgraded ' + filePath + ' to reference luxury UI design');
}

upgradeCustomerApp('index.html');
upgradeCustomerApp('app_preview/index.html');

