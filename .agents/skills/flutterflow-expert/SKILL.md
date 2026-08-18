---
name: flutterflow-expert
description: >
  Comprehensive FlutterFlow engineering, custom action development, layout
  optimization, and systematic bug diagnosis skill. Use when creating
  FlutterFlow components, connecting Firebase/Supabase backends, fixing render
  overflows, or resolving action flow errors.
---

# Instructions for FlutterFlow Engineering & Bug Resolution

## 1. Core Architecture & Component Standards
- **Widget Tree Hierarchy:**
  * Avoid deeply nested columns without explicit height constraints.
  * Use `Expanded` or `Flexible` strictly inside a `Row`, `Column`, or `Flex`. Never wrap an unbounded scrollable (like `ListView` or `GridView`) inside `Expanded` without a bounded parent `Container` or `SizedBox`.
  * For horizontal category pickers, use `ListView` (horizontal) with an explicit height (e.g., `50px`) or a `Wrap` widget with spacing.
- **State Management Separation:**
  * **App State:** Global session data (User role, Cart line items, Language toggle). Ensure 'Persist to Local Storage' is checked only for session tokens or language preferences.
  * **Page State:** Ephemeral form selections (active tab index, search text, temp item quantity).
  * **Component State:** Internal reusable widget states (e.g., counter inside item modal).

---

## 2. Common FlutterFlow Bug Diagnostics & Fixing Protocols

### A. Layout & Render Overflow Errors (`A RenderFlex overflowed by X pixels`)
* **Diagnosis:** Content exceeds screen width/height or unconstrained text inside a `Row`.
* **Fixing Protocol:**
  1. For text inside a `Row`, wrap the `Text` widget in an `Expanded` widget and set `Max Lines` with `Overflow: Ellipsis`.
  2. For forms and long pages, ensure the top-level `Column` has `Scrollable: ON` (or is placed inside a `SingleChildScrollView`).
  3. Ensure `Image` widgets have explicit width/height or `BoxFit.cover` inside a fixed-dimension container to prevent layout shifts.

### B. Null Check Operator Used on a Null Value (`Null check operator used on a null value`)
* **Diagnosis:** An action or widget expression attempted to read a field that is empty/null from Firestore, Supabase, or App State.
* **Fixing Protocol:**
  1. Always set **Default Values** for nullable fields in text widgets (e.g., default string `""`, default number `0.00`, default boolean `false`).
  2. In Action Flows, add a **Conditional Action** before accessing nested properties (e.g., check `if (order_items != null && order_items.isNotEmpty)` before calculating totals).

### C. Infinite Action Flow Loops & Re-render Freezes
* **Diagnosis:** An Action Flow updates an App State/Page State variable on page load or within a periodic action without an exit condition.
* **Fixing Protocol:**
  1. Add an execution gate (boolean flag `isLoading` or `isInitialized`) in Page State.
  2. Check `if (!isInitialized)` before executing the fetch/setup flow, then set `isInitialized = true`.

### D. Custom Action / Custom Function Dart Compile Errors
* **Diagnosis:** Missing package imports, type mismatches (e.g., `num` vs `double`), or missing null-safety operators (`?`, `!`).
* **Fixing Protocol:**
  1. Ensure return types explicitly match FlutterFlow schema (e.g., `Future<List<String>>` for async actions, `double` for currency math).
  2. Include explicit null checks:
     ```dart
     double calculateTotal(double basePrice, double? modifier, int quantity) {
       final mod = modifier ?? 0.0;
       return (basePrice + mod) * quantity;
     }
     ```
  3. Declare custom dependencies under **Custom Action Settings** (e.g., `intl: ^0.19.0`, `uuid: ^4.0.0`).

### E. Backend & Security Rule Failures (Firebase / Supabase)
* **Diagnosis:** Permission Denied when querying collections or updating orders.
* **Fixing Protocol:**
  1. Ensure the user's `role` field is correctly written to `users/{uid}` on signup.
  2. Verify rules allow:
     - `customer`: Read/Write where `request.auth.uid == resource.data.customer_id`.
     - `driver`: Read where `status == 'ready'`, Read/Write where `resource.data.driver_id == request.auth.uid`.
     - `store`: Full Read/Write access across all `orders`.

---

## 3. Implementation Checklist for Multi-Role Restaurant Apps
When building or debugging restaurant apps like **La Maison des Wraps**:
- [ ] **Role Routing:** Confirm post-login conditional actions branch cleanly to `/order`, `/kitchen`, and `/driver`.
- [ ] **Dynamic Bread & Combo Modifiers:** Verify calculations recalculate accurately on selection chips change.
- [ ] **QR Code Verification:** Ensure the Barcode Scanner action checks `order_id` existence before changing status to `picked_up`.
- [ ] **Live Location Cleanup:** Ensure `Stop Location Updates` fires immediately when status becomes `delivered`.
- [ ] **Bilingual Fallbacks:** Verify all text strings have localized values in both French (`fr`) and English (`en`).
