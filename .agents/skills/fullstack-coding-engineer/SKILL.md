---
name: fullstack-coding-engineer
description: Expert coding skill for building robust, scalable restaurant applications across React Native (Mobile iOS/Android), Web (PWA), and Node/Edge Backends with Supabase and Stripe.
---

# Fullstack Coding Engineer for Restaurant Systems

## 1. Clean Architecture & Code Standards
* **Cross-Platform Parity**: Ensure identical business logic, data models, and calculations across Web (`index.html`, `src/`) and Mobile (`mobile/src/`).
* **Strict Typing & Error Handling**:
  * Type-safe interfaces for Menu Items, Orders, Order Items, Customers, and GPS tracking.
  * Graceful fallback mechanisms for network drops, offline caching, and missing camera permissions.
* **Reactive State Management**:
  * Cart Context: Instant subtotal, Quebec taxes (TPS 5%, TVQ 9.975%), dynamic delivery fee, and discount calculations.
  * Auth Context: Supabase & BetterAuth session persistence with local storage sync.
  * Realtime Context: Live WebSocket listening on Supabase `orders` and `order_chats` tables.

## 2. API Integration Standards
* **Supabase Client (`@supabase/supabase-js`)**:
  * Centralized initialization with URL and anon key.
  * Direct table CRUD and realtime subscriptions (`supabase.channel('public:orders')`).
* **Stripe Payment Elements**:
  * Serverless payment intent creation with currency conversion (`amount * 100`).
  * Direct client confirmation via Stripe.js and `@stripe/stripe-react-native`.
* **Google Maps Distance Matrix**:
  * Precision distance measurement from restaurant origin (`998 110e Avenue, Drummondville`) with mileage tiers.
