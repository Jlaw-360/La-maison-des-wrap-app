const fs = require('fs');

console.log("Updating food images across the application...");

// 1. Update index.html and app_preview/index.html
function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace BOARD_DISHES definition with image enriched version
  const oldDishesStart = html.indexOf('const BOARD_DISHES = [');
  const oldDishesEnd = html.indexOf('function init() {', oldDishesStart);

  if (oldDishesStart !== -1 && oldDishesEnd !== -1) {
    const newBoardDishes = `const BOARD_DISHES = [
  // Family & Group Feasts (High Ticket Value)
  { cat: 'Boîtes & Combos Familiaux', name_fr: 'La Boîte Festin 4 Wraps', desc_fr: '4 Wraps au choix + 2 Grandes Frites ou Patates à l\\'Ail + 4 Canettes + Sauces.', price: 44.95, is_wrap: false, is_featured: true, image: '/assets/food/trio_naan_poulet_tikka.png' },
  { cat: 'Boîtes & Combos Familiaux', name_fr: 'Le Combo Duo Gourmet', desc_fr: '2 Wraps Naan faits maison au choix + 1 Grande Poutine Tikka à partager + 2 Boissons.', price: 28.95, is_wrap: false, is_featured: true, image: '/assets/food/wrap_naan_poulet_tikka.png' },
  { cat: 'Boîtes & Combos Familiaux', name_fr: 'Le Festin Tandoori Mixte', desc_fr: 'Assortiment généreux Poulet Tikka & Kebab grillés, 4 Pains Naan chauds, Salade et Sauces.', price: 39.95, is_wrap: false, is_featured: true, image: '/assets/food/assiette_mix_2_viandes.png' },

  // Top Featured Signatures (for Home)
  { cat: 'Bols de Curry & Combos', name_fr: 'Poulet au Beurre (Butter Chicken)', desc_fr: 'Poulet tikka dans une sauce crémeuse au beurre et aux amandes.', price: 17.65, is_wrap: false, is_featured: true, image: '/assets/food/combo_bol_curry.png' },
  { cat: 'Nos Wraps', name_fr: 'Kebab au Poulet', desc_fr: 'Poulet assaisonné et grillé, servi avec salade et sauce au choix.', price: 8.95, is_wrap: true, is_featured: true, image: '/assets/food/wrap_kebab_poulet.png' },
  { cat: 'Nos Wraps', name_fr: 'Wrap au Poulet Tikka', desc_fr: 'Morceaux de poulet mariné aux épices tandoori rouges.', price: 8.95, is_wrap: true, is_featured: true, image: '/assets/food/wrap_naan_poulet_tikka.png' },
  { cat: 'Nos Poutines', name_fr: 'Poutine Poulet au Beurre', desc_fr: 'Fromage couic-couic nappé de notre sauce beurre maison.', price: 15.95, is_wrap: false, is_featured: true, image: '/assets/food/combo_bol_curry.png' },
  { cat: 'Biryani', name_fr: 'Biryani au Poulet', desc_fr: 'Riz basmati parfumé au safran, amandes et épices royales + Raita.', price: 18.85, is_wrap: false, is_featured: true, image: '/assets/food/assiette_biryani.png' },

  // Wraps
  { cat: 'Nos Wraps', name_fr: 'Kebab à la Dinde et Bœuf', desc_fr: 'Mélange savoureux de dinde et bœuf émincé et grillé.', price: 8.95, is_wrap: true, image: '/assets/food/wrap_kebab_dinde_boeuf.png' },
  { cat: 'Nos Wraps', name_fr: 'Wrap au Poulet Masala', desc_fr: 'Poulet mariné dans un mélange d\\'épices masala traditionnelles.', price: 8.95, is_wrap: true, image: '/assets/food/wrap_naan_poulet_masala.png' },
  { cat: 'Nos Wraps', name_fr: 'Wrap au Steak Fromage', desc_fr: 'Lamelles de steak de bœuf tendre garni de fromage fondant.', price: 9.75, is_wrap: true, image: '/assets/food/wrap_kebab_dinde_boeuf.png' },
  { cat: 'Nos Wraps', name_fr: 'Wrap Poulet Croustillant', desc_fr: 'Poulet frit croustillant garni de salade fraîche.', price: 8.95, is_wrap: true, image: '/assets/food/wrap_kebab_poulet.png' },
  { cat: 'Nos Wraps', name_fr: 'Wrap Mix (2 Viandes)', desc_fr: 'Combinaison de 2 viandes au choix parmi nos spécialités.', price: 9.95, is_wrap: true, image: '/assets/food/assiette_mix_2_viandes.png' },

  // Paninis
  { cat: 'Paninis', name_fr: 'Panini Poulet Tikka', desc_fr: 'Pain ciabatta pressé au poulet tikka et fromage fondant.', price: 9.25, is_wrap: false, image: '/assets/food/wrap_naan_poulet_tikka.png' },
  { cat: 'Paninis', name_fr: 'Panini Poulet Masala', desc_fr: 'Poulet masala avec fromage fondu grillé à chaud.', price: 9.25, is_wrap: false, image: '/assets/food/wrap_naan_poulet_masala.png' },
  { cat: 'Paninis', name_fr: 'Panini Saumon & Fromage', desc_fr: 'Saumon savoureux garni de fromage chaud.', price: 9.25, is_wrap: false, image: '/assets/food/wrap_poulet_malai_tikka.png' },

  // Curry Bowls & Combos
  { cat: 'Bols de Curry & Combos', name_fr: 'Poulet Curry Traditionnel', desc_fr: 'Poulet mijoté dans notre sauce curry spéciale aux herbes.', price: 17.65, is_wrap: false, image: '/assets/food/wrap_poulet_curry.png' },
  { cat: 'Bols de Curry & Combos', name_fr: 'Poulet Malai Tikka', desc_fr: 'Blanc de volaille tandoor dans sauce crème et fromage.', price: 17.65, is_wrap: false, image: '/assets/food/wrap_poulet_malai_tikka.png' },
  { cat: 'Bols de Curry & Combos', name_fr: 'Panneer Makhani (Fromage Maison)', desc_fr: 'Paneer dans une sauce crémeuse aux tomates et épices.', price: 15.25, is_wrap: false, image: '/assets/food/combo_bol_curry.png' },
  { cat: 'Bols de Curry & Combos', name_fr: 'Combo 2 : Curry + Riz + Naan Fromage', desc_fr: 'Grand bol au choix avec portion de riz basmati et naan fromage.', price: 24.35, is_wrap: false, image: '/assets/food/combo_bol_curry.png' },

  // Biryani
  { cat: 'Biryani', name_fr: 'Biryani aux Crevettes', desc_fr: 'Riz basmati royal aux crevettes sautées et épices + Raita.', price: 18.85, is_wrap: false, image: '/assets/food/assiette_biryani_raita.png' },

  // Assiettes
  { cat: 'Nos Assiettes', name_fr: 'Assiette Kebab au Poulet', desc_fr: 'Servi avec salade au choix, frites/patate à l\\'ail, riz basmati & pain kebab.', price: 17.65, is_wrap: false, image: '/assets/food/assiette_kebab_poulet.png' },
  { cat: 'Nos Assiettes', name_fr: 'Assiette Poulet Tikka', desc_fr: 'Poulet tandoori complet servi avec frites, riz et salade.', price: 17.65, is_wrap: false, image: '/assets/food/assiette_poulet_tikka.png' },
  { cat: 'Nos Assiettes', name_fr: 'Assiette Mixte (2 Viandes)', desc_fr: 'Assiette royale avec 2 viandes au choix et accompagnements.', price: 19.95, is_wrap: false, image: '/assets/food/assiette_mix_2_viandes.png' },

  // Poutines
  { cat: 'Nos Poutines', name_fr: 'Poutine Poulet Tikka', desc_fr: 'Fromage en grains du Québec, poulet tikka et sauce au choix.', price: 14.95, is_wrap: false, image: '/assets/food/wrap_naan_poulet_tikka.png' },
  { cat: 'Nos Poutines', name_fr: 'Poutine Kebab au Poulet', desc_fr: 'Frites croustillantes et lamelles de kebab au poulet.', price: 14.50, is_wrap: false, image: '/assets/food/wrap_kebab_poulet.png' },

  // Burgers & Menu Enfant
  { cat: 'Nos Burgers', name_fr: 'Cheese Burger', desc_fr: 'Burger classique avec fromage cheddar fondu.', price: 6.75, is_wrap: false, image: '/assets/food/burger.png' },
  { cat: 'Nos Burgers', name_fr: 'Double Cheese Burger', desc_fr: 'Deux galettes de bœuf et double cheddar.', price: 8.45, is_wrap: false, image: '/assets/food/burger.png' },
  { cat: 'Menu Enfant', name_fr: 'Nuggets + Frites + Boisson', desc_fr: 'Menu complet pour enfant avec frites et canette.', price: 8.95, is_wrap: false, image: '/assets/food/wrap_kebab_poulet.png' },

  // Sides, Naans, Desserts & Drinks
  { cat: 'À Côté & Naans', name_fr: 'Naan à l\\'Ail & Fromage', desc_fr: 'Cuit au tandoor avec beurre à l\\'ail et fromage fondant.', price: 5.50, is_wrap: false, image: '/assets/food/pain_naan_ail.png' },
  { cat: 'À Côté & Naans', name_fr: '2 Samosas aux Légumes', desc_fr: 'Chaussons croustillants farcis aux légumes et épices.', price: 4.65, is_wrap: false, image: '/assets/food/pain_naan_nature.png' },
  { cat: 'Desserts & Boissons', name_fr: 'Lassi à la Mangue', desc_fr: 'Boisson rafraîchissante indienne au yogourt et mangue.', price: 4.50, is_wrap: false, image: '/assets/food/lassi_mangue.png' },
  { cat: 'Desserts & Boissons', name_fr: 'Lassi à la Rose', desc_fr: 'Boisson rafraîchissante parfumée à la rose.', price: 4.50, is_wrap: false, image: '/assets/food/lassi_rose.png' },
  { cat: 'Desserts & Boissons', name_fr: 'Gulab Jamun (2 pcs)', desc_fr: 'Douceur indienne au sirop de cardamome.', price: 4.99, is_wrap: false, image: '/assets/food/dessert_gulab_jamun.png' },
  { cat: 'Desserts & Boissons', name_fr: 'Ras Malai (2 pcs)', desc_fr: 'Dessert traditionnel au lait parfumé au safran et pistaches.', price: 5.50, is_wrap: false, image: '/assets/food/dessert_ras_malai.png' }
];\n\n`;

    html = html.substring(0, oldDishesStart) + newBoardDishes + html.substring(oldDishesEnd);
  }

  // Update renderMenuDishes template
  html = html.replace(
    /container\.innerHTML = filtered\.map\(dish => `[\s\S]*?`\)\.join\(''\);/,
    `container.innerHTML = filtered.map(dish => \`
    <div class="dish-card" onclick="openDishModal('\${dish.name_fr.replace(/'/g, "\\\\'")}')">
      <div style="width: 100%; height: 110px; border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: #181820; position: relative;">
        <img src="\${dish.image || '/assets/food/wrap_kebab_poulet.png'}" alt="\${dish.name_fr}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/logo.png'">
        <div class="dish-badge" style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 6px; margin: 0; font-size: 8px;">\${dish.cat}</div>
      </div>
      <div class="dish-title">\${dish.name_fr}</div>
      <div class="dish-desc">\${dish.desc_fr}</div>
      <div class="dish-price-row">
        <span class="price-text">$\${dish.price.toFixed(2)}</span>
        <button class="add-icon-btn"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
  \`).join('');`
  );

  // Update renderHomeFeatured template
  html = html.replace(
    /document\.getElementById\('homeFeaturedGrid'\)\.innerHTML = featured\.map\(d => `[\s\S]*?`\)\.join\(''\);/,
    `document.getElementById('homeFeaturedGrid').innerHTML = featured.map(d => \`
    <div class="featured-card" onclick="openDishModal('\${d.name_fr.replace(/'/g, "\\\\'")}')">
      <div style="width: 100%; height: 125px; border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: #181820;">
        <img src="\${d.image || '/assets/food/wrap_kebab_poulet.png'}" alt="\${d.name_fr}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/logo.png'">
      </div>
      <div class="featured-badge">\${d.cat}</div>
      <div class="featured-title">\${d.name_fr}</div>
      <div class="featured-desc">\${d.desc_fr}</div>
      <div class="featured-price">$\${d.price.toFixed(2)}</div>
    </div>
  \`).join('');`
  );

  // Update openDishModal to display image banner
  if (!html.includes('id="modalDishImage"')) {
    html = html.replace(
      `<div class="modal-body">`,
      `<div class="modal-body">
      <div id="modalDishImageContainer" style="width: 100%; height: 160px; border-radius: 14px; overflow: hidden; margin-bottom: 14px; background: #14141B;">
        <img id="modalDishImage" src="/assets/food/wrap_kebab_poulet.png" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/logo.png'">
      </div>`
    );
  }

  // Update openDishModal JS logic to set image src
  html = html.replace(
    `document.getElementById('modalDesc').innerText = curDish.desc_fr;`,
    `document.getElementById('modalDesc').innerText = curDish.desc_fr;
  const imgEl = document.getElementById('modalDishImage');
  if (imgEl) imgEl.src = curDish.image || '/assets/food/wrap_kebab_poulet.png';`
  );

  fs.writeFileSync(filePath, html);
  console.log('Successfully updated HTML file with dish photos: ' + filePath);
}

updateHtmlFile('index.html');
updateHtmlFile('app_preview/index.html');

