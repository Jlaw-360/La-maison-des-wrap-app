---
name: restaurant-delivery-architect
description: >
  Comprehensive architecture, dynamic pricing logic, and multi-role workflow
  instructions for building and maintaining the La Maison des Wraps bilingual
  ordering and in-house delivery system.
---

# Instructions for Restaurant Delivery System: La Maison des Wraps

## 1. System Philosophy & Architecture
- **Single Full-Stack Codebase:** Build a unified application sharing ONE central database (PostgreSQL / Supabase / Firestore) across three distinct user roles: `customer`, `store`, and `driver`.
- **Role-Based Access Control (RBAC):**
  * `customer`: Accesses `/order` (Menu, Cart, Checkout, Live Tracking, In-App Chat).
  * `store`: Accesses `/kitchen` (Kanban Board, Audio Chime Alerts, Order QR Generation, Inventory Toggles).
  * `driver`: Accesses `/driver` (Queue of Ready Orders, QR Camera Scanner, Live GPS Streaming, Photo Drop-Off).
- **Localization:** Bilingual with a top header switcher: **Français (FR - Default)** and **English (EN)**. All UI labels, menu items, and error messages must support both languages.

---

## 2. Visual Design System (Black & Orange Theme)
- **Aesthetic:** Modern dark-mode restaurant operations console with vivid flame-orange accents.
- **Color Palette:**
  * Background: `#121212` (Deep Charcoal / Near-Black)
  * Card Surfaces: `#222222` (Dark Slate)
  * Primary Action / Brand Accent: `#FF5500` / `#FF6600` (Vivid Flame Orange)
  * Primary Text: `#FFFFFF` (Clean White) & `#F5F5F5` (Ivory)
  * Secondary Text / Borders: `#A0A0A0` & `#333333`
  * Status Badges: Orange (`En Préparation`, `En Livraison`), Green (`Prêt`, `Livré`), Red (`Annulé`).

---

## 3. Database Schema & Data Models

### Table: `users`
* `id` (UUID / String, Primary Key)
* `name` (String), `email` (String), `phone` (String)
* `role` (Enum: `'customer'`, `'store'`, `'driver'`) — *Default: 'customer'*
* `preferred_language` (String: `'fr'` | `'en'`)
* `created_at` (Timestamp)

### Table: `menu_items`
* `id` (UUID / String, Primary Key)
* `category` (String)
* `name_fr` (String), `name_en` (String)
* `description_fr` (String), `description_en` (String)
* `base_price` (Decimal / Float)
* `is_available` (Boolean, Default: `true`)
* `image_url` (String)
* `options_json` (JSON / Data Type)

### Table: `orders`
* `id` (UUID / String, Primary Key)
* `customer_id` (Foreign Key -> `users.id`)
* `driver_id` (Foreign Key -> `users.id`, Nullable)
* `status` (Enum: `'placed'`, `'accepted'`, `'preparing'`, `'ready'`, `'picked_up'`, `'delivered'`, `'cancelled'`)
* `fulfillment_type` (Enum: `'pickup'`, `'delivery'`)
* `delivery_preference` (Enum: `'leave_at_door'`, `'hand_to_me'`)
* `subtotal` (Decimal), `delivery_fee` (Decimal), `tps_tax` (Decimal), `tvq_tax` (Decimal), `total` (Decimal)
* `delivery_address` (String), `notes` (String)
* `qr_code_string` (String)
* `driver_lat` (Float, Nullable), `driver_lng` (Float, Nullable)
* `dropoff_photo_url` (String, Nullable)
* `created_at` (Timestamp)

### Table: `order_items`
* `id` (UUID / String, Primary Key)
* `order_id` (Foreign Key -> `orders.id`)
* `menu_item_id` (Foreign Key -> `menu_items.id`)
* `quantity` (Integer), `unit_price` (Decimal), `line_total` (Decimal)
* `bread_type` (String, Nullable), `format` (String: `'seul'` | `'trio'`)
* `side_choice` (String, Nullable), `drink_choice` (String, Nullable)
* `sauces` (JSON Array), `salad_choice` (String, Nullable), `extras` (JSON Array)

### Table: `chats`
* `id` (UUID / String, Primary Key)
* `order_id` (Foreign Key -> `orders.id`)
* `sender_role` (String: `'customer'` | `'driver'` | `'store'`)
* `message` (String), `created_at` (Timestamp)

---

## 4. Menu & Dynamic Pricing Engine (Source: https://www.lamaisondeswraps.ca/menu)

### Dynamic Wrap Logic (Mandatory Selection Flow):
1. **Bread Modifiers:**
   * `Pain Kebab`: Base Price ($8.95 Seul / $14.25 Trio)
   * `Pain Tortilla`: +$1.00 ($9.95 Seul / $15.25 Trio)
   * `Pain Naan`: +$2.00 ($10.95 Seul / $16.25 Trio)
   *(Special base items: Steak Fromage starts at $9.75; Wrap Mix 2 Viandes starts at $9.95).*
2. **Format Modifiers:**
   * `Seul`: Base sandwich price.
   * `Trio`: +$5.30 add-on. Prompts for:
     - Side: `Frites` ($0.00) OR `Patates à l'Ail` ($0.00).
     - Drink: `Canette` ($0.00), `Eau` ($0.00), `Bouteille Jarritos` (+$1.00), `Lassi` (+$2.25).
