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

import { Observe, ObserveRoot, AppMetrics, AppMetricsRoot } from 'expo-observe';

// Configure EAS Observe
try {
  Observe.configure({
    dispatchInDebug: true,
  });
} catch (e) {
  console.warn('[EAS Observe] Configure error:', e);
}

type CustomerTab = 'home' | 'order' | 'scan' | 'tracking' | 'account';

const MainNavigator: React.FC = () => {
  const { isAuthenticated, role, user, signOut, switchRolePreview, activeRolePreview } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [kitchenClientView, setKitchenClientView] = useState<boolean>(false);

  // Gatekeeping: Require Authentication First
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // 1. Kitchen Staff View (Strict Role Enforcement + Toggle to Client App)
  if (role === 'kitchen' && !kitchenClientView) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.roleHeaderBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18 }}>👨‍🍳</Text>
            <Text style={styles.roleHeaderText}>Cuisine Kanban KDS · {user?.full_name}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {user?.role === 'admin' && activeRolePreview ? (
              <TouchableOpacity style={styles.roleHeaderBtn} onPress={() => switchRolePreview(null)}>
                <Text style={styles.roleHeaderBtnText}>Quitter Démo</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={[styles.roleHeaderBtn, { backgroundColor: '#FF5500' }]} onPress={() => setKitchenClientView(true)}>
                  <Text style={[styles.roleHeaderBtnText, { color: '#FFF' }]}>📱 App Client</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roleHeaderBtn} onPress={signOut}>
                  <Text style={styles.roleHeaderBtnText}>Déconnexion</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
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

  // 4. Customer 5-Tab Application (Default for all registered clients & staff preview)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Demo Bar for Admin Testing */}
      {user?.role === 'admin' && activeRolePreview && (
        <View style={styles.adminDemoBanner}>
          <Text style={styles.adminDemoText}>👑 Mode Prévisualisation Admin : {role.toUpperCase()}</Text>
          <TouchableOpacity style={styles.adminDemoBtn} onPress={() => switchRolePreview(null)}>
            <Text style={styles.adminDemoBtnText}>Retour Admin</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Top Bar for Kitchen Staff viewing Client App */}
      {user?.role === 'kitchen' && kitchenClientView && (
        <View style={[styles.adminDemoBanner, { backgroundColor: '#0D3B29', borderBottomColor: '#10B981' }]}>
          <Text style={[styles.adminDemoText, { color: '#A7F3D0' }]}>👨‍🍳 Personnel Cuisine : Mode Client</Text>
          <TouchableOpacity style={[styles.adminDemoBtn, { backgroundColor: '#10B981' }]} onPress={() => setKitchenClientView(false)}>
            <Text style={styles.adminDemoBtnText}>Retour Cuisine</Text>
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

// EAS Observe Root Layout Wrapping (Compatible with SDK 52-56+)
const WrappedApp = typeof ObserveRoot?.wrap === 'function'
  ? ObserveRoot.wrap(App)
  : (typeof AppMetricsRoot?.wrap === 'function' ? AppMetricsRoot.wrap(App) : App);

export default WrappedApp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  roleHeaderBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EBE5DA',
  },
  roleHeaderText: {
    color: '#1C1917',
    fontSize: 13,
    fontWeight: '800',
  },
  roleHeaderBtn: {
    backgroundColor: '#F3EFE6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EBE5DA',
  },
  roleHeaderBtnText: {
    color: '#57534E',
    fontSize: 11,
    fontWeight: '700',
  },
  adminDemoBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  adminDemoText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '800',
  },
  adminDemoBtn: {
    backgroundColor: '#E34A26',
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
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 28, 0.96)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#EBE5DA',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#5A4632',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
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
    color: '#8C857B',
    fontSize: 10,
    fontWeight: '700',
  },
  navLabelActive: {
    color: '#E34A26',
    fontWeight: '800',
  },
  centerQrButton: {
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  centerQrCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E34A26',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E34A26',
    shadowOpacity: 0.38,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FAF7F2',
  },
  centerQrCircleActive: {
    backgroundColor: '#1C1917',
    borderColor: '#E34A26',
  },
  centerQrEmoji: {
    fontSize: 18,
  },
  centerQrText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
