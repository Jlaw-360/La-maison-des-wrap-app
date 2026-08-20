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

  const popularPicks = LOCAL_MENU_ITEMS.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Top Brand Header with Notification & Profile (Nandos Style) */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Image source={require('../../assets/icon.png')} style={styles.brandLogo} defaultSource={{ uri: '/logo.png' }} />
          <View>
            <Text style={styles.brandTitle}>La Maison des Wraps</Text>
            <Text style={styles.brandSubtitle}>Grillé au Four Tandoori · Drummondville</Text>
          </View>
        </View>
        <View style={styles.headerIconsRow}>
          <TouchableOpacity style={styles.circleIconBtn} onPress={onNavigateToScan}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleIconBtn} onPress={onNavigateToScan}>
            <Text style={{ fontSize: 16 }}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Delivery Address Selector Pill */}
      <TouchableOpacity style={styles.addressPill} onPress={onNavigateToOrder}>
        <View style={styles.addressLeft}>
          <View style={styles.locationIconCircle}>
            <Text style={{ fontSize: 14 }}>📍</Text>
          </View>
          <View>
            <Text style={styles.addressSub}>{language === 'fr' ? 'LIVRER À' : 'DELIVER TO'}</Text>
            <Text style={styles.addressMain}>998 110e Avenue, Drummondville ▾</Text>
          </View>
        </View>
        <View style={styles.searchCircle}>
          <Text style={{ fontSize: 13 }}>🔍</Text>
        </View>
      </TouchableOpacity>

      {/* 3. Delivery / Pickup Switch */}
      <View style={styles.fulfillmentSwitch}>
        <TouchableOpacity
          style={[styles.switchOption, fulfillmentType === 'delivery' && styles.switchActive]}
          onPress={() => setFulfillmentType('delivery')}
        >
          <Text style={[styles.switchText, fulfillmentType === 'delivery' && styles.switchTextActive]}>
            🛵 {language === 'fr' ? 'Livraison Directe' : 'Delivery'}
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

      {/* 4. Hero Flame-Grilled Promo Banner (Nandos Bold Style) */}
      <View style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>AU FEU TANDOOR</Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === 'fr' ? 'Wraps Grillés au Feu.\nSaveurs Intenses.' : 'Flame-grilled Wraps.\nBold Flavour.'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {language === 'fr' ? 'Pain Naan ou Tortilla maison avec trio frites & boisson.' : 'House-baked naan or tortilla with fries & drink trio.'}
          </Text>
          <TouchableOpacity style={styles.heroBtn} onPress={onNavigateToOrder}>
            <Text style={styles.heroBtnText}>{language === 'fr' ? 'Commander →' : 'Order Now →'}</Text>
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

      {/* 5. Horizontal Category Squircles */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>{language === 'fr' ? 'Catégories' : 'Categories'}</Text>
        <TouchableOpacity onPress={onNavigateToOrder}>
          <Text style={styles.seeAllText}>{language === 'fr' ? 'Tout voir →' : 'View All →'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        <TouchableOpacity style={[styles.categorySquircle, styles.categorySquircleActive]} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
          <Text style={[styles.categoryLabel, styles.categoryLabelActive]}>{language === 'fr' ? 'Favoris' : 'Bestsellers'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🌯</Text>
          <Text style={styles.categoryLabel}>Wraps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🍗</Text>
          <Text style={styles.categoryLabel}>{language === 'fr' ? 'Poulet Tikka' : 'Chicken'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🍔</Text>
          <Text style={styles.categoryLabel}>Burgers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🍛</Text>
          <Text style={styles.categoryLabel}>Curry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🍚</Text>
          <Text style={styles.categoryLabel}>Biryani</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🥟</Text>
          <Text style={styles.categoryLabel}>{language === 'fr' ? 'À Côté' : 'Sides'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categorySquircle} onPress={onNavigateToOrder}>
          <Text style={{ fontSize: 24 }}>🥤</Text>
          <Text style={styles.categoryLabel}>{language === 'fr' ? 'Boissons' : 'Drinks'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 6. Popular Picks Section (Nandos 3-card grid) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>{language === 'fr' ? '⭐ Choix Populaires' : '⭐ Popular Picks'}</Text>
        <TouchableOpacity onPress={onNavigateToOrder}>
          <Text style={styles.seeAllText}>{language === 'fr' ? 'Tout voir →' : 'View All →'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.popularGrid}>
        {popularPicks.map((item) => (
          <TouchableOpacity key={item.id} style={styles.popularCard} onPress={onNavigateToOrder}>
            <View style={styles.popularImgContainer}>
              <Image source={{ uri: item.image_url || '/assets/food/wrap_kebab_poulet.png' }} style={styles.popularImg} resizeMode="cover" />
            </View>
            <Text style={styles.popularTitle} numberOfLines={2}>
              {language === 'fr' ? item.name_fr : item.name_en}
            </Text>
            <View style={styles.popularBottom}>
              <Text style={styles.popularPrice}>${item.price_cad.toFixed(2)}</Text>
              <TouchableOpacity style={styles.orangePlusBtn} onPress={onNavigateToOrder}>
                <Text style={styles.orangePlusText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 7. Loyalty Rewards Banner (Nandos Style) */}
      <View style={styles.rewardsBanner}>
        <View style={styles.chiliCircle}>
          <Text style={{ fontSize: 24 }}>🌶️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rewardsTitle}>
            {language === 'fr' ? 'Club Privilège La Maison' : 'La Maison Rewards'}
          </Text>
          <Text style={styles.rewardsSubtitle}>
            {language === 'fr'
              ? 'Gagnez des points à chaque commande et débloquez des repas gratuits.'
              : 'Earn points with every order and unlock exclusive free meals.'}
          </Text>
        </View>
        <TouchableOpacity style={styles.rewardsBtn} onPress={onNavigateToScan}>
          <Text style={styles.rewardsBtnText}>{language === 'fr' ? 'Échanger' : 'Join Now'}</Text>
        </TouchableOpacity>
      </View>

      {/* 8. Restaurant Info Card */}
      <View style={styles.storeInfoCard}>
        <Text style={styles.storeInfoTitle}>📍 La Maison des Wraps Drummondville</Text>
        <Text style={styles.storeInfoText}>998 110e Avenue, Drummondville, QC J2B 6X2</Text>
        <Text style={styles.storeInfoText}>📞 (819) 850-3972 · Ouvert 7 jours sur 7</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E34A26',
  },
  headerIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  circleIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE5DA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A4632',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE5DA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    shadowColor: '#5A4632',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  locationIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF2ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8C857B',
    letterSpacing: 0.5,
  },
  addressMain: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  searchCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fulfillmentSwitch: {
    flexDirection: 'row',
    backgroundColor: '#EDE7DC',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  switchOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  switchActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  switchText: {
    color: '#78716C',
    fontWeight: '700',
    fontSize: 12,
  },
  switchTextActive: {
    color: '#1C1917',
  },
  activeOrderBanner: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#E34A26',
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
    color: '#E34A26',
    fontWeight: '800',
    fontSize: 13,
  },
  activeOrderDesc: {
    color: '#78716C',
    fontSize: 11,
  },
  activeOrderArrow: {
    fontSize: 18,
    color: '#E34A26',
    fontWeight: 'bold',
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E34A26',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#E34A26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#1C1917',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroRight: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroPlatterImg: {
    width: '100%',
    height: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1917',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E34A26',
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 18,
  },
  categorySquircle: {
    width: 68,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE5DA',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#5A4632',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categorySquircleActive: {
    borderColor: '#E34A26',
    borderWidth: 1.5,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1C1917',
  },
  categoryLabelActive: {
    color: '#E34A26',
  },
  popularGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  popularCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EBE5DA',
    padding: 8,
    shadowColor: '#5A4632',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  popularImgContainer: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3EFE6',
    marginBottom: 6,
  },
  popularImg: {
    width: '100%',
    height: '100%',
  },
  popularTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1917',
    lineHeight: 14,
    minHeight: 28,
  },
  popularBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  popularPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E34A26',
  },
  orangePlusBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E34A26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangePlusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  rewardsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBE5DA',
    padding: 14,
    marginBottom: 20,
    shadowColor: '#5A4632',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chiliCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF2ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1917',
  },
  rewardsSubtitle: {
    fontSize: 10,
    color: '#57534E',
    lineHeight: 13,
  },
  rewardsBtn: {
    backgroundColor: '#1C1917',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  rewardsBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  storeInfoCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE8DE',
    padding: 14,
    alignItems: 'center',
  },
  storeInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 4,
  },
  storeInfoText: {
    fontSize: 11,
    color: '#8C857B',
  },
});
