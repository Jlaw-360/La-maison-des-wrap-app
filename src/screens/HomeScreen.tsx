import { AppMetrics } from 'expo-observe';
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
  React.useEffect(() => {
    try {
      AppMetrics?.markInteractive?.();
    } catch(e) {}
  }, []);

  const { user, points, language } = useAuth();
  const { fulfillmentType, setFulfillmentType, activeOrder } = useCart();

  const featuredItems = LOCAL_MENU_ITEMS.slice(0, 6);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Top Header Card */}
      <View style={styles.topCard}>
        <View style={styles.greetingRow}>
          <View style={styles.brandRow}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.brandLogo} 
              defaultSource={{ uri: '/logo.png' }} 
            />
            <View>
              <Text style={styles.brandTitle}>La Maison des Wraps</Text>
              <Text style={styles.storeAddress}>998 110e Avenue, Drummondville</Text>
            </View>
          </View>

          {/* Points Pill */}
          <TouchableOpacity style={styles.pointsPill} onPress={onNavigateToScan}>
            <Text style={styles.pointsIcon}>🌟</Text>
            <View>
              <Text style={styles.pointsVal}>{points} pts</Text>
              <Text style={styles.pointsSub}>{language === 'fr' ? 'Récompenses' : 'Rewards'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Store Status Indicator */}
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {language === 'fr' ? 'Ouvert aujourd\'hui · 11h00 à 22h00' : 'Open today · 11:00 AM to 10:00 PM'}
          </Text>
        </View>

        {/* Fulfillment Mode Switch */}
        <View style={styles.fulfillmentSwitch}>
          <TouchableOpacity
            style={[styles.switchOption, fulfillmentType === 'delivery' && styles.switchActive]}
            onPress={() => setFulfillmentType('delivery')}
          >
            <Text style={[styles.switchText, fulfillmentType === 'delivery' && styles.switchTextActive]}>
              🚗 {language === 'fr' ? 'Livraison Directe' : 'Delivery'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchOption, fulfillmentType === 'pickup' && styles.switchActive]}
            onPress={() => setFulfillmentType('pickup')}
          >
            <Text style={[styles.switchText, fulfillmentType === 'pickup' && styles.switchTextActive]}>
              🏬 {language === 'fr' ? 'Ramassage en Resto' : 'Pickup'}
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

      {/* 2. Classic Hero Platter Showcase Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>FOUR TANDOORI TRADITIONNEL</Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === 'fr' ? 'Wraps Naan & Kebabs Grillés' : 'Fresh Grilled Naan Wraps & Kebabs'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {language === 'fr' 
              ? 'Pains naan faits maison cuits sur place avec trio frites & boisson.' 
              : 'House-baked naan wraps, skewers and platters with fries & drink trio.'}
          </Text>
          <TouchableOpacity style={styles.heroBtn} onPress={onNavigateToOrder}>
            <Text style={styles.heroBtnText}>{language === 'fr' ? 'Voir le Menu →' : 'View Menu →'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroRight}>
          <Image 
            source={{ uri: '/assets/food/trio_naan_poulet_tikka.png' }} 
            style={styles.heroPlatterImg} 
            resizeMode="cover"
          />
        </View>
      </View>

      {/* 3. Featured Dishes Grid (Large food photos on every card) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>
          {language === 'fr' ? '⭐ Plats Populaires' : '⭐ Popular Dishes'}
        </Text>
        <TouchableOpacity onPress={onNavigateToOrder}>
          <Text style={styles.seeAllText}>{language === 'fr' ? 'Tout voir →' : 'View All →'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dishesGrid}>
        {featuredItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.dishCard} onPress={onNavigateToOrder}>
            <View style={styles.dishImgContainer}>
              <Image 
                source={{ uri: item.image_url || '/assets/food/wrap_kebab_poulet.png' }} 
                style={styles.dishImg} 
                resizeMode="cover" 
              />
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{item.category_fr || 'Wrap'}</Text>
              </View>
            </View>
            <Text style={styles.dishTitle} numberOfLines={2}>
              {language === 'fr' ? item.name_fr : item.name_en}
            </Text>
            <Text style={styles.dishDesc} numberOfLines={2}>
              {language === 'fr' ? item.description_fr : item.description_en}
            </Text>
            <View style={styles.dishBottomRow}>
              <Text style={styles.dishPrice}>${item.price_cad.toFixed(2)} CAD</Text>
              <View style={styles.plusBtn}>
                <Text style={styles.plusBtnText}>+</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. Rewards Card */}
      <TouchableOpacity style={styles.rewardsCard} onPress={onNavigateToScan}>
        <View style={styles.rewardsIconCircle}>
          <Text style={{ fontSize: 24 }}>🌟</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rewardsTitle}>
            {language === 'fr' ? 'Programme Fidélité La Maison' : 'La Maison Rewards'}
          </Text>
          <Text style={styles.rewardsDesc}>
            {language === 'fr'
              ? 'Accumulez des points et échangez-les contre des wraps et repas gratuits.'
              : 'Earn points on every order and redeem for free meals & combos.'}
          </Text>
        </View>
        <View style={styles.rewardsBtn}>
          <Text style={styles.rewardsBtnText}>{language === 'fr' ? 'Scanner' : 'Scan'}</Text>
        </View>
      </TouchableOpacity>

      {/* 5. Restaurant Address Footer */}
      <View style={styles.storeFooter}>
        <Text style={styles.storeFooterTitle}>📍 La Maison des Wraps Drummondville</Text>
        <Text style={styles.storeFooterText}>998 110e Avenue, Drummondville, QC J2B 6X2</Text>
        <Text style={styles.storeFooterText}>📞 (819) 850-3972 · Ouvert 7 jours sur 7</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topCard: {
    backgroundColor: '#1C1C22',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FF5500',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  storeAddress: {
    color: '#A5A5B2',
    fontSize: 11,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 85, 0, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FF5500',
    gap: 6,
  },
  pointsIcon: {
    fontSize: 14,
  },
  pointsVal: {
    color: '#FF5500',
    fontWeight: '800',
    fontSize: 12,
  },
  pointsSub: {
    color: '#A5A5B2',
    fontSize: 9,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  fulfillmentSwitch: {
    flexDirection: 'row',
    backgroundColor: '#151519',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  switchOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  switchActive: {
    backgroundColor: '#FF5500',
  },
  switchText: {
    color: '#A5A5B2',
    fontWeight: '700',
    fontSize: 12,
  },
  switchTextActive: {
    color: '#FFFFFF',
  },
  activeOrderBanner: {
    backgroundColor: 'rgba(255, 85, 0, 0.12)',
    borderWidth: 1.5,
    borderColor: '#FF5500',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  activeOrderPulse: {
    fontSize: 22,
  },
  activeOrderTitle: {
    color: '#FF5500',
    fontWeight: '800',
    fontSize: 13,
  },
  activeOrderDesc: {
    color: '#DDD',
    fontSize: 11,
  },
  activeOrderArrow: {
    fontSize: 18,
    color: '#FF5500',
    fontWeight: 'bold',
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C24',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 85, 0, 0.3)',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 6,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 85, 0, 0.18)',
    borderWidth: 1,
    borderColor: '#FF5500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  heroBadgeText: {
    color: '#FF5500',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11,
    color: '#A5A5B2',
    marginBottom: 12,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF5500',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroRight: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#121216',
  },
  heroPlatterImg: {
    width: '100%',
    height: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5500',
  },
  dishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  dishCard: {
    width: '48%',
    backgroundColor: '#1C1C22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
  },
  dishImgContainer: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#121216',
    marginBottom: 8,
    position: 'relative',
  },
  dishImg: {
    width: '100%',
    height: '100%',
  },
  categoryTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(12, 12, 14, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    color: '#E5A93C',
    fontSize: 8,
    fontWeight: '700',
  },
  dishTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 15,
    marginBottom: 3,
    minHeight: 30,
  },
  dishDesc: {
    fontSize: 10,
    color: '#7A7A88',
    lineHeight: 13,
    marginBottom: 8,
    minHeight: 26,
  },
  dishBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  dishPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF5500',
  },
  plusBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1C22',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    padding: 14,
    marginBottom: 20,
  },
  rewardsIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rewardsDesc: {
    fontSize: 10,
    color: '#A5A5B2',
    lineHeight: 13,
  },
  rewardsBtn: {
    backgroundColor: '#FF5500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  rewardsBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  storeFooter: {
    backgroundColor: '#151519',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 14,
    alignItems: 'center',
  },
  storeFooterTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  storeFooterText: {
    fontSize: 10,
    color: '#7A7A88',
  },
});
