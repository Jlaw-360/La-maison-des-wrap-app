# UI & Architecture Specification: La Maison des Wraps App

Inspired by modern food ordering mobile experiences (Papa Johns / DoorDash / UberEats style) tailored with **La Maison des Wraps** branding:
- **Location**: 998 110e Avenue, Drummondville, QC
- **Phone**: 819 850-3972
- **Website**: [lamaisondeswraps.ca](https://www.lamaisondeswraps.ca/menu)

---

## 1. Visual Design System & Palette (Black & Flame Orange)

| Token Name | Hex Code | Purpose |
|---|---|---|
| **`primaryBrand`** | `#FF5500` / `#FF6600` | Flame Orange — Central Order Action, Add Buttons, CTAs, Highlights |
| **`primaryBackground`** | `#121212` (Dark) / `#FBF9F5` (Light) | App Background Canvas |
| **`surfaceCard`** | `#222222` (Dark) / `#FFFFFF` (Light) | Food cards, promo banners, modals |
| **`surfaceCardHover`** | `#2A2A2A` (Dark) / `#F5F3EE` (Light) | Active/selected ingredient chips |
| **`primaryText`** | `#FFFFFF` (Dark) / `#121214` (Light) | Headers, product titles, prices |
| **`secondaryText`** | `#A0A0A0` (Dark) / `#666666` (Light) | Descriptions, subtitles, calorie info |
| **`borderColor`** | `#333333` (Dark) / `#E5E5E5` (Light) | Dividers, search borders, chip outlines |
| **`badgeSuccess`** | `#22C55E` | Fresh veggie badge, "Prêt / Livré" status |
| **`badgeHot`** | `#FF3D00` | "Bestseller", "Wrap du Chef", "Populaire" |

---

## 2. Customer Home Screen Architecture (`CustomerHomeMenu`)

### A. Top Header
- **Left**: Hamburger menu icon `☰` & Bilingual Language Switcher (`FR` / `EN` pill).
- **Center**: **LA MAISON DES WRAPS** stylized logo + Drummondville location subtitle ("998 110e Ave").
- **Right**: Notification Bell with unread badge `🔔` and Shopping Bag with live item count `🛍️`.

### B. Search & Filter Bar
- High-contrast search input: *"Rechercher votre wrap, panini, poutine... / Search your favorite wrap..."*
- Right filter action button with sliders icon.

### C. Hero Promotional Carousel
- Dark emerald / charcoal card with glowing flame accents.
- Catchy banner copy:
  - **FR**: *"MEILLEURS INGRÉDIENTS. MEILLEURS WRAPS. Faits avec pâte fraîche et viandes marinées maison."*
  - **EN**: *"BETTER INGREDIENTS. BETTER WRAPS. Crafted with fresh dough & house-marinated meats."*
- **"Commander Maintenant / Order Now →"** flame-orange button.
- Slide pagination dots (with active flame-orange pill).

### D. Circular Category Scroll (11 Categories)
Horizontal scrolling circular icons with labels:
1. `Tous / All` (Flame Orange active circle)
2. `Wraps & Kebabs` 🥙
3. `Paninis` 🥪
4. `Bols de Curry` 🍛
5. `Biryani` 🍚
6. `Nos Assiettes` 🍽️
7. `Burgers` 🍔
8. `Poutines` 🍟
9. `À Côté & Naans` 🥖
10. `Menu Enfant` 👶
11. `Boissons & Desserts` 🥤

### E. Popular Wraps & Specialties Grid (2-Column Cards)
Each card features:
- Badge top-left: `BESTSELLER` (Red), `POPULAIRE` (Flame Orange), `NOUVEAU` (Green).
- Favorite Heart icon top-right `♡`.
- Premium high-resolution wrap image on dark slate board.
- Product Title: e.g., **Kebab au Poulet**, **Wrap Steak Fromage**, **Poulet Tikka**.
- Subtitle: Shaved tender seasoned meat, fresh salad, garlic sauce.
- Rating & Reviews: `★ 4.9 (1.4k)`.
- Bottom Row: Price (`$8.95`) + **Circular Flame-Orange (+) Quick-Add Button**.

### F. Exclusive Combo Deals Banner
- **"OFFRE EXCLUSIVE - TRIO DU CHEF"**: 1 Wrap + Frites ou Patates à l'Ail + Boisson à partir de $14.25.

---

## 3. The 5-Tab Floating Bottom Navigation Bar

The bottom bar features an **elevated circular center button** dedicated to the ordering experience:

```
+-------------------------------------------------------------+
|   🏠         📋             (  🛍️  )            🏷️          👤   |
|  Home       Menu           [ ORDER ]          Offers     Profile |
| (Accueil) (Catalogue)      (Commander)       (Promos)   (Compte) |
+-------------------------------------------------------------+
```

1. **Tab 1: Home (Accueil)**: Discover, hero carousel, trending items, quick re-order.
2. **Tab 2: Menu (Catalogue)**: Category list, dietary filters (Halal, Veggie, Spicy), full menu.
3. **Tab 3: CENTER BUTTON: Order / Cart (Commander)**:
   - **Design**: Elevated circular button with vivid flame-orange gradient (`#FF5500` &rarr; `#FF3D00`), subtle glowing shadow, white shopping bag icon `🛍️` or wrap icon `🥙`.
   - **Action**: Opens the Live Customization & Cart Modal / Quick-Order tray.
4. **Tab 4: Offers (Promotions)**: Daily specials, coupons, student discounts, loyalty points.
5. **Tab 5: Profile (Compte & Suivi)**: Order history, saved Drummondville delivery addresses, live order tracker.

---

## 4. Item Customization Modal (`ItemCustomizationModal`)

When any item is tapped, a slick bottom sheet emerges matching the 10-category rules in `data/order_flows.md`:
- **Header**: Item image, bilingual name, description, base price.
- **Dynamic Steps**:
  1. Bread Selection: `Pain Kebab ($8.95)`, `Tortilla (+$1.00)`, `Naan (+$2.00)`.
  2. Format: `Seul` vs `Trio (+$5.30)` (with Side & Drink pickers).
  3. Sauces: Multi-select chips (Mayo, Harissa, Maison, Verte, Ail, Thaï).
  4. Extras: `Extra Œuf (+$0.99)`, `Extra Cheddar (+$0.99)`.
- **Sticky Footer**:
  - Quantity counter `[-] 1 [+]`
  - Dynamic live price: `Ajouter au Panier • $15.24` (Flame Orange CTA button).

---

## 5. Live Order Tracking & Multi-Role Sync

- **Customer**: Live timeline (`Reçue` &rarr; `En Cuisine` &rarr; `En Livraison` &rarr; `Livrée`) + real-time Google Map with moving courier + drop-off photo on receipt.
- **Kitchen Kanban**: High-contrast 5-column board with loop audio chime for new orders + QR code generation for courier handover.
- **Driver Dispatch**: Mobile camera QR scan to claim order, live GPS streaming, and camera photo capture for doorstep delivery.
