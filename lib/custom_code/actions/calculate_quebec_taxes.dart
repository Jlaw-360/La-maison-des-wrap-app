/// Calculates Quebec Taxes (TPS 5.000% & TVQ 9.975%)
/// Returns Map with tps, tvq, and grandTotal
class QuebecTaxResult {
  final double subtotal;
  final double deliveryFee;
  final double tps;
  final double tvq;
  final double grandTotal;

  QuebecTaxResult({
    required this.subtotal,
    required this.deliveryFee,
    required this.tps,
    required this.tvq,
    required this.grandTotal,
  });
}

double calculateTPS(double taxableAmount) {
  return double.parse((taxableAmount * 0.05).toStringAsFixed(2));
}

double calculateTVQ(double taxableAmount) {
  return double.parse((taxableAmount * 0.09975).toStringAsFixed(2));
}

double calculateGrandTotal(double subtotal, double deliveryFee) {
  double taxableAmount = subtotal + deliveryFee;
  double tps = calculateTPS(taxableAmount);
  double tvq = calculateTVQ(taxableAmount);
  return double.parse((taxableAmount + tps + tvq).toStringAsFixed(2));
}
