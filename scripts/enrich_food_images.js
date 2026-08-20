const fs = require('fs');

function enrichAppWithFoodImages(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add modalDishImage inside dishModal
  const modalHeaderRegex = /<div class="sheet-header">[\s\S]*?<\/div>\s*<p id="modalDesc"[^>]*><\/p>/;
  const newModalHeader = `<div class="sheet-header">
      <div>
        <div style="font-size: 10px; font-weight: 700; color: var(--primary); text-transform: uppercase;" id="modalCatName">Nos Wraps</div>
        <div class="sheet-title" id="modalTitle">Kebab au Poulet</div>
      </div>
      <button class="close-btn" onclick="closeModal('dishModal')"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <!-- Large Dish Hero Image -->
    <div style="width: 100%; height: 160px; border-radius: 14px; overflow: hidden; margin-bottom: 12px; background: #121216; border: 1px solid var(--border-subtle);">
      <img id="modalDishImage" src="/assets/food/wrap_kebab_poulet.png" alt="Plat" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/food/wrap_kebab_poulet.png'">
    </div>
    <p id="modalDesc" style="font-size: 12px; color: var(--text-body); margin-bottom: 16px; line-height: 1.4;"></p>`;
  
  html = html.replace(modalHeaderRegex, newModalHeader);

  // 2. Update addDishToCart to save image
  html = html.replace(
    /cart\.push\(\{\s*name:\s*itemTitle,\s*price:\s*total\s*\}\);/,
    `cart.push({ name: itemTitle, price: total, image: curDish.image || '/assets/food/wrap_kebab_poulet.png' });`
  );

  // 3. Update cartItemsList rendering with dish thumbnail
  html = html.replace(
    /list\.innerHTML = cart\.map\(\(i, idx\) => `[\s\S]*?`\)\.join\(''\);/,
    `list.innerHTML = cart.map((i, idx) => \`
        <div style="display: flex; align-items: center; gap: 10px; background: var(--bg-card); padding: 10px 12px; border-radius: 14px; border: 1px solid var(--border-subtle);">
          <div style="width: 50px; height: 50px; border-radius: 10px; overflow: hidden; background: #121216; flex-shrink: 0; border: 1px solid var(--border-subtle);">
            <img src="\${i.image || '/assets/food/wrap_kebab_poulet.png'}" alt="\${i.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/food/wrap_kebab_poulet.png'">
          </div>
          <div style="flex: 1; min-width: 0; padding-right: 6px;">
            <div style="font-size: 13px; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 3px;">\${i.name}</div>
            <strong style="color: var(--primary); font-size: 13px;">$\${i.price.toFixed(2)} CAD</strong>
          </div>
          <button type="button" onclick="removeItemFromCart(\${idx})" style="background: rgba(255, 68, 68, 0.15); border: 1px solid rgba(255, 68, 68, 0.3); color: #FF4444; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-trash" style="font-size: 11px;"></i>
          </button>
        </div>
      \`).join('');`
  );

  fs.writeFileSync(filePath, html);
  console.log('Enriched ' + filePath + ' with full dish modal image and cart thumbnails');
}

enrichAppWithFoodImages('index.html');
enrichAppWithFoodImages('app_preview/index.html');

