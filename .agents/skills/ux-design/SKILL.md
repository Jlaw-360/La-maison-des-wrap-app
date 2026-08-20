---
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
* Dynamic delivery fee calculator based on real-time distance from `998 110e Avenue, Drummondville`.
* 1-Click Apple Pay / Google Pay integration via Stripe Elements.

## 3. Order Tracking Feedback Loop
* Real-time 4-step progress: Reçue -> En préparation (5-10 min) -> Prête -> Livrée.
* Dual Delivery Verification:
  * Hand-it-to-me: 4-digit PIN or QR scan.
  * Leave-at-door: Driver photo capture uploaded to Supabase Storage.
