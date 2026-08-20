---
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
* Minimum touch target: `48x48dp` for all interactive elements.
* Safe area inset handling for iPhone Dynamic Island and Android navigation bars.
* Haptic and visual feedback on button taps and cart additions.

## 3. Offline & Performance
* Image caching with local asset bundle patterns (`**/*`).
* Instant startup with `expo-observe` performance tracking (`markInteractive()`).
* Cross-platform camera permissions for QR scanning with instant PIN fallback.
