import 'dart:math' as math;

/// Calculates tiered delivery fee for La Maison des Wraps (Drummondville, QC)
/// - 0.0 km to 5.0 km: FREE ($0.00 CAD)
/// - 5.1 km to 10.0 km: $4.99 CAD
/// - 10.1 km to 15.0 km: $9.99 CAD
/// - 15.1 km to 18.0 km: $12.99 CAD
/// - > 18.0 km: Out of delivery range (returns -1.0)
double calculateDeliveryFee(double distanceKm) {
  if (distanceKm < 0) return 0.0;
  if (distanceKm <= 5.0) return 0.00;
  if (distanceKm <= 10.0) return 4.99;
  if (distanceKm <= 15.0) return 9.99;
  if (distanceKm <= 18.0) return 12.99;
  return -1.0; // Out of delivery range
}

/// Calculate distance in km between store (998 110e Ave) and customer coordinates using Haversine formula
double calculateDistanceToStore(double customerLat, double customerLng) {
  const double storeLat = 45.8828;
  const double storeLng = -72.4842;
  const double earthRadiusKm = 6371.0;

  double dLat = _degreesToRadians(customerLat - storeLat);
  double dLng = _degreesToRadians(customerLng - storeLng);

  double a = math.sin(dLat / 2) * math.sin(dLat / 2) +
      math.cos(_degreesToRadians(storeLat)) *
          math.cos(_degreesToRadians(customerLat)) *
          math.sin(dLng / 2) *
          math.sin(dLng / 2);

  double c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  return earthRadiusKm * c;
}

double _degreesToRadians(double degrees) {
  return degrees * (math.pi / 180.0);
}
