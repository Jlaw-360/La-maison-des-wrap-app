import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  onOrderCompleted: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  visible,
  onClose,
  onOrderCompleted,
}) => {
  const { user, points, language } = useAuth();
  const {
    items,
    subtotal,
    deliveryFee,
    tpsTax,
    tvqTax,
    total,
    pointsEarned,
    pointsRequired,
    fulfillmentType,
    setFulfillmentType,
    deliveryType,
    setDeliveryType,
    deliveryAddress,
    setDeliveryAddress,
    deliveryNotes,
    setDeliveryNotes,
    isRedeemingPoints,
    setIsRedeemingPoints,
    updateQuantity,
    removeItem,
    submitOrder,
  } = useCart();

  const [loading, setLoading] = useState<boolean>(false);

  if (!visible) return null;

  const canRedeemPoints = points >= pointsRequired && pointsRequired > 0;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    const created = await submitOrder();
    setLoading(false);
    if (created) {
      onClose();
      onOrderCompleted();
    } else {
      alert(language === 'fr' ? 'Erreur lors de la création de la commande. Veuillez vérifier votre connexion.' : 'Error placing order. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              🛒 {language === 'fr' ? 'Votre Panier' : 'Your Cart'} ({items.reduce((s, i) => s + i.quantity, 0)})
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Empty State */}
            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🌯</Text>
                <Text style={styles.emptyTitle}>
                  {language === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
                </Text>
                <Text style={styles.emptySub}>
                  {language === 'fr'
                    ? 'Découvrez nos délicieux wraps, curries et poutines dans le menu!'
                    : 'Explore our delicious wraps, curries, and poutines in the menu!'}
                </Text>
              </View>
            ) : (
              <>
                {/* Cart Item Cards */}
                {items.map((item) => (
                  <View key={item.cart_id} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>
                        {language === 'fr' ? item.menu_item.name_fr : item.menu_item.name_en}
                      </Text>
                      {item.options.bread && (
                        <Text style={styles.optionDetail}>
                          🥖 Pain: {item.options.bread.toUpperCase()}
                        </Text>
                      )}
                      {item.options.format === 'trio' && (
                        <Text style={styles.optionDetail}>
                          🍟 Trio: {item.options.side_choice} + {item.options.drink_choice}
                        </Text>
                      )}
                      {item.options.sauces && item.options.sauces.length > 0 && (
                        <Text style={styles.optionDetail}>
                          🥫 Sauces: {item.options.sauces.join(', ')}
                        </Text>
                      )}
                      {item.options.notes && (
                        <Text style={styles.optionDetail}>
                          📝 Note: {item.options.notes}
                        </Text>
                      )}
                      <Text style={styles.itemPrice}>${item.line_total.toFixed(2)} CAD</Text>
                    </View>

                    {/* Quantity Controls */}
                    <View style={styles.qtyControl}>
                      <TouchableOpacity
                        style={styles.qtyBtnSmall}
                        onPress={() => updateQuantity(item.cart_id, item.quantity - 1)}
                      >
                        <Text style={styles.qtyBtnSmallText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyVal}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtnSmall}
                        onPress={() => updateQuantity(item.cart_id, item.quantity + 1)}
                      >
                        <Text style={styles.qtyBtnSmallText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Fulfillment Selector */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>
                    {language === 'fr' ? 'Mode de Récupération' : 'Fulfillment Method'}
                  </Text>
                  <View style={styles.toggleRow}>
                    <TouchableOpacity
                      style={[styles.toggleBtn, fulfillmentType === 'delivery' && styles.toggleBtnActive]}
                      onPress={() => setFulfillmentType('delivery')}
                    >
                      <Text style={[styles.toggleBtnText, fulfillmentType === 'delivery' && styles.textWhite]}>
                        🚗 {language === 'fr' ? 'Livraison (+3.50$)' : 'Delivery (+3.50$)'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.toggleBtn, fulfillmentType === 'pickup' && styles.toggleBtnActive]}
                      onPress={() => setFulfillmentType('pickup')}
                    >
                      <Text style={[styles.toggleBtnText, fulfillmentType === 'pickup' && styles.textWhite]}>
                        🏬 {language === 'fr' ? 'Ramassage (Gratuit)' : 'Pickup (Free)'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {fulfillmentType === 'delivery' && (
                    <View style={{ marginTop: 12 }}>
                      <Text style={styles.inputLabel}>{language === 'fr' ? 'Adresse à Drummondville' : 'Delivery Address'}</Text>
                      <TextInput
                        style={styles.input}
                        value={deliveryAddress}
                        onChangeText={setDeliveryAddress}
                        placeholder="998 110e Ave, Drummondville, QC"
                        placeholderTextColor="#777"
                      />

                      <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                        {language === 'fr' ? 'Préférence de livraison' : 'Delivery Preference'}
                      </Text>
                      <View style={styles.prefRow}>
                        <TouchableOpacity
                          style={[styles.prefBtn, deliveryType === 'hand_to_me' && styles.prefBtnActive]}
                          onPress={() => setDeliveryType('hand_to_me')}
                        >
                          <Text style={[styles.prefText, deliveryType === 'hand_to_me' && styles.textWhite]}>
                            🤝 {language === 'fr' ? 'Remise en main' : 'Hand to me'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.prefBtn, deliveryType === 'leave_at_door' && styles.prefBtnActive]}
                          onPress={() => setDeliveryType('leave_at_door')}
                        >
                          <Text style={[styles.prefText, deliveryType === 'leave_at_door' && styles.textWhite]}>
                            🚪 {language === 'fr' ? 'Laisser à la porte' : 'Leave at door'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Tim Hortons / McDo Points Redemption Toggle */}
                <View style={styles.pointsCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pointsCardTitle}>
                      🌟 {language === 'fr' ? 'Payer avec vos Points' : 'Pay with Rewards Points'}
                    </Text>
                    <Text style={styles.pointsCardSub}>
                      {language === 'fr'
                        ? `Solde actuel : ${points} pts · Requis : ${pointsRequired} pts`
                        : `Current Balance: ${points} pts · Required: ${pointsRequired} pts`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.redeemToggle,
                      isRedeemingPoints && styles.redeemToggleActive,
                      !canRedeemPoints && !isRedeemingPoints && styles.redeemToggleDisabled,
                    ]}
                    disabled={!canRedeemPoints && !isRedeemingPoints}
                    onPress={() => setIsRedeemingPoints(!isRedeemingPoints)}
                  >
                    <Text style={[styles.redeemToggleText, isRedeemingPoints && styles.textWhite]}>
                      {isRedeemingPoints ? '✓ Échangé' : 'Échanger'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Quebec Tax Engine Breakdown */}
                <View style={styles.taxSummaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{language === 'fr' ? 'Sous-total' : 'Subtotal'}</Text>
                    <Text style={styles.summaryVal}>${subtotal.toFixed(2)} CAD</Text>
                  </View>
                  {fulfillmentType === 'delivery' && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{language === 'fr' ? 'Frais de livraison' : 'Delivery Fee'}</Text>
                      <Text style={styles.summaryVal}>${deliveryFee.toFixed(2)} CAD</Text>
                    </View>
                  )}
                  {!isRedeemingPoints ? (
                    <>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>TPS (5.000%)</Text>
                        <Text style={styles.summaryVal}>${tpsTax.toFixed(2)} CAD</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>TVQ (9.975%)</Text>
                        <Text style={styles.summaryVal}>${tvqTax.toFixed(2)} CAD</Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: '#10B981' }]}>
                        🎁 {language === 'fr' ? 'Paiement Récompenses Points' : 'Points Reward Payment'}
                      </Text>
                      <Text style={[styles.summaryVal, { color: '#10B981' }]}>−${(subtotal + deliveryFee).toFixed(2)}</Text>
                    </View>
                  )}
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>{language === 'fr' ? 'TOTAL FINAL' : 'TOTAL AMOUNT'}</Text>
                    <Text style={styles.totalVal}>${total.toFixed(2)} CAD</Text>
                  </View>
                  {!isRedeemingPoints && (
                    <Text style={styles.pointsEarnedNotice}>
                      🎁 {language === 'fr' ? `Vous accumulerez +${pointsEarned} points avec cet achat!` : `You will earn +${pointsEarned} points!`}
                    </Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          {/* Checkout Button */}
          {items.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.checkoutBtnText}>
                    {language === 'fr' ? 'Confirmer la Commande' : 'Place Order'} · ${total.toFixed(2)} CAD ➔
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollArea: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
  },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    alignItems: 'center',
  },
  itemName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  optionDetail: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  itemPrice: {
    color: '#FF5500',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  qtyBtnSmall: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnSmallText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  qtyVal: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 6,
  },
  sectionCard: {
    backgroundColor: '#121212',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FF5500',
  },
  toggleBtnText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  textWhite: {
    color: '#FFF',
  },
  inputLabel: {
    color: '#AAA',
    fontSize: 11,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 10,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  prefRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prefBtn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  prefBtnActive: {
    backgroundColor: '#2A2A2E',
    borderWidth: 1,
    borderColor: '#FF5500',
  },
  prefText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  pointsCard: {
    backgroundColor: '#18181A',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 85, 0, 0.3)',
    gap: 10,
  },
  pointsCardTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pointsCardSub: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  redeemToggle: {
    backgroundColor: '#2A2A2E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  redeemToggleActive: {
    backgroundColor: '#10B981',
  },
  redeemToggleDisabled: {
    opacity: 0.4,
  },
  redeemToggleText: {
    color: '#FF5500',
    fontSize: 12,
    fontWeight: '700',
  },
  taxSummaryCard: {
    backgroundColor: '#121212',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 12,
  },
  summaryVal: {
    color: '#DDD',
    fontSize: 12,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 8,
    marginTop: 6,
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  totalVal: {
    color: '#FF5500',
    fontSize: 16,
    fontWeight: '900',
  },
  pointsEarnedNotice: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  checkoutBtn: {
    backgroundColor: '#FF5500',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
