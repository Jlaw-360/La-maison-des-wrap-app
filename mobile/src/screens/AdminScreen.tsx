import { AppMetrics } from 'expo-observe';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { UserProfile, Order, UserRole } from '../types';
import { fetchAllUsers, updateUserRole, fetchLiveOrders } from '../services/supabase';
import { LOCAL_MENU_ITEMS } from '../data/menu';

interface AdminScreenProps {
  onSwitchView: (role: UserRole) => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onSwitchView }) => {
  React.useEffect(() => {
    try {
      AppMetrics?.markInteractive?.();
    } catch(e) {}
  }, []);

  const { user, language, switchRolePreview, activeRolePreview } = useAuth();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [soldOutItems, setSoldOutItems] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchLiveOrders()]).then(([uData, oData]) => {
      setUsersList(uData);
      setOrders(oData);
      setLoading(false);
    });
  }, []);

  const handlePromoteRole = async (targetUserId: string, newRole: UserRole) => {
    const success = await updateUserRole(targetUserId, newRole);
    if (success) {
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
      alert(language === 'fr' ? `✅ Rôle mis à jour : ${newRole.toUpperCase()}` : `✅ Role updated: ${newRole.toUpperCase()}`);
    }
  };

  const toggleSoldOut = (itemId: string) => {
    if (soldOutItems.includes(itemId)) {
      setSoldOutItems(soldOutItems.filter((id) => id !== itemId));
    } else {
      setSoldOutItems([...soldOutItems, itemId]);
    }
  };

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_cad || 0), 0);
  const totalTps = orders.reduce((sum, o) => sum + (o.tps_tax_cad || 0), 0);
  const totalTvq = orders.reduce((sum, o) => sum + (o.tvq_tax_cad || 0), 0);
  const totalClientsCount = usersList.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Universal Multi-Role Preview Switcher */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>
          👑 {language === 'fr' ? 'Sélecteur de Rôle Universel (Mode Démo Admin)' : 'Universal Role Switcher'}
        </Text>
        <Text style={styles.previewSub}>
          {language === 'fr'
            ? 'Basculez instantanément pour tester l\'interface de chaque rôle utilisateur :'
            : 'Switch instantly to preview and test each user interface:'}
        </Text>

        <View style={styles.roleGrid}>
          <TouchableOpacity
            style={[styles.roleBtn, activeRolePreview === 'client' && styles.roleBtnActive]}
            onPress={() => switchRolePreview('client')}
          >
            <Text style={styles.roleBtnText}>👤 Client (Menu & Scan)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, activeRolePreview === 'kitchen' && styles.roleBtnActive]}
            onPress={() => switchRolePreview('kitchen')}
          >
            <Text style={styles.roleBtnText}>👨‍🍳 Cuisine (Kanban KDS)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, activeRolePreview === 'driver' && styles.roleBtnActive]}
            onPress={() => switchRolePreview('driver')}
          >
            <Text style={styles.roleBtnText}>🚗 Livreur (GPS & QR)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, (activeRolePreview === 'admin' || !activeRolePreview) && styles.roleBtnActive]}
            onPress={() => switchRolePreview(null)}
          >
            <Text style={styles.roleBtnText}>👑 Console Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Dashboard (Revenue, Orders, Clients) */}
      <View style={styles.kpiSection}>
        <Text style={styles.sectionHeading}>
          📊 {language === 'fr' ? 'Indicateurs de Performance (KPI)' : 'Performance Metrics'}
        </Text>

        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>REVENU TOTAL (CAD)</Text>
            <Text style={styles.kpiValue}>${totalRevenue.toFixed(2)}</Text>
            <Text style={styles.kpiSub}>TPS: ${totalTps.toFixed(2)} · TVQ: ${totalTvq.toFixed(2)}</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>COMMANDES</Text>
            <Text style={styles.kpiValue}>{orders.length}</Text>
            <Text style={styles.kpiSub}>Drummondville, QC</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>CLIENTS INSCRITS</Text>
            <Text style={styles.kpiValue}>{totalClientsCount}</Text>
            <Text style={styles.kpiSub}>Base Supabase</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>TEMPS MOYEN PRÉP.</Text>
            <Text style={styles.kpiValue}>7.5 min</Text>
            <Text style={styles.kpiSub}>Objectif 5-10 min</Text>
          </View>
        </View>
      </View>

      {/* User Role Management Console */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>
          👥 {language === 'fr' ? 'Gestion des Utilisateurs & Attribution des Rôles' : 'User Role Management'}
        </Text>
        <Text style={styles.sectionSub}>
          {language === 'fr'
            ? 'Changez le rôle d\'un client pour lui donner accès à la Cuisine, aux Livraisons ou à l\'Administration.'
            : 'Change user roles to grant access to Kitchen, Driver, or Admin portals.'}
        </Text>

        {loading ? (
          <ActivityIndicator color="#FF5500" style={{ padding: 20 }} />
        ) : (
          usersList.map((u) => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.full_name || 'Utilisateur'}</Text>
                <Text style={styles.userEmail}>{u.email} · {u.phone || 'Sans tél'}</Text>
                <View style={styles.currentRoleBadge}>
                  <Text style={styles.currentRoleText}>RÔLE ACTUEL : {u.role.toUpperCase()}</Text>
                </View>
              </View>

              {/* Role Action Buttons */}
              <View style={styles.roleActionRow}>
                <TouchableOpacity
                  style={[styles.smallRoleBtn, u.role === 'client' && styles.smallRoleActive]}
                  onPress={() => handlePromoteRole(u.id, 'client')}
                >
                  <Text style={styles.smallRoleText}>Client</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallRoleBtn, u.role === 'kitchen' && styles.smallRoleActive]}
                  onPress={() => handlePromoteRole(u.id, 'kitchen')}
                >
                  <Text style={styles.smallRoleText}>Cuisine</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallRoleBtn, u.role === 'driver' && styles.smallRoleActive]}
                  onPress={() => handlePromoteRole(u.id, 'driver')}
                >
                  <Text style={styles.smallRoleText}>Livreur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallRoleBtn, u.role === 'admin' && styles.smallRoleActive]}
                  onPress={() => handlePromoteRole(u.id, 'admin')}
                >
                  <Text style={styles.smallRoleText}>Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* 86 / Sold Out Inventory Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>
          🚫 {language === 'fr' ? 'Gestion des Ruptures de Stock (86 / Épuisé)' : '86 / Sold Out Inventory Controls'}
        </Text>
        <View style={styles.inventoryList}>
          {LOCAL_MENU_ITEMS.map((item) => {
            const isSoldOut = soldOutItems.includes(item.id);
            return (
              <View key={item.id} style={styles.inventoryCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inventoryItemName}>
                    {language === 'fr' ? item.name_fr : item.name_en}
                  </Text>
                  <Text style={styles.inventoryItemPrice}>${item.price_cad.toFixed(2)} CAD</Text>
                </View>
                <TouchableOpacity
                  style={[styles.soldOutBtn, isSoldOut && styles.soldOutBtnActive]}
                  onPress={() => toggleSoldOut(item.id)}
                >
                  <Text style={styles.soldOutBtnText}>
                    {isSoldOut ? '❌ Épuisé (86)' : '✅ Disponible'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
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
  previewCard: {
    backgroundColor: '#1A1824',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#302844',
    marginBottom: 20,
  },
  previewTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  previewSub: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleBtn: {
    backgroundColor: '#262038',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D345C',
  },
  roleBtnActive: {
    backgroundColor: '#FF5500',
    borderColor: '#FF5500',
  },
  roleBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  kpiSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSub: {
    color: '#888',
    fontSize: 12,
    marginBottom: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#18181F',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#282836',
  },
  kpiLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '800',
  },
  kpiValue: {
    color: '#FF5500',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  kpiSub: {
    color: '#AAA',
    fontSize: 10,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  userCard: {
    backgroundColor: '#18181F',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#262633',
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  userEmail: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  currentRoleBadge: {
    backgroundColor: 'rgba(255, 85, 0, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  currentRoleText: {
    color: '#FF5500',
    fontSize: 10,
    fontWeight: '800',
  },
  roleActionRow: {
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#242430',
    paddingTop: 10,
  },
  smallRoleBtn: {
    flex: 1,
    backgroundColor: '#22222C',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  smallRoleActive: {
    backgroundColor: '#FF5500',
  },
  smallRoleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  inventoryList: {
    gap: 8,
    marginTop: 10,
  },
  inventoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181F',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#262633',
  },
  inventoryItemName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  inventoryItemPrice: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  soldOutBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  soldOutBtnActive: {
    backgroundColor: '#7F1D1D',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  soldOutBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