3. **Sauces (Multi-Select):** `Mayo`, `Ketchup`, `Moutarde`, `Harissa`, `Maison`, `Verte`, `Sauce à l'Ail`, `Thaï`.
4. **Extras (Multi-Select):** `Extra Œuf` (+$0.99), `Extra Fromage Cheddar` (+$0.99).

### Full Menu Categories:
* **Paninis ($9.25 Seul / $14.45 Trio):** *Poulet Tikka, Masala, Thon, Saumon, Fromage, Viande Hachée*.
* **Bols de Curry & Combos:**
  * Non-Veg ($17.65): *Poulet au Beurre, Poulet Curry, Malai Tikka, Crevettes, Palak*.
    - Combo 1 ($21.35, +Riz), Combo 2 ($24.35, +Riz+Naan Fromage), Combo 3 ($25.35, +Riz+Naan Fromage+Boisson).
  * Veg ($15.25): *Paneer Makhani, Palak Paneer* (Combos: $18.35 / $21.35 / $22.35).
* **Biryani ($18.85 with Raita included):** *Biryani Poulet, Biryani Crevette*.
* **Nos Assiettes ($17.65 Seul / $19.15 avec Boisson; Mix $19.95 / $21.20):**
  * Includes: Salad choice (*Maison, Chou, Macaroni, Nouilles sautées*), Side (*Frites* or *Patates à l'Ail*), Basmati Rice, and Pain Kebab.
* **Nos Burgers:** *Burger Poulet ($8.45/$13.45), Cheese ($6.95/$11.95), Double Cheese ($6.75/$11.70), Burger Végé ($6.75/$11.75)*.
* **Nos Poutines:**
  * Base: *Avec Frites* ($11.35–$14.95 Petit / $14.45–$17.95 Grand) vs. *Avec Patates à l'Ail* ($12.75–$16.25 Petit / $15.75–$19.25 Grand).
  * Sauce: *Sauce Brune* vs. *Sauce Poulet au Beurre*.
* **Sides & Naans:** Naans ($3.00–$5.50), Samosas ($4.65/$5.65), Frites ($5.95/$8.00), Nuggets ($7.90/$11.90/$16.90), Rondelles d'Oignons ($6.95), Riz ($5.25).
* **Menu Enfant:** Nuggets+Frites+Boisson ($8.95), Petite Assiette Poulet+Frites+Boisson ($9.50).
* **Boissons & Desserts:** Lassi ($4.50), Jarritos ($3.25), Canette ($2.25), Eau ($1.75), Gulab Jamun ($4.99), Ras Malai ($4.99).

---

## 5. Role Workflows & Feature Contracts

### A. Customer Role (`/order`)
1. Browse categorized menu with top category tabs and search filter.
2. Customization modal calculates exact subtotal based on chosen bread, format, and add-ons.
3. Cart calculates Quebec sales taxes (**TPS 5% + TVQ 9.975%**) and delivery fee.
4. Checkout allows selecting **Pickup** vs. **Delivery** (*Laissez à la porte* vs. *Remise en main propre*) and card payment via Stripe.
5. Live order timeline displays progress. While status is `picked_up`, render a real-time Google Map with a moving driver marker and active in-app chat.
6. Display the driver's drop-off photo on the final receipt screen upon completion.

### B. Kitchen / Store Role (`/kitchen`)
1. High-contrast Kanban board with 5 columns: `Nouveau` -> `En Préparation` -> `Prêt` -> `En Livraison` -> `Terminé`.
2. Play a looping audio chime when an order is in `Nouveau` until staff click 'Accepter'.
3. Automatically render a scannable Order QR Code encoding the `order_id` when the ticket status changes to `ready`.
4. Inventory tab allows toggling any menu item or ingredient to `is_available: false` (Sold Out).

### C. In-House Driver Role (`/driver`)
1. Displays queue of orders with status `ready`.
2. Tapping 'Scan Store QR Code' activates the device camera to scan the QR code displayed on the kitchen tablet.
3. Scanning updates status to `picked_up`, assigns `driver_id`, and unlocks the customer delivery address with a one-tap navigation link (Google Maps / Waze) and in-app chat.
4. Stream device GPS coordinates (`driver_lat`, `driver_lng`) periodically via `navigator.geolocation.watchPosition`.
5. For *Laissez à la porte*, require capturing a doorstep photo with the camera.
6. Tapping 'Complete Delivery' updates status to `delivered`, clears the GPS watcher (`clearWatch()`), closes the chat, and attaches the proof photo to the order record.

---

## 6. Verification Checklist for AI Agent
- [ ] Role-based conditional routing works for all 3 user roles.
- [ ] Wrap price dynamically recalculates on bread selection (Kebab vs. Tortilla vs. Naan) and format selection (Seul vs. Trio).
- [ ] Kitchen Kanban tickets show exact bread, side, drink, sauces, and delivery preference.
- [ ] QR code scanning from the driver phone unlocks address data and transitions status from `ready` to `picked_up`.
- [ ] Driver GPS updates live on the customer map and shuts off immediately when marked `delivered`.
- [ ] English and French translations are complete across all pages.
