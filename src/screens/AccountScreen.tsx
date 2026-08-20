import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchCustomerOrders } from '../services/supabase';
import { Order } from '../types';

export const AccountScreen: React.FC = () => {
  const { user, points, language, setLanguage, signOut } = useAuth();
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchCustomerOrders(user.id)
        .then(setPastOrders)
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'M'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.full_name || 'Membre Récompenses'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {user?.phone ? <Text style={styles.userPhone}>📞 {user.phone}</Text> : null}

        {/* Rewards Summary */}
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsEmoji}>🌟</Text>
          <View>
            <Text style={styles.pointsValue}>{points} Points</Text>
            <Text style={styles.pointsSub}>
              {language === 'fr' ? 'Niveau Gourmet · Drummondville' : 'Gourmet Level · Drummondville'}
            </Text>
          </View>
        </View>
      </View>

      {/* Language Preferences */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          🌐 {language === 'fr' ? 'Langue de l\'application' : 'App Language'}
        </Text>
        <View style={styles.langRow}>
          <TouchableOpacity
            style={[styles.langBtn, language === 'fr' && styles.langBtnActive]}
            onPress={() => setLanguage('fr')}
          >
            <Text style={[styles.langBtnText, language === 'fr' && styles.textWhite]}>
              Français (Québec)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langBtnText, language === 'en' && styles.textWhite]}>
              English (Canada)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order History */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          📜 {language === 'fr' ? 'Historique des Commandes' : 'Order History'}
        </Text>

        {loading ? (
          <ActivityIndicator color="#FF5500" style={{ padding: 20 }} />
        ) : pastOrders.length === 0 ? (
          <Text style={styles.emptyHistoryText}>
            {language === 'fr' ? 'Aucune commande passée pour le moment.' : 'No orders placed yet.'}
          </Text>
        ) : (
          pastOrders.map((ord) => (
            <View key={ord.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyNumber}>
                  {language === 'fr' ? 'Commande #' : 'Order #'}{ord.order_number}
                </Text>
                <Text style={styles.historyStatus}>{ord.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.historyDate}>
                {new Date(ord.created_at).toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <View style={styles.historyFooter}>
                <Text style={styles.historyType}>
                  {ord.fulfillment_type === 'delivery' ? '🚗 Livraison' : '🏬 Ramassage'}
                </Text>
                <Text style={styles.historyPrice}>${ord.total_cad.toFixed(2)} CAD</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>
          🚪 {language === 'fr' ? 'Déconnexion' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF5500',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  userEmail: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  userPhone: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 85, 0, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FF5500',
    gap: 12,
    width: '100%',
  },
  pointsEmoji: {
    fontSize: 24,
  },
  pointsValue: {
    color: '#FF5500',
    fontSize: 16,
    fontWeight: '900',
  },
  pointsSub: {
    color: '#888',
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  langBtnActive: {
    backgroundColor: '#FF5500',
    borderColor: '#FF5500',
  },
  langBtnText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
  },
  textWhite: {
    color: '#FFF',
  },
  emptyHistoryText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
  historyCard: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#26262B',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyNumber: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  historyStatus: {
    color: '#FF5500',
    fontSize: 11,
    fontWeight: '800',
  },
  historyDate: {
    color: '#777',
    fontSize: 11,
    marginTop: 2,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#202024',
  },
  historyType: {
    color: '#AAA',
    fontSize: 12,
  },
  historyPrice: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  signOutBtn: {
    backgroundColor: '#2A1818',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
});
