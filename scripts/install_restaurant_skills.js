const fs = require('fs');
const path = require('path');

console.log("Installing and downloading comprehensive restaurant development skills...");

function ensureSkill(name, content) {
  const dir = path.join('.agents', 'skills', name);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'SKILL.md'), content);
  console.log(`✓ Installed skill: ${name}`);
}

// 1. Web Design Skill
const webDesignSkill = `---
name: web-design-architect
description: Master skill for building world-class fast-casual restaurant web applications. Covers high-converting visual layouts, fluid responsive grids, micro-interactions, accessibility (WCAG AA), and performance optimization.
---

# Web Design Architect for Restaurant Applications

## 1. Visual Hierarchy & Restaurant Aesthetic
* **Color Psychology**:
  * Dark Premium Palette: Deep obsidian/midnight black background (\`#0C0C0E\` / \`#151519\`) for maximum contrast and appetizing focus.
  * Signature Flame Accent: Fiery Tandoor Orange (\`#FF5500\` / \`#E04B00\`) for primary action buttons (Add to Cart, Checkout, Order Now).
  * Gold/Emerald Highlights: Imperial Gold (\`#E5A93C\`) for VIP rewards points and Emerald (\`#22C55E\`) for live open status and completed orders.
* **Card & Container Anatomy**:
  * Rounded organic corners (\`border-radius: 16px - 22px\`).
  * Subtle elevation with glowing shadows (\`box-shadow: 0 8px 24px rgba(255, 85, 0, 0.15)\`).
  * High-resolution dish photography occupying the top 50-60% of each product card.

## 2. Responsive Mobile-First Grid System
* Standard viewport: \`375px - 430px\` (Mobile Phone Fullscreen).
* Desktop presentation: Clean centered mobile frame (\`max-width: 480px; margin: 0 auto;\`) with smooth backdrop blur.
* Horizontal scroll category pills with kinetic momentum and zero visible scrollbars (\`scrollbar-width: none\`).

## 3. High-Converting Component Patterns
* **Sticky Top Header**: Brand logo, Drummondville location badge, live loyalty points counter, shopping bag with dynamic badge.
* **Fulfillment Switcher**: Direct Delivery vs In-Store Pickup toggle with live ETA indicator (25-35 min).
* **Dish Customizer Modal**: Sheet modal with bread options (Naan, Tortilla, Kebab), format options (Seul vs Trio), side choices, drink choices, and real-time total calculator.
`;

ensureSkill('web-design-architect', webDesignSkill);

// 2. App Design Skill
const appDesignSkill = `---
name: app-design
description: Mobile application UI/UX engineering for React Native and Expo targeting Apple App Store, Google Play Store, and Web.
---

# Mobile App Design (React Native & Expo)

## 1. Native Mobile Architecture (iOS & Android)
* **Bottom Navigation**: 5-tab bar with elevated center action button for QR Scan & Rewards Hub.
  * Tab 1: Accueil (Home Feed & Featured Picks)
  * Tab 2: Menu (Categorized Catalog with Search & Filters)
  * Center Tab: Scan & Points (Dynamic QR Code, 4-digit PIN, Rewards Redemption)
  * Tab 4: Suivi & Chat (Live Order Status, Driver Tracking & Messaging)
  * Tab 5: Compte & Profil (User info, Saved Addresses, Order History, Owner Access)

## 2. Touch Ergonomics & Component Standards
* Minimum touch target: \`48x48dp\` for all interactive elements.
* Safe area inset handling for iPhone Dynamic Island and Android navigation bars.
* Haptic and visual feedback on button taps and cart additions.

## 3. Offline & Performance
* Image caching with local asset bundle patterns (\`**/*\`).
* Instant startup with \`expo-observe\` performance tracking (\`markInteractive()\`).
* Cross-platform camera permissions for QR scanning with instant PIN fallback.
`;

ensureSkill('app-design', appDesignSkill);

