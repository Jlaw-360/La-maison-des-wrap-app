import { AppMetrics } from 'expo-observe';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { fetchLiveOrders, updateOrderStatus, subscribeToOrders } from '../services/supabase';

export const KitchenScreen: React.FC = () => {
  React.useEffect(() => {
    try {
      AppMetrics?.markInteractive?.();
    } catch(e) {}
  }, []);

  const { language } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');
  const [inputPin, setInputPin] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);

  // Load orders and subscribe to realtime updates
  useEffect(() => {
    fetchLiveOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });

    const unsubscribe = subscribeToOrders((payload) => {
      if (payload.eventType === 'INSERT') {
        setOrders((prev) => [payload.new as Order, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setOrders((prev) =>
          prev.map((o) => (o.id === payload.new.id ? { ...o, ...(payload.new as Order) } : o))
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    const success = await updateOrderStatus(orderId, nextStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    }
  };

  const handleVerifyPickupPin = async (order: Order) => {
    if (!inputPin.trim()) return;
    setVerifying(true);
    if (inputPin.trim() === order.pickup_pin || inputPin.trim() === order.backup_pin || inputPin.trim() === order.pickup_token) {
      await updateOrderStatus(order.id, 'completed');
      setInputPin('');
      alert(language === 'fr' ? '✅ Ramassage validé avec succès!' : '✅ Pickup verified successfully!');
    } else {
      alert(language === 'fr' ? '❌ NIP ou code QR invalide.' : '❌ Invalid PIN or QR code.');
    }
    setVerifying(false);
  };

  const newOrders = orders.filter((o) => o.status === 'new');
  const prepOrders = orders.filter((o) => o.status === 'preparing' || o.status === 'accepted');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const transitOrders = orders.filter((o) => o.status === 'in_transit');
  const completedOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'completed');

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'new': return newOrders;
      case 'preparing': return prepOrders;
      case 'ready': return readyOrders;
      case 'in_transit': return transitOrders;
      case 'completed': return completedOrders;
      default: return orders;
    }
  };

  const currentList = getFilteredOrders();

  return (
    <View style={styles.container}>
      {/* Alarm Banner if New Orders Exist */}
      {newOrders.length > 0 && (
        <View style={styles.alarmBanner}>
          <Text style={styles.alarmEmoji}>🚨</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alarmTitle}>
              {language === 'fr'
                ? `NOUVELLE COMMANDE EN ATTENTE (${newOrders.length})!`
                : `NEW ORDER WAITING (${newOrders.length})!`}
            </Text>
            <Text style={styles.alarmSub}>
              {language === 'fr'
                ? 'Sonnerie active jusqu\'à acceptation par l\'équipe cuisine.'
                : 'Alert ringing until accepted by kitchen staff.'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.acceptAllBtn}
            onPress={() => newOrders.forEach((o) => handleAdvanceStatus(o.id, 'preparing'))}
          >
            <Text style={styles.acceptAllBtnText}>
              {language === 'fr' ? 'Accepter Tout 🔥' : 'Accept All 🔥'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Kanban Column Tabs */}
      <View style={styles.tabsHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { key: 'new', label: language === 'fr' ? 'Nouveau' : 'New', count: newOrders.length, color: '#EF4444' },
            { key: 'preparing', label: language === 'fr' ? 'En Préparation (5-10m)' : 'Prep (5-10m)', count: prepOrders.length, color: '#F59E0B' },
            { key: 'ready', label: language === 'fr' ? 'Prêt' : 'Ready', count: readyOrders.length, color: '#10B981' },
            { key: 'in_transit', label: language === 'fr' ? 'En Livraison' : 'In Transit', count: transitOrders.length, color: '#3B82F6' },
            { key: 'completed', label: language === 'fr' ? 'Terminé' : 'Completed', count: completedOrders.length, color: '#888' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key as OrderStatus)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.textWhite]}>
                {tab.label}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: tab.color }]}>
                <Text style={styles.countText}>{tab.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List Area */}
      <ScrollView style={styles.ordersArea} contentContainerStyle={styles.ordersAreaContent}>
        {loading ? (
          <ActivityIndicator color="#FF5500" style={{ padding: 40 }} />
        ) : currentList.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>👨‍🍳</Text>
            <Text style={styles.emptyTitle}>
              {language === 'fr' ? 'Aucune commande dans cette colonne' : 'No orders in this column'}
            </Text>
          </View>
        ) : (
          currentList.map((order) => (
            <View key={order.id} style={styles.ticketCard}>
              {/* Ticket Header */}
              <View style={styles.ticketHeader}>
                <View>
                  <Text style={styles.ticketNumber}>
                    #{order.order_number} · {order.fulfillment_type === 'delivery' ? '🚗 LIVRAISON' : '🏬 RAMASSAGE'}
                  </Text>
                  <Text style={styles.ticketTime}>
                    {new Date(order.created_at).toLocaleTimeString(language === 'fr' ? 'fr-CA' : 'en-CA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} · {order.customer_name || 'Client'} ({order.customer_phone || 'Sans tél'})
                  </Text>
                </View>
                <Text style={styles.ticketTotal}>${order.total_cad.toFixed(2)} CAD</Text>
              </View>

              {/* Delivery Address & Notes */}
              {order.delivery_address && (
                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>📍 {order.delivery_address}</Text>
                  {order.delivery_notes ? (
                    <Text style={styles.notesText}>📝 {order.delivery_notes}</Text>
                  ) : null}
                </View>
              )}

              {/* Order Verification PIN Box */}
              <View style={styles.ticketPinBox}>
                <Text style={styles.ticketPinLabel}>
                  {language === 'fr' ? 'NIP DE RAMASSAGE CLIENT :' : 'CUSTOMER PICKUP PIN :'}
                </Text>
                <Text style={styles.ticketPinDigits}>#{order.backup_pin || order.pickup_pin || '4829'}</Text>
              </View>

              {/* Actions depending on status */}
              <View style={styles.ticketActions}>
                {order.status === 'new' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}
                    onPress={() => handleAdvanceStatus(order.id, 'preparing')}
                  >
                    <Text style={styles.actionBtnText}>
                      🔥 {language === 'fr' ? 'Accepter & Commencer (5-10 min)' : 'Accept & Start (5-10m)'}
                    </Text>
                  </TouchableOpacity>
                )}

                {order.status === 'preparing' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => handleAdvanceStatus(order.id, 'ready')}
                  >
                    <Text style={styles.actionBtnText}>
                      ✅ {language === 'fr' ? 'Marquer PRÊT (Générer QR)' : 'Mark READY (Generate QR)'}
                    </Text>
                  </TouchableOpacity>
                )}

                {order.status === 'ready' && order.fulfillment_type === 'pickup' && (
                  <View style={styles.pinVerifySection}>
                    <TextInput
                      style={styles.pinInput}
                      placeholder={language === 'fr' ? 'Entrer NIP Client (ex: 4829)' : 'Enter PIN (e.g. 4829)'}
                      placeholderTextColor="#777"
                      value={inputPin}
                      onChangeText={setInputPin}
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      style={[styles.actionBtnSmall, { backgroundColor: '#10B981' }]}
                      onPress={() => handleVerifyPickupPin(order)}
                    >
                      <Text style={styles.actionBtnText}>
                        {verifying ? '...' : (language === 'fr' ? 'Valider Ramassage' : 'Verify Pickup')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {order.status === 'ready' && order.fulfillment_type === 'delivery' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
                    onPress={() => handleAdvanceStatus(order.id, 'in_transit')}
                  >
                    <Text style={styles.actionBtnText}>
                      🚗 {language === 'fr' ? 'Confirmer Départ Livreur' : 'Dispatch Driver'}
                    </Text>
                  </TouchableOpacity>
                )}

                {order.status === 'in_transit' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => handleAdvanceStatus(order.id, 'delivered')}
                  >
                    <Text style={styles.actionBtnText}>
                      ✨ {language === 'fr' ? 'Marquer Livré avec Succès' : 'Mark Delivered'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101014',
  },
  alarmBanner: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F87171',
  },
  alarmEmoji: {
    fontSize: 28,
  },
  alarmTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  alarmSub: {
    color: '#FEE2E2',
    fontSize: 11,
  },
  acceptAllBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  acceptAllBtnText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 12,
  },
  tabsHeader: {
    backgroundColor: '#18181F',
    borderBottomWidth: 1,
    borderBottomColor: '#262633',
  },
  tabsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22222C',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FF5500',
  },
  tabLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
  },
  textWhite: {
    color: '#FFF',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  ordersArea: {
    flex: 1,
  },
  ordersAreaContent: {
    padding: 16,
    gap: 14,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  ticketCard: {
    backgroundColor: '#18181F',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#282836',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ticketNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  ticketTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  ticketTotal: {
    color: '#FF5500',
    fontSize: 16,
    fontWeight: '900',
  },
  addressBox: {
    backgroundColor: '#121216',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addressText: {
    color: '#DDD',
    fontSize: 12,
    fontWeight: '600',
  },
  notesText: {
    color: '#F59E0B',
    fontSize: 11,
    marginTop: 4,
  },
  ticketPinBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#20202A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#303040',
  },
  ticketPinLabel: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '700',
  },
  ticketPinDigits: {
    color: '#FF5500',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  ticketActions: {
    marginTop: 6,
  },
  actionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  pinVerifySection: {
    flexDirection: 'row',
    gap: 8,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#121216',
    borderRadius: 10,
    padding: 10,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#303040',
  },
  actionBtnSmall: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
});
