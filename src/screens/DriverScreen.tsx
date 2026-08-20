import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Linking } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { fetchLiveOrders, updateOrderStatus, updateDriverLocation, subscribeToOrders } from '../services/supabase';

export const DriverScreen: React.FC = () => {
  const { user, language } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
  const [customerPin, setCustomerPin] = useState<string>('');
  const [photoProofTaken, setPhotoProofTaken] = useState<boolean>(false);
  const [isGpsStreaming, setIsGpsStreaming] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLiveOrders().then((data) => {
      setOrders(data);
      const inTransit = data.find((o) => o.status === 'in_transit' && o.fulfillment_type === 'delivery');
      if (inTransit) setActiveDelivery(inTransit);
      setLoading(false);
    });

    const unsubscribe = subscribeToOrders((payload) => {
      if (payload.eventType === 'INSERT') {
        setOrders((prev) => [payload.new as Order, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setOrders((prev) =>
          prev.map((o) => (o.id === payload.new.id ? { ...o, ...(payload.new as Order) } : o))
        );
        if (activeDelivery?.id === payload.new.id) {
          setActiveDelivery(payload.new as Order);
        }
      }
    });

    return () => unsubscribe();
  }, [activeDelivery?.id]);

  // GPS Broadcaster Simulator
  useEffect(() => {
    let interval: any = null;
    if (isGpsStreaming && activeDelivery) {
      let lat = 45.8828;
      let lng = -72.4842;
      interval = setInterval(() => {
        lat += (Math.random() - 0.5) * 0.001;
        lng += (Math.random() - 0.5) * 0.001;
        updateDriverLocation(activeDelivery.id, lat, lng);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGpsStreaming, activeDelivery?.id]);

  const handleClaimOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 'in_transit', { driver_id: user?.id });
    setActiveDelivery(order);
    setIsGpsStreaming(true);
  };

  const handleLaunchNavigation = (address?: string) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', Drummondville, QC')}`;
    Linking.openURL(url);
  };

  const handleCompleteDelivery = async () => {
    if (!activeDelivery) return;

    if (activeDelivery.delivery_type === 'hand_to_me') {
      if (customerPin.trim() !== activeDelivery.pickup_pin && customerPin.trim() !== activeDelivery.backup_pin && customerPin.trim() !== activeDelivery.delivery_token) {
        alert(language === 'fr' ? '❌ NIP client invalide. Veuillez demander le NIP à 4 chiffres.' : '❌ Invalid Customer PIN.');
        return;
      }
    } else {
      if (!photoProofTaken) {
        alert(language === 'fr' ? '📸 Veuillez prendre une photo du pas de la porte avant de confirmer.' : '📸 Please take a doorstep photo.');
        return;
      }
    }

    await updateOrderStatus(activeDelivery.id, 'delivered', {
      dropoff_photo_url: photoProofTaken ? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500' : null,
    });
    setIsGpsStreaming(false);
    setActiveDelivery(null);
    setCustomerPin('');
    setPhotoProofTaken(false);
    alert(language === 'fr' ? '✨ Livraison complétée avec succès!' : '✨ Delivery completed successfully!');
  };

  const readyDeliveries = orders.filter(
    (o) => (o.status === 'ready' || o.status === 'preparing') && o.fulfillment_type === 'delivery'
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Driver Status Card */}
      <View style={styles.driverHeroCard}>
        <View style={styles.driverHeroHeader}>
          <View>
            <Text style={styles.driverName}>🚗 {user?.full_name || 'Livreur En Service'}</Text>
            <Text style={styles.driverSub}>Zone de livraison : Drummondville, QC</Text>
          </View>
          <View style={[styles.statusBadge, isGpsStreaming ? styles.gpsActive : styles.gpsInactive]}>
            <Text style={styles.statusBadgeText}>
              {isGpsStreaming ? '● GPS EN DIRECT' : '○ GPS EN PAUSE'}
            </Text>
          </View>
        </View>
      </View>

      {/* Active Delivery Card */}
      {activeDelivery ? (
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <Text style={styles.activeTitle}>
              📦 {language === 'fr' ? 'Livraison en cours #' : 'Active Delivery #'}{activeDelivery.order_number}
            </Text>
            <Text style={styles.activeTotal}>${activeDelivery.total_cad.toFixed(2)} CAD</Text>
          </View>

          <Text style={styles.customerName}>
            👤 {activeDelivery.customer_name} ({activeDelivery.customer_phone || '819-850-3972'})
          </Text>

          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>📍 ADRESSE DE DESTINATION :</Text>
            <Text style={styles.addressValue}>{activeDelivery.delivery_address}</Text>
            {activeDelivery.delivery_notes ? (
              <Text style={styles.notesValue}>📝 Note : {activeDelivery.delivery_notes}</Text>
            ) : null}
          </View>

          {/* 1-Tap Navigation Button */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleLaunchNavigation(activeDelivery.delivery_address)}
          >
            <Text style={styles.navButtonText}>
              🗺️ {language === 'fr' ? 'Ouvrir l\'Itinéraire (Google Maps)' : 'Launch GPS Navigation'}
            </Text>
          </TouchableOpacity>

          {/* Verification Method: Hand to Me vs Leave at Door */}
          <View style={styles.verifyBox}>
            <Text style={styles.verifyBoxTitle}>
              {activeDelivery.delivery_type === 'hand_to_me'
                ? '🤝 REMISE EN MAIN PROPRE (Demander NIP Client)'
                : '🚪 LAISSER À LA PORTE (Photo Requise)'}
            </Text>

            {activeDelivery.delivery_type === 'hand_to_me' ? (
              <View style={{ marginTop: 8 }}>
                <TextInput
                  style={styles.pinInput}
                  placeholder={language === 'fr' ? 'Entrer NIP Client à 4 chiffres (ex: 4829)' : 'Enter Customer 4-digit PIN'}
                  placeholderTextColor="#777"
                  value={customerPin}
                  onChangeText={setCustomerPin}
                  keyboardType="number-pad"
                />
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.photoBtn, photoProofTaken && styles.photoBtnDone]}
                onPress={() => setPhotoProofTaken(!photoProofTaken)}
              >
                <Text style={styles.photoBtnText}>
                  {photoProofTaken
                    ? '✅ Photo capturée avec succès!'
                    : '📸 Prendre Photo du Pas de Porte'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.completeBtn} onPress={handleCompleteDelivery}>
              <Text style={styles.completeBtnText}>
                ✨ {language === 'fr' ? 'Confirmer la Fin de Livraison' : 'Complete Delivery'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Available Ready Deliveries Queue */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          📋 {language === 'fr' ? 'Commandes Prêtes à Livrer' : 'Ready Delivery Orders'} ({readyDeliveries.length})
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#FF5500" style={{ padding: 20 }} />
      ) : readyDeliveries.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ fontSize: 36, marginBottom: 6 }}>🏁</Text>
          <Text style={styles.emptyTitle}>
            {language === 'fr' ? 'Aucune commande en attente de livreur' : 'No deliveries in queue'}
          </Text>
        </View>
      ) : (
        readyDeliveries.map((order) => (
          <View key={order.id} style={styles.queueCard}>
            <View style={styles.queueHeader}>
              <Text style={styles.queueOrderNumber}>Commande #{order.order_number}</Text>
              <Text style={styles.queuePrice}>${order.total_cad.toFixed(2)} CAD</Text>
            </View>
            <Text style={styles.queueAddress}>📍 {order.delivery_address}</Text>
            <Text style={styles.queueCustomer}>
              👤 {order.customer_name} ({order.delivery_type === 'hand_to_me' ? '🤝 Remise en main' : '🚪 À la porte'})
            </Text>

            <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaimOrder(order)}>
              <Text style={styles.claimBtnText}>
                📲 {language === 'fr' ? 'Scanner & Prendre en Charge' : 'Claim & Start Delivery'}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101014',
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  driverHeroCard: {
    backgroundColor: '#18181F',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262633',
    marginBottom: 16,
  },
  driverHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  driverSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  gpsActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  gpsInactive: {
    backgroundColor: '#2A2A2E',
  },
  statusBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  activeCard: {
    backgroundColor: '#1C1C24',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#FF5500',
    marginBottom: 20,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
  },
  activeTotal: {
    color: '#FF5500',
    fontSize: 17,
    fontWeight: '900',
  },
  customerName: {
    color: '#DDD',
    fontSize: 13,
    marginBottom: 10,
  },
  addressBox: {
    backgroundColor: '#121216',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  addressTitle: {
    color: '#FF5500',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  addressValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  notesValue: {
    color: '#F59E0B',
    fontSize: 12,
    marginTop: 4,
  },
  navButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  navButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  verifyBox: {
    backgroundColor: '#14141A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#262633',
  },
  verifyBoxTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pinInput: {
    backgroundColor: '#1C1C24',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333344',
  },
  photoBtn: {
    backgroundColor: '#2A2A36',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  photoBtnDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  photoBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  completeBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  completeBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    color: '#888',
    fontSize: 14,
  },
  queueCard: {
    backgroundColor: '#18181F',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262633',
    marginBottom: 12,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  queueOrderNumber: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
  queuePrice: {
    color: '#FF5500',
    fontWeight: '900',
    fontSize: 15,
  },
  queueAddress: {
    color: '#DDD',
    fontSize: 13,
    marginBottom: 4,
  },
  queueCustomer: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
  },
  claimBtn: {
    backgroundColor: '#FF5500',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  claimBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
