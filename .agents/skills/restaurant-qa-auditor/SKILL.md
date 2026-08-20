---
name: restaurant-qa-auditor
description: Comprehensive Quality Assurance (QA) and End-to-End Test Engine for multi-app restaurant delivery systems (Client, Kitchen KDS, Driver/Store Dispatch, Admin).
triggers:
  - QA audit
  - test restaurant app
  - verify order flow
  - check kitchen kds
  - driver dispatch test
  - admin dashboard audit
---

# Restaurant Delivery Multi-App QA & Reliability Engine

## Core Principles
1. **Financial & Data Integrity**: Client cart totals, tax, modifier add-ons, and dynamic delivery fees must be verified server-side.
2. **Real-time Ticket Synchronization**: Order status transitions (placed -> accepted -> preparing -> ready_for_pickup -> in_transit -> delivered) must broadcast instantly across Client, Kitchen, Store/Driver, and Admin screens.
3. **Sound & Haptic Alerts**: Kitchen KDS and Store Dispatchers must receive looping acoustic alerts until incoming tickets are acknowledged.
4. **Bilingual Completeness**: English and French string fallbacks for all UI elements, custom modifiers, nutritional info, and error dialogs.
5. **Security & RBAC**: Strict Row-Level Security (RLS) / Firestore Security Rules ensuring users can only read their own orders and couriers only update assigned deliveries.
