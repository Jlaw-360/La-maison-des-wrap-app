import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { OrderScreen } from './src/screens/OrderScreen';
import { ScanRewardsScreen } from './src/screens/ScanRewardsScreen';
import { TrackingScreen } from './src/screens/TrackingScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { KitchenScreen } from './src/screens/KitchenScreen';
import { DriverScreen } from './src/screens/DriverScreen';
import { AdminScreen } from './src/screens/AdminScreen';

type CustomerTab = 'home' | 'order' | 'scan' | 'tracking' | 'account';

const MainNavigator: React.FC = () => {
  const { isAuthenticated, role, user, signOut, switchRolePreview, activeRolePreview } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');

  // Gatekeeping: Require Authentication First
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // 1. Kitchen Staff View (Strict Role Enforcement)
  if (role === 'kitchen') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.roleHeaderBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18 }}>👨‍🍳</Text>
            <Text style={styles.roleHeaderText}>Cuisine Kanban KDS · {user?.full_name}</Text>
          </View>
          {user?.role === 'admin' && activeRolePreview ? (
            <TouchableOpacity style={styles.roleHeaderBtn} onPress={() => switchRolePreview(null)}>
              <Text style={styles.roleHeaderBtnText}>Quitter Démo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.roleHeaderBtn} onPress={signOut}>
              <Text style={styles.roleHeaderBtnText}>Déconnexion</Text>
            </TouchableOpacity>
          )}
        </View>
        <KitchenScreen />
      </SafeAreaView>
    );
  }

  // 2. Driver Dispatch View (Strict Role Enforcement)
  if (role === 'driver') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.roleHeaderBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18 }}>🚗</Text>
            <Text style={styles.roleHeaderText}>Livreur Dispatch · {user?.full_name}</Text>
          </View>
          {user?.role === 'admin' && activeRolePreview ? (
            <TouchableOpacity style={styles.roleHeaderBtn} onPress={() => switchRolePreview(null)}>
              <Text style={styles.roleHeaderBtnText}>Quitter Démo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.roleHeaderBtn} onPress={signOut}>
              <Text style={styles.roleHeaderBtnText}>Déconnexion</Text>
            </TouchableOpacity>
          )}
        </View>
        <DriverScreen />
      </SafeAreaView>
    );
  }

  // 3. Admin Master Console View (Only Accessible by Admin)
  if (role === 'admin' && !activeRolePreview) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.roleHeaderBar, { backgroundColor: '#2D1B4E' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18 }}>👑</Text>
            <Text style={styles.roleHeaderText}>Console Admin Master · {user?.full_name}</Text>
          </View>
          <TouchableOpacity style={styles.roleHeaderBtn} onPress={signOut}>
            <Text style={styles.roleHeaderBtnText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
        <AdminScreen onSwitchView={(r) => switchRolePreview(r)} />
      </SafeAreaView>
    );
  }

  // 4. Customer 5-Tab Application (Default for all registered clients)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Demo Bar for Admin Testing only if Admin */}
      {user?.role === 'admin' && activeRolePreview && (
        <View style={styles.adminDemoBanner}>
          <Text style={styles.adminDemoText}>👑 Mode Prévisualisation Admin : {role.toUpperCase()}</Text>
          <TouchableOpacity style={styles.adminDemoBtn} onPress={() => switchRolePreview(null)}>
            <Text style={styles.adminDemoBtnText}>Retour Admin</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Tab Screen */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateToOrder={() => setActiveTab('order')}
            onNavigateToScan={() => setActiveTab('scan')}
            onNavigateToTracking={() => setActiveTab('tracking')}
          />
        )}
        {activeTab === 'order' && (
          <OrderScreen onNavigateToTracking={() => setActiveTab('tracking')} />
        )}
        {activeTab === 'scan' && <ScanRewardsScreen />}
        {activeTab === 'tracking' && <TrackingScreen />}
        {activeTab === 'account' && <AccountScreen />}
      </View>

      {/* 5-Tab Bottom Navigation Bar (Tim Hortons / McDo Model) */}
      <View style={styles.bottomNav}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={styles.navEmoji}>🏠</Text>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Accueil
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Order Menu */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('order')}
        >
          <Text style={styles.navEmoji}>🌯</Text>
          <Text style={[styles.navLabel, activeTab === 'order' && styles.navLabelActive]}>
            Commander
          </Text>
        </TouchableOpacity>

        {/* Center Action Button: Scan & Rewards QR Hub */}
        <TouchableOpacity
          style={styles.centerQrButton}
          onPress={() => setActiveTab('scan')}
        >
          <View style={[styles.centerQrCircle, activeTab === 'scan' && styles.centerQrCircleActive]}>
            <Text style={styles.centerQrEmoji}>📲</Text>
            <Text style={styles.centerQrText}>SCAN</Text>
          </View>
        </TouchableOpacity>

        {/* Tab 4: Tracking & Chat */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('tracking')}
        >
          <Text style={styles.navEmoji}>🛵</Text>
          <Text style={[styles.navLabel, activeTab === 'tracking' && styles.navLabelActive]}>
            Suivi
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Account */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('account')}
        >
          <Text style={styles.navEmoji}>👤</Text>
          <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>
            Compte
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  roleHeaderBar: {
    backgroundColor: '#1C1C24',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C38',
  },
  roleHeaderText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  roleHeaderBtn: {
    backgroundColor: '#2A2A38',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444458',
  },
  roleHeaderBtnText: {
    color: '#DDD',
    fontSize: 11,
    fontWeight: '700',
  },
  adminDemoBanner: {
    backgroundColor: '#3B1A54',
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#582C7E',
  },
  adminDemoText: {
    color: '#E9D5FF',
    fontSize: 12,
    fontWeight: '800',
  },
  adminDemoBtn: {
    backgroundColor: '#FF5500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  adminDemoBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#18181C',
    height: 72,
    borderTopWidth: 1,
    borderTopColor: '#262630',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#FF5500',
    fontWeight: '800',
  },
  centerQrButton: {
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
  },
  centerQrCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FF5500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5500',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: '#121212',
  },
  centerQrCircleActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF5500',
  },
  centerQrEmoji: {
    fontSize: 20,
  },
  centerQrText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