// 3. UX Design Skill
const uxDesignSkill = `---
name: ux-design
description: Behavioral UX design, menu engineering, friction reduction, and loyalty gamification for QSR restaurant systems.
---

# UX Design & Behavioral Restaurant Engineering

## 1. Menu Engineering & Choice Architecture
* **Visual Anchor**: Feature high-margin signature items (Butter Chicken Bowl, Mix Platters, Naan Wraps) in the top hero slider.
* **Trio Upsell Loop**: Prompt "Transform into Trio with Fries & Drink" before adding to cart with transparent pricing (+$5.30).
* **Decoy & Bundling**: Group combos (Boîte Festin 4 Wraps, Combo Duo) for high average order value (AOV).

## 2. Zero-Friction Checkout Flow
* Auto-fill saved customer address and phone number.
* Clear tax breakdown (TPS 5% + TVQ 9.975% for Quebec compliance).
* Dynamic delivery fee calculator based on real-time distance from \`998 110e Avenue, Drummondville\`.
* 1-Click Apple Pay / Google Pay integration via Stripe Elements.

## 3. Order Tracking Feedback Loop
* Real-time 4-step progress: Reçue -> En préparation (5-10 min) -> Prête -> Livrée.
* Dual Delivery Verification:
  * Hand-it-to-me: 4-digit PIN or QR scan.
  * Leave-at-door: Driver photo capture uploaded to Supabase Storage.
`;

ensureSkill('ux-design', uxDesignSkill);

// 4. Restaurant App Structure Skill
const appStructureSkill = `---
name: restaurant-app-structure
description: Architecture specification for 4-in-1 multi-role restaurant ecosystem (Client, Kitchen KDS, Driver Dispatch, Admin Master Console) backed by Supabase and Cloudflare Edge.
---

# Fullstack Restaurant App Structure & Architecture

## 1. 4-Portal Unified Ecosystem
1. **Client App (\`/index.html\` & React Native)**:
   - Full ordering, customization, points redemption, live GPS tracking, in-app messaging.
2. **Kitchen KDS (\`/kitchen.html\` - Tablet Landscape)**:
   - Real-time ticket Kanban (À Préparer, En Préparation, Prêtes), persistent audio ringing loop for new orders, customer PIN verification.
3. **Driver Dispatch (\`/driver.html\` - Mobile Phone)**:
   - Order intake, restaurant bag scan, turn-by-turn navigation link (Waze/Google Maps), customer PIN confirmation & photo upload.
4. **Admin Executive Console (\`/admin.html\` - Desktop)**:
   - Real-time revenue analytics, Quebec TPS/TVQ tax reports, customer database, role assignment (Client, Driver, Kitchen, Admin).

## 2. Supabase Backend Schema (\`zldxbaykxgdraxvejkdr\`)
* \`menu_items\`: id, name_fr, name_en, description_fr, description_en, category, price_cad, image_url, is_active, points_cost.
* \`orders\`: id, order_number, user_id, status, fulfillment, total_amount, subtotal, tps, tvq, delivery_fee, tip, delivery_address, pickup_token, delivery_token, backup_pin, delivery_photo_url, created_at.
* \`order_items\`: id, order_id, menu_item_id, item_name, quantity, unit_price, options_json.
* \`order_chats\`: id, order_id, sender_name, sender_role, message, created_at.
* \`users\`: id, email, full_name, phone, address, role, points_balance.
* \`driver_locations\`: id, driver_id, lat, lng, updated_at.

## 3. Cloudflare Edge Deployment
* Pages / Workers deployment with \`wrangler.toml\` (\`name = "la-maison-des-wrap-app"\`).
* Edge Functions in \`functions/api/\` (Distance matrix, Stripe payment intent, BetterAuth endpoints).
* Automatic worldwide CDN caching with 100% free unlimited bandwidth.
`;

ensureSkill('restaurant-app-structure', appStructureSkill);

console.log("All restaurant development skills successfully downloaded and installed!");

