import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LOCAL_MENU_ITEMS } from '../data/menu';

interface HomeScreenProps {
  onNavigateToOrder: () => void;
  onNavigateToScan: () => void;
  onNavigateToTracking: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToOrder,
  onNavigateToScan,
  onNavigateToTracking,
}) => {
  const { user, points, language } = useAuth();
  const { fulfillmentType, setFulfillmentType, activeOrder } = useCart();

  const featuredItems = LOCAL_MENU_ITEMS.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Points & Greeting Header (Tim Hortons / McDo Canada Style) */}
      <View style={styles.topCard}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingSub}>
              {language === 'fr' ? 'Bienvenue chez' : 'Welcome to'}
            </Text>
            <Text style={styles.greetingName}>
              {user?.full_name || (language === 'fr' ? 'Membre Récompenses' : 'Rewards Member')}
            </Text>
          </View>

          {/* Tim Hortons / McDo Points Pill */}
          <TouchableOpacity style={styles.pointsPill} onPress={onNavigateToScan}>
            <Text style={styles.pointsIcon}>🌟</Text>
            <View>
              <Text style={styles.pointsVal}>{points} pts</Text>
              <Text style={styles.pointsSub}>{language === 'fr' ? 'Récompenses' : 'Rewards'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pickup vs Delivery Selector */}
        <View style={styles.fulfillmentSwitch}>
          <TouchableOpacity
            style={[styles.switchOption, fulfillmentType === 'delivery' && styles.switchActive]}
            onPress={() => setFulfillmentType('delivery')}
          >
            <Text style={[styles.switchText, fulfillmentType === 'delivery' && styles.switchTextActive]}>
              🚗 {language === 'fr' ? 'Livraison (Drummondville)' : 'Delivery'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchOption, fulfillmentType === 'pickup' && styles.switchActive]}
            onPress={() => setFulfillmentType('pickup')}
          >
            <Text style={[styles.switchText, fulfillmentType === 'pickup' && styles.switchTextActive]}>
              🏬 {language === 'fr' ? 'Ramassage en resto' : 'Pickup in-store'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Order Banner if currently in progress */}
      {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'completed' && (
        <TouchableOpacity style={styles.activeOrderBanner} onPress={onNavigateToTracking}>
          <View style={styles.activeOrderLeft}>
            <Text style={styles.activeOrderPulse}>🔔</Text>
            <View>
              <Text style={styles.activeOrderTitle}>
                {language === 'fr' ? 'Commande active #' : 'Active Order #'}{activeOrder.order_number}
              </Text>
              <Text style={styles.activeOrderDesc}>
                {activeOrder.status === 'new' && (language === 'fr' ? 'Reçue par la cuisine...' : 'Received by kitchen...')}
                {activeOrder.status === 'preparing' && (language === 'fr' ? 'En préparation (prête dans 5-10 min) 🔥' : 'Preparing (5-10 min) 🔥')}
                {activeOrder.status === 'ready' && (language === 'fr' ? 'Prête pour ramassage / livreur! 🎁' : 'Ready for pickup / driver! 🎁')}
                {activeOrder.status === 'in_transit' && (language === 'fr' ? 'Livreur en route vers vous 🚗' : 'Driver on the way 🚗')}
              </Text>
            </View>
          </View>
          <Text style={styles.activeOrderArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Main Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>SPÉCIAL DU JOUR</Text>
        </View>
        <Text style={styles.promoTitle}>
          {language === 'fr' ? 'Wraps au Four Tandoori' : 'Fresh Tandoori Wraps'}
        </Text>
        <Text style={styles.promoSub}>
          {language === 'fr'
            ? 'Choisissez votre pain naan traditionnel ou galette tortilla avec trio frites & boisson.'
            : 'Choose traditional baked naan or tortilla with crispy fries & drink trio.'}
        </Text>
        <TouchableOpacity style={styles.orderNowBtn} onPress={onNavigateToOrder}>
          <Text style={styles.orderNowText}>
            {language === 'fr' ? 'Commander maintenant 🌯' : 'Order Now 🌯'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scan & Pay Card (Tim Hortons / McDo Model) */}
      <TouchableOpacity style={styles.scanCard} onPress={onNavigateToScan}>
        <View style={styles.scanCardIcon}>
          <Text style={{ fontSize: 28 }}>📲</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.scanCardTitle}>
            {language === 'fr' ? 'Scanner en Restaurant & Échanger Points' : 'Scan in Store & Redeem Points'}
          </Text>
          <Text style={styles.scanCardSub}>
            {language === 'fr'
              ? 'Présentez votre Code QR ou PIN pour accumuler des points ou récupérer votre commande.'
              : 'Show your personal QR or PIN code to earn points or collect your order.'}
          </Text>
        </View>
        <Text style={styles.scanCardArrow}>➔</Text>
      </TouchableOpacity>

      {/* Featured Menu Items Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {language === 'fr' ? '⭐ Favoris de Drummondville' : '⭐ Local Favorites'}
        </Text>
        <TouchableOpacity onPress={onNavigateToOrder}>
          <Text style={styles.seeAllText}>{language === 'fr' ? 'Tout voir →' : 'See all →'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredList}>
        {featuredItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard} onPress={onNavigateToOrder}>
            <View style={styles.itemCardContent}>
              <Text style={styles.itemName}>
                {language === 'fr' ? item.name_fr : item.name_en}
              </Text>
              <Text style={styles.itemDesc} numberOfLines={2}>
                {language === 'fr' ? item.description_fr : item.description_en}
              </Text>
              <View style={styles.itemBottomRow}>
                <Text style={styles.itemPrice}>${item.price_cad.toFixed(2)} CAD</Text>
                <View style={styles.itemPointsBadge}>
                  <Text style={styles.itemPointsText}>🌟 {item.points_cost} pts</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Restaurant Location Info */}
      <View style={styles.storeInfoCard}>
        <Text style={styles.storeInfoTitle}>📍 La Maison des Wraps</Text>
        <Text style={styles.storeInfoText}>998 110e Avenue, Drummondville, QC J2B 6X2</Text>
        <Text style={styles.storeInfoText}>📞 (819) 850-3972 · Ouvert 7j/7</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingSub: {
    color: '#888',
    fontSize: 12,
  },
  greetingName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'sans-serif',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 85, 0, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF5500',
    gap: 8,
  },
  pointsIcon: {
    fontSize: 18,
  },
  pointsVal: {
    color: '#FF5500',
    fontWeight: '800',
    fontSize: 14,
  },
  pointsSub: {
    color: '#AAA',
    fontSize: 10,
  },
  fulfillmentSwitch: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  switchOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  switchActive: {
    backgroundColor: '#2C2C2E',
  },
  switchText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  switchTextActive: {
    color: '#FFF',
  },
  activeOrderBanner: {
    backgroundColor: '#991B1B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  activeOrderPulse: {
    fontSize: 22,
  },
  activeOrderTitle: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
  activeOrderDesc: {
    color: '#FECACA',
    fontSize: 12,
    marginTop: 2,
  },
  activeOrderArrow: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  promoBanner: {
    backgroundColor: 'linear-gradient(135deg, #FF5500 0%, #CC4400 100%)',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#FF5500',
    marginBottom: 16,
    shadowColor: '#FF5500',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  promoBadge: {
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  promoBadgeText: {
    color: '#FF5500',
    fontSize: 11,
    fontWeight: '800',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  promoSub: {
    color: '#FFE4D6',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  orderNowBtn: {
    backgroundColor: '#121212',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  orderNowText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scanCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 14,
  },
  scanCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 85, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCardTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scanCardSub: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  scanCardArrow: {
    color: '#FF5500',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  seeAllText: {
    color: '#FF5500',
    fontSize: 13,
    fontWeight: '600',
  },
  featuredList: {
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  itemCardContent: {
    gap: 4,
  },
  itemName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  itemDesc: {
    color: '#888',
    fontSize: 12,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    color: '#FF5500',
    fontSize: 15,
    fontWeight: '800',
  },
  itemPointsBadge: {
    backgroundColor: '#2A2A2E',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  itemPointsText: {
    color: '#DDD',
    fontSize: 11,
    fontWeight: '600',
  },
  storeInfoCard: {
    backgroundColor: '#18181A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#242428',
    alignItems: 'center',
  },
  storeInfoTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  storeInfoText: {
    color: '#777',
    fontSize: 11,
    marginTop: 2,
  },
});
