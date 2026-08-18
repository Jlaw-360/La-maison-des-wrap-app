---
name: flutterflow-architect
description: >
  Expert FlutterFlow and Flutter architecture skill for designing, generating,
  and maintaining FlutterFlow widget trees, Firebase/Supabase database schemas,
  custom actions, and multi-role app logic.
---

# Instructions for FlutterFlow Development & Architecture

## 1. System Philosophy & Best Practices
- **Visual-to-Code Mapping:** Build and structure components following FlutterFlow conventions (Widget Tree hierarchy, Components, App State, Page State, and Action Flows).
- **Responsive Layouts:** Use `Column`, `Row`, `Wrap`, `Container`, and `Expanded`/`Flexible` widgets with mobile-first constraints. Always set safe areas and adaptive padding.
- **State Management:**
  * Use **App State** for global session data (Cart items, authenticated user roles, language toggle).
  * Use **Page / Component State** for local UI states (active tabs, quantity counters, modal options).
- **Localization:** Ensure all text widgets reference `FFLocalizations.of(context).getText(...)` with default French (FR) and secondary English (EN).

---

## 2. Data Modeling & Backend (Firebase Firestore / Supabase)
- **Document References:** Use strict Document References (`DocRef`) for relational data (e.g., `orders.customer_ref` -> `users`, `orders.driver_ref` -> `users`).
- **Data Types (Custom Structs):** For nested arrays like `order_items`, define a FlutterFlow Struct/DataType:
  * `item_name` (String), `quantity` (Integer), `unit_price` (Double), `bread_type` (String), `format` (String), `side_choice` (String), `drink_choice` (String), `sauces` (List<String>), `extras` (List<String>), `line_total` (Double).
- **Real-Time Streams:** Use single-document and collection live queries for order tracking, kitchen Kanban updates, and live in-app chat.

---

## 3. Action Flows & Business Logic Rules
- **Conditional Routing (Post-Login):**
  * Evaluate `authenticatedUser.role`.
  * If `role == 'customer'` -> Navigate to `CustomerHomePage`.
  * If `role == 'store'` -> Navigate to `KitchenDashboardPage`.
  * If `role == 'driver'` -> Navigate to `DriverDashboardPage`.
- **Dynamic Price Calculations:**
  * When modifying wraps/combos, calculate total dynamically: `BasePrice + BreadModifier + FormatModifier + Extras`.
- **Hardware Actions:**
  * **QR Scanner:** Use FlutterFlow `Scan Barcode/QR Code` action. Verify scanned `order_id` in database before updating status.
  * **Camera Capture:** Use `Upload Media (Camera)` action to upload doorstep photos to Firebase Storage.
  * **Geolocation:** Use `Get Current Device Location` / background LatLng updates for driver tracking.

---

## 4. FlutterFlow MCP & CLI Integration
When using the FlutterFlow MCP Server:
- Use project reference `maison-wraps-7fbdj4` (or configured project ID).
- Use transactional change sets: inspect project -> plan component edits -> validate schemas -> apply updates.
- Keep `FLUTTERFLOW_API_TOKEN` configured in the environment.
