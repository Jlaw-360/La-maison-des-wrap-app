const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Walke\\Downloads\\la maison des wraps food';
const targets = [
  path.join(__dirname, '..', 'assets', 'food'),
  path.join(__dirname, '..', 'public', 'assets', 'food'),
  path.join(__dirname, '..', 'dist', 'assets', 'food')
];

targets.forEach(t => {
  if (!fs.existsSync(t)) fs.mkdirSync(t, { recursive: true });
});

const mappings = [
  { src: 'la maison des wraps naan poulet tikka.png', dest: 'wrap_naan_poulet_tikka.png' },
  { src: 'la maison des wraps poulet tikka.png', dest: 'wrap_poulet_tikka.png' },
  { src: 'la maison des wraps kebab au poulet.png', dest: 'wrap_kebab_poulet.png' },
  { src: 'la maison des wraps kebab au dinde et boeuf.png', dest: 'wrap_kebab_dinde_boeuf.png' },
  { src: 'la maison des wraps naan poulet masala.png', dest: 'wrap_naan_poulet_masala.png' },
  { src: 'la maison des wraps naan poulet tikka trio.png', dest: 'trio_naan_poulet_tikka.png' },
  { src: 'la maison des wraps poulet curry.png', dest: 'wrap_poulet_curry.png' },
  { src: 'la maison des wraps combo boll curry.png', dest: 'combo_bol_curry.png' },
  { src: 'la maison des wraps assiette biryani.png', dest: 'assiette_biryani.png' },
  { src: 'la maison des wraps assiette biryani et raita.png', dest: 'assiette_biryani_raita.png' },
  { src: 'la maison des wraps assiette Kebab au poulet 2.png', dest: 'assiette_kebab_poulet.png' },
  { src: 'la maison des wraps assiette poulet tikka.png', dest: 'assiette_poulet_tikka.png' },
  { src: 'la maison des wraps assiette poulet masala.png', dest: 'assiette_poulet_masala.png' },
  { src: 'la maison des wraps assiette mix 2 meet.png', dest: 'assiette_mix_2_viandes.png' },
  { src: 'la maison des wraps hamburger.png', dest: 'burger.png' },
  { src: 'la maison des wraps pain naan.png', dest: 'pain_naan_nature.png' },
  { src: 'la maison des wraps pain naan ail 2.png', dest: 'pain_naan_ail.png' },
  { src: 'la maison des wraps boll Riz.png', dest: 'bol_riz.png' },
  { src: 'la maison des wraps boissons lassi mangue.png', dest: 'lassi_mangue.png' },
  { src: 'la maison des wraps boissons lassi rose.png', dest: 'lassi_rose.png' },
  { src: 'la maison des wraps desserts Gulab jamun.png', dest: 'dessert_gulab_jamun.png' },
  { src: 'la maison des wraps desserts ras malai.png', dest: 'dessert_ras_malai.png' },
  { src: 'la maison des wraps poulet malai tikka.png', dest: 'wrap_poulet_malai_tikka.png' },
];

let copied = 0;
mappings.forEach(({ src, dest }) => {
  const fullSrc = path.join(srcDir, src);
  if (fs.existsSync(fullSrc)) {
    targets.forEach(t => {
      fs.copyFileSync(fullSrc, path.join(t, dest));
    });
    copied++;
    console.log(`Synced: ${src} -> ${dest}`);
  } else {
    console.warn(`Missing: ${src}`);
  }
});

console.log(`\nSuccessfully synced ${copied} authentic food photos to assets/food!`);
