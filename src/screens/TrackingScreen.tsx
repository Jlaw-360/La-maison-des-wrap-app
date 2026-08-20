import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderChat, OrderStatus } from '../types';
import { fetchOrderChats, sendOrderMessage, subscribeToOrderChats, subscribeToOrders } from '../services/supabase';

export const TrackingScreen: React.FC = () => {
  const { activeOrder, setActiveOrder } = useCart();
  const { user, language } = useAuth();
  const [chats, setChats] = useState<OrderChat[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  // Subscribe to realtime order updates
  useEffect(() => {
    if (!activeOrder?.id) return;

    // Load existing chats
    fetchOrderChats(activeOrder.id).then(setChats);

    // Listen to live chats
    const unsubscribeChat = subscribeToOrderChats(activeOrder.id, (newMsg) => {
      setChats((prev) => [...prev, newMsg]);
    });

    // Listen to order status and GPS changes
    const unsubscribeOrder = subscribeToOrders((payload) => {
      if (payload.new && payload.new.id === activeOrder.id) {
        setActiveOrder(payload.new);
      }
    });

    return () => {
      unsubscribeChat();
      unsubscribeOrder();
    };
  }, [activeOrder?.id]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !activeOrder?.id) return;
    setSending(true);
    const sent = await sendOrderMessage(
      activeOrder.id,
      'client',
      chatInput.trim(),
      user?.id
    );
    setSending(false);
    if (sent) {
      setChatInput('');
    }
  };

  if (!activeOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 50, marginBottom: 12 }}>🛵</Text>
        <Text style={styles.emptyTitle}>
          {language === 'fr' ? 'Aucune commande en cours' : 'No active order'}
        </Text>
        <Text style={styles.emptySub}>
          {language === 'fr'
            ? 'Vos commandes passées apparaîtront ici avec le suivi en direct et le clavardage.'
            : 'Your live orders will appear here with GPS tracking and in-app chat.'}
        </Text>
      </View>
    );
  }

  const getStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case 'new': return 1;
      case 'accepted': return 2;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'in_transit': return 4;
      case 'delivered':
      case 'completed': return 5;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(activeOrder.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.orderNumberTitle}>
            {language === 'fr' ? 'Commande #' : 'Order #'}{activeOrder.order_number}
          </Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {activeOrder.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ETA & Preparation Timer Banner */}
        <View style={styles.etaBanner}>
          <Text style={styles.etaEmoji}>⏱️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.etaTitle}>
              {activeOrder.status === 'preparing' || activeOrder.status === 'new'
                ? (language === 'fr' ? 'Temps estimé : 5 à 10 minutes' : 'Estimated Time: 5 to 10 mins')
                : activeOrder.status === 'ready'
                ? (language === 'fr' ? 'Votre commande est PRÊTE ! 🎉' : 'Your order is READY! 🎉')
                : activeOrder.status === 'in_transit'
                ? (language === 'fr' ? 'Livreur en route vers votre adresse 🚗' : 'Driver on the way 🚗')
                : (language === 'fr' ? 'Commande livrée avec succès! ✨' : 'Order delivered! ✨')}
            </Text>
            <Text style={styles.etaSub}>
              {language === 'fr'
                ? 'La cuisine de La Maison des Wraps prépare vos saveurs fraîches.'
                : 'La Maison des Wraps kitchen is preparing your meal.'}
            </Text>
          </View>
        </View>

        {/* 5-Step Timeline */}
        <View style={styles.timeline}>
          {[
            { step: 1, label: language === 'fr' ? 'Reçue' : 'Placed' },
            { step: 2, label: language === 'fr' ? 'Cuisine (5-10m)' : 'Prep' },
            { step: 3, label: language === 'fr' ? 'Prête' : 'Ready' },
            { step: 4, label: language === 'fr' ? 'En route' : 'Transit' },
            { step: 5, label: language === 'fr' ? 'Livrée' : 'Done' },
          ].map((item) => {
            const isCompleted = currentStep >= item.step;
            const isCurrent = currentStep === item.step;
            return (
              <View key={item.step} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted && styles.timelineDotDone,
                    isCurrent && styles.timelineDotCurrent,
                  ]}
                >
                  <Text style={styles.timelineDotText}>
                    {isCompleted ? '✓' : item.step}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelDone,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Pickup QR & PIN Card if Pickup or Ready */}
      <View style={styles.pickupCard}>
        <Text style={styles.cardHeading}>
          {language === 'fr' ? '🎫 Votre Code de Ramassage / Réception' : '🎫 Pickup & Delivery Verification'}
        </Text>
        <Text style={styles.pickupHint}>
          {language === 'fr'
            ? 'Montrez ce code QR ou le NIP au commis du restaurant ou au livreur.'
            : 'Show this QR or PIN code to store staff or driver upon arrival.'}
        </Text>

        <View style={styles.codeRow}>
          <View style={styles.pinBubble}>
            <Text style={styles.pinBubbleLabel}>{language === 'fr' ? 'NIP DE SECOURS' : 'BACKUP PIN'}</Text>
            <Text style={styles.pinBubbleDigits}>#{activeOrder.backup_pin || activeOrder.pickup_pin || '4829'}</Text>
          </View>

          <View style={styles.tokenBubble}>
            <Text style={styles.tokenBubbleLabel}>TOKEN QR</Text>
            <Text style={styles.tokenBubbleText}>{activeOrder.pickup_token || 'PICK-WRAP-883'}</Text>
          </View>
        </View>
      </View>

      {/* Live Driver Map & GPS Tracker */}
      {activeOrder.fulfillment_type === 'delivery' && (
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <Text style={styles.cardHeading}>
              🗺️ {language === 'fr' ? 'Suivi GPS du Livreur en Direct' : 'Live Driver GPS Tracking'}
            </Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>● LIVE GPS</Text>
            </View>
          </View>

          {/* Interactive Map Visual Simulator */}
          <View style={styles.mapVisual}>
            <View style={styles.mapRoadH} />
            <View style={styles.mapRoadV} />

            {/* Restaurant Marker */}
            <View style={[styles.mapMarker, styles.restaurantMarker]}>
              <Text style={{ fontSize: 16 }}>🏪</Text>
              <Text style={styles.markerTag}>La Maison</Text>
            </View>

            {/* Customer Marker */}
            <View style={[styles.mapMarker, styles.customerMarker]}>
              <Text style={{ fontSize: 16 }}>📍</Text>
              <Text style={styles.markerTag}>Vous</Text>
            </View>

            {/* Moving Driver Car Marker */}
            <View style={[styles.mapMarker, styles.driverMarker]}>
              <Text style={{ fontSize: 18 }}>🚗</Text>
              <Text style={styles.driverTag}>Livreur</Text>
            </View>
          </View>

          <Text style={styles.mapAddress}>
            📍 Destination : {activeOrder.delivery_address}
          </Text>
        </View>
      )}

      {/* Two-Way Realtime In-App Chat (Supabase) */}
      <View style={styles.chatCard}>
        <Text style={styles.cardHeading}>
          💬 {language === 'fr' ? 'Clavardage en Direct (Restaurant & Livreur)' : 'Live Order Chat'}
        </Text>

        <View style={styles.chatMessagesArea}>
          {chats.length === 0 ? (
            <Text style={styles.noChatText}>
              {language === 'fr'
                ? 'Une question sur votre commande? Écrivez directement à la cuisine ou au livreur ci-dessous.'
                : 'Need to add notes? Chat directly with the restaurant or courier below.'}
            </Text>
          ) : (
            chats.map((c) => {
              const isMe = c.sender_role === 'client';
              return (
                <View
                  key={c.id}
                  style={[
                    styles.chatBubble,
                    isMe ? styles.chatBubbleMe : styles.chatBubbleOther,
                  ]}
                >
                  <Text style={styles.chatSender}>
                    {c.sender_role === 'client' ? 'Vous' : c.sender_role === 'kitchen' ? '👨‍🍳 Cuisine' : '🚗 Livreur'}
                  </Text>
                  <Text style={styles.chatText}>{c.message}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Input Bar */}
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder={language === 'fr' ? 'Écrire un message...' : 'Type a message...'}
            placeholderTextColor="#777"
            value={chatInput}
            onChangeText={setChatInput}
          />
          <TouchableOpacity
            style={styles.chatSendBtn}
            onPress={handleSendMessage}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.chatSendBtnText}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
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
    paddingBottom: 60,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySub: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
  },
  statusCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  orderNumberTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  statusPill: {
    backgroundColor: 'rgba(255, 85, 0, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5500',
  },
  statusPillText: {
    color: '#FF5500',
    fontWeight: '800',
    fontSize: 11,
  },
  etaBanner: {
    flexDirection: 'row',
    backgroundColor: '#26262B',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#33333A',
  },
  etaEmoji: {
    fontSize: 26,
  },
  etaTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  etaSub: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A2A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  timelineDotDone: {
    backgroundColor: '#10B981',
  },
  timelineDotCurrent: {
    backgroundColor: '#FF5500',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  timelineDotText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  timelineLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  timelineLabelDone: {
    color: '#DDD',
  },
  pickupCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 16,
  },
  cardHeading: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  pickupHint: {
    color: '#888',
    fontSize: 12,
    marginBottom: 14,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pinBubble: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5500',
  },
  pinBubbleLabel: {
    color: '#FF5500',
    fontSize: 10,
    fontWeight: '800',
  },
  pinBubbleDigits: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 2,
  },
  tokenBubble: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  tokenBubbleLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '700',
  },
  tokenBubbleText: {
    color: '#DDD',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  mapCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 16,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  liveBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  mapVisual: {
    height: 140,
    backgroundColor: '#14171E',
    borderRadius: 14,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#232936',
  },
  mapRoadH: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#283042',
  },
  mapRoadV: {
    position: 'absolute',
    left: '40%',
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: '#283042',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  restaurantMarker: {
    top: 20,
    left: 20,
  },
  customerMarker: {
    bottom: 20,
    right: 30,
  },
  driverMarker: {
    top: 55,
    left: '52%',
  },
  markerTag: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#000',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  driverTag: {
    color: '#FF5500',
    fontSize: 9,
    fontWeight: '900',
    backgroundColor: '#000',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  mapAddress: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 10,
  },
  chatCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  chatMessagesArea: {
    minHeight: 100,
    maxHeight: 200,
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginBottom: 12,
  },
  noChatText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  chatBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF5500',
  },
  chatBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#2A2A2E',
  },
  chatSender: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  chatText: {
    color: '#FFF',
    fontSize: 13,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  chatSendBtn: {
    backgroundColor: '#FF5500',
    borderRadius: 10,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
