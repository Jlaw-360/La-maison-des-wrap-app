# La Maison des Wraps - Full-Stack Restaurant & Delivery App

Official mobile and web ordering, kitchen operations, and in-house delivery system for **La Maison des Wraps** (998 110e Avenue, Drummondville, QC · 819 850-3972 · [maisondeswraps.ca](https://www.maisondeswraps.ca/)).

---

## Overview

A unified application connected to FlutterFlow project `maison-wraps-7fbdj4` supporting three distinct user roles:
1. **Customer Role (`/order`)**: Dark-themed bilingual ordering experience with Papa Johns/modern app-style layout, 11-category circular filter, dynamic wrap customizer, Quebec tax calculator (TPS 5% + TVQ 9.975%), Stripe checkout, and live GPS driver tracking.
2. **Kitchen Staff Role (`/kitchen`)**: High-contrast 5-column Kanban board, continuous audio alert loop for new orders, and automatic Order QR code generator for courier dispatch.
3. **In-House Driver Role (`/driver`)**: Mobile dispatch portal with camera QR scanner to claim orders, live GPS streaming, in-app customer chat, and doorstep photo delivery verification.

---

## 🎨 Visual Design System (Black & Flame Orange)

- **Primary Brand Accent**: Vivid Flame Orange (`#FF5500` / `#FF6600`)
- **Background**: Deep Charcoal / Near-Black (`#121212` / `#181818`)
- **Card Surfaces**: Dark Slate (`#222222` / `#282828`)
- **Typography**: Clean White (`#FFFFFF`) and Ivory (`#F5F5F5`) with `Outfit` (Headings) and `Inter` (Body)
- **Status Accents**: Orange (`En Préparation`), Green (`Prêt / Livré`), Red (`Annulé`)

---

## 📂 Repository Contents

- **`data/`**:
  - `menu.csv` / `menu.json`: 59 official bilingual menu items across 11 categories with CAD pricing and modifiers.
  - `order_flows.md`: Complete 10-category modal logic and dynamic pricing engine.
  - `app_ui_spec.md`: UI and mobile architecture specification inspired by modern food ordering apps.
- **`.agents/skills/`**:
  - `restaurant-delivery-architect`: Complete architectural rules, dynamic pricing, and multi-role workflows.
  - `community-ff-mcp`: FlutterFlow MCP development and YAML management.
  - `ui-ux-pro-max`, `mobile-app-ui-design`, `brand`, `design-system`, `ui-styling`, `banner-design`: Design tokens and UI skills.
  - `firebase-*`: Full suite of Firebase backend skills (Auth, Firestore, Remote Config, Hosting, etc.).

---

## 🚀 Dynamic Pricing Engine

1. **Bread Modifiers**:
   - `Pain Kebab`: Base Price ($8.95 Seul / $14.25 Trio)
   - `Pain Tortilla`: +$1.00 ($9.95 Seul / $15.25 Trio)
   - `Pain Naan`: +$2.00 ($10.95 Seul / $16.25 Trio)
2. **Format Modifiers**:
   - `Seul`: Base sandwich price.
   - `Trio`: +$5.30 add-on (Prompts for Side: Frites / Patates à l'Ail and Drink: Canette, Eau, Jarritos +$1.00, Lassi +$2.25).
3. **Sauces & Extras**:
   - Sauces: Mayo, Ketchup, Moutarde, Harissa, Maison, Verte, Sauce à l'Ail, Thaï.
   - Extras: Extra Œuf (+$0.99), Extra Fromage Cheddar (+$0.99).
4. **Quebec Taxes**: Subtotal + Delivery &rarr; `TPS (5.000%)` + `TVQ (9.975%)` = Total.

---

## 📍 Location & Contact
- **Address**: 998 110e Avenue, Drummondville, QC J2B 6X2
- **Phone**: (819) 850-3972
- **Website**: https://www.maisondeswraps.ca
- **App Domain**: https://app.maisondeswraps.ca (or https://la-maison-des-wrap-app.vercel.app)

