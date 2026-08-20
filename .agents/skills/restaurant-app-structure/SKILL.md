---
name: restaurant-app-structure
description: Architecture specification for 4-in-1 multi-role restaurant ecosystem (Client, Kitchen KDS, Driver Dispatch, Admin Master Console) backed by Supabase and Cloudflare Edge.
---

# Fullstack Restaurant App Structure & Architecture

## 1. 4-Portal Unified Ecosystem
1. **Client App (`/index.html` & React Native)**:
   - Full ordering, customization, points redemption, live GPS tracking, in-app messaging.
2. **Kitchen KDS (`/kitchen.html` - Tablet Landscape)**:
   - Real-time ticket Kanban (À Préparer, En Préparation, Prêtes), persistent audio ringing loop for new orders, customer PIN verification.
3. **Driver Dispatch (`/driver.html` - Mobile Phone)**:
   - Order intake, restaurant bag scan, turn-by-turn navigation link (Waze/Google Maps), customer PIN confirmation & photo upload.
4. **Admin Executive Console (`/admin.html` - Desktop)**:
   - Real-time revenue analytics, Quebec TPS/TVQ tax reports, customer database, role assignment (Client, Driver, Kitchen, Admin).

## 2. Supabase Backend Schema (`zldxbaykxgdraxvejkdr`)
* `menu_items`: id, name_fr, name_en, description_fr, description_en, category, price_cad, image_url, is_active, points_cost.
* `orders`: id, order_number, user_id, status, fulfillment, total_amount, subtotal, tps, tvq, delivery_fee, tip, delivery_address, pickup_token, delivery_token, backup_pin, delivery_photo_url, created_at.
* `order_items`: id, order_id, menu_item_id, item_name, quantity, unit_price, options_json.
* `order_chats`: id, order_id, sender_name, sender_role, message, created_at.
* `users`: id, email, full_name, phone, address, role, points_balance.
* `driver_locations`: id, driver_id, lat, lng, updated_at.

## 3. Cloudflare Edge Deployment
* Pages / Workers deployment with `wrangler.toml` (`name = "la-maison-des-wrap-app"`).
* Edge Functions in `functions/api/` (Distance matrix, Stripe payment intent, BetterAuth endpoints).
* Automatic worldwide CDN caching with 100% free unlimited bandwidth.
