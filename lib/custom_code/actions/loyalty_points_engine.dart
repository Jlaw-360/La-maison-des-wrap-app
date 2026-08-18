import 'dart:math' as math;

/// Loyalty Points Engine for La Maison des Wraps (Drummondville, QC)
///
/// 1. Earn Rule: 1 Point per $1 CAD spent on subtotal.
/// 2. Redemption Rule:
///    - 50 pts  = Free Canette / Drink ($2.50 value)
///    - 80 pts  = Free 2 Samosas ($4.00 value)
///    - 150 pts = Free Wrap / Panini ($9.75 value)
///    - 250 pts = Free Curry Bowl ($17.65 value)
/// 3. Minimum Quantity Requirement:
///    - Must have at least 1 paid item AND minimum subtotal of $15.00 CAD to redeem points.

class LoyaltyReward {
  final String id;
  final String titleFr;
  final String titleEn;
  final int pointsCost;
  final double dollarValue;
  final int minPaidItemsRequired;
  final double minSubtotalRequired;

  const LoyaltyReward({
    required this.id,
    required this.titleFr,
    required this.titleEn,
    required this.pointsCost,
    required this.dollarValue,
    this.minPaidItemsRequired = 1,
    this.minSubtotalRequired = 15.00,
  });
}

const List<LoyaltyReward> kLoyaltyCatalog = [
  LoyaltyReward(
    id: "reward_drink",
    titleFr: "Boisson / Canette Gratuite",
    titleEn: "Free Beverage / Soda",
    pointsCost: 50,
    dollarValue: 2.50,
    minPaidItemsRequired: 1,
    minSubtotalRequired: 10.00,
  ),
  LoyaltyReward(
    id: "reward_samosas",
    titleFr: "2 Samosas Croustillants Gratuits",
    titleEn: "2 Free Crispy Samosas",
    pointsCost: 80,
    dollarValue: 4.00,
    minPaidItemsRequired: 1,
    minSubtotalRequired: 15.00,
  ),
  LoyaltyReward(
    id: "reward_wrap",
    titleFr: "1 Wrap ou Panini au Choix Gratuit",
    titleEn: "1 Free Wrap or Panini of Choice",
    pointsCost: 150,
    dollarValue: 9.75,
    minPaidItemsRequired: 1,
    minSubtotalRequired: 15.00,
  ),
  LoyaltyReward(
    id: "reward_curry_bowl",
    titleFr: "1 Grand Bol de Curry au Beurre Gratuit",
    titleEn: "1 Free Large Butter Chicken Curry Bowl",
    pointsCost: 250,
    dollarValue: 17.65,
    minPaidItemsRequired: 1,
    minSubtotalRequired: 20.00,
  ),
];

/// Calculate points earned from order subtotal
int calculateEarnedPoints(double subtotalCad) {
  if (subtotalCad <= 0) return 0;
  return subtotalCad.floor();
}

/// Check if customer is eligible to redeem a reward
bool canRedeemReward({
  required int userCurrentPoints,
  required LoyaltyReward reward,
  required int cartPaidItemCount,
  required double cartSubtotalCad,
}) {
  if (userCurrentPoints < reward.pointsCost) return false;
  if (cartPaidItemCount < reward.minPaidItemsRequired) return false;
  if (cartSubtotalCad < reward.minSubtotalRequired) return false;
  return true;
}

/// Calculate customer loyalty tier badge based on lifetime points
String getLoyaltyTier(int lifetimePoints) {
  if (lifetimePoints >= 1000) return "Platine (15% Rabais Anniversaire)";
  if (lifetimePoints >= 500) return "Or (10% Rabais & Livraison Prioritaire)";
  if (lifetimePoints >= 200) return "Argent (5% Rabais & Samosa Offert)";
  return "Bronze (Membre)";
}
