import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const ScanRewardsScreen: React.FC = () => {
  const { user, points, language } = useAuth();
  const { isRedeemingPoints, setIsRedeemingPoints } = useCart();
  const [useSandwichReward, setUseSandwichReward] = useState<boolean>(false);

  // Generate dynamic QR and PIN for pickup/rewards verification
  const memberCode = user?.id ? 'LMDW-MEMBER-' + user.id.substring(0, 8).toUpperCase() : 'LMDW-GUEST-7729';
  const backupPin = user?.id ? (Math.abs(user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)) % 9000 + 1000).toString() : '4829';

  const rewardsCatalog = [
    { title_fr: 'Pain Naan Traditionnel ou à l\'Ail', title_en: 'Traditional or Garlic Naan', pts: 150, emoji: '🫓' },
    { title_fr: 'Lassi à la Mangue Fraîche', title_en: 'Fresh Mango Lassi', pts: 180, emoji: '🥤' },
    { title_fr: 'Samosas Végétariens (2 pcs)', title_en: 'Vegetarian Samosas (2 pcs)', pts: 200, emoji: '🥟' },
    { title_fr: 'Wrap Poulet Tikka / Seekh Kebab', title_en: 'Chicken Tikka or Seekh Wrap', pts: 350, emoji: '🌯' },
    { title_fr: 'Wrap Steak & Fromage Fondant', title_en: 'Steak & Cheese Melt Wrap', pts: 400, emoji: '🥩' },
    { title_fr: 'Poutine au Poulet au Beurre', title_en: 'Butter Chicken Poutine', pts: 500, emoji: '🍟' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          📲 {language === 'fr' ? 'Scanner en Restaurant' : 'Scan in Store'}
        </Text>
        <Text style={styles.headerSub}>
          {language === 'fr'
            ? 'Présentez ce code à la caisse pour accumuler des points ou récupérer votre commande.'
            : 'Scan this code at the register to earn points or collect your pickup order.'}
        </Text>
      </View>

      {/* Tim Hortons / McDo QR Scanner Card */}
      <View style={styles.qrCard}>
        {/* Points Banner inside QR Card */}
        <View style={styles.pointsBadgeHeader}>
          <Text style={styles.pointsBadgeEmoji}>🌟</Text>
          <View>
            <Text style={styles.pointsBadgeValue}>{points} Points</Text>
            <Text style={styles.pointsBadgeSub}>
              {language === 'fr' ? 'Solde de récompenses actif' : 'Active Rewards Balance'}
            </Text>
          </View>
        </View>

        {/* QR Code Visual Component */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeBox}>
            {/* Visual SVG / QR Simulation */}
            <View style={styles.qrGrid}>
              <View style={[styles.qrCorner, styles.qrTopLeft]} />
              <View style={[styles.qrCorner, styles.qrTopRight]} />
              <View style={[styles.qrCorner, styles.qrBottomLeft]} />
              <View style={styles.qrCenterPattern}>
                <Text style={styles.qrEmojiCenter}>🌯</Text>
              </View>
            </View>
          </View>
          <Text style={styles.qrTokenText}>{memberCode}</Text>
        </View>

        {/* 4-Digit Backup PIN Code */}
        <View style={styles.pinContainer}>
          <Text style={styles.pinLabel}>
            {language === 'fr' ? 'Code NIP de secours (si le scan ne fonctionne pas) :' : '4-Digit Backup PIN :'}
          </Text>
          <View style={styles.pinBox}>
            <Text style={styles.pinDigits}>#{backupPin}</Text>
          </View>
        </View>

        {/* Rewards Toggle Switcher */}
        <View style={styles.rewardToggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rewardToggleTitle}>
              🎁 {language === 'fr' ? 'Échanger un Wrap Gratuit (350 pts)' : 'Redeem Free Wrap (350 pts)'}
            </Text>
            <Text style={styles.rewardToggleSub}>
              {language === 'fr'
                ? 'Activez avant que le commis ne scanne votre code QR'
                : 'Turn on before the cashier scans your code'}
            </Text>
          </View>
          <Switch
            value={useSandwichReward}
            onValueChange={(val) => {
              setUseSandwichReward(val);
              setIsRedeemingPoints(val);
            }}
            trackColor={{ false: '#333', true: '#FF5500' }}
            thumbColor="#FFF"
            disabled={points < 350}
          />
        </View>
      </View>

      {/* Rewards Catalog */}
      <View style={styles.rewardsSection}>
        <Text style={styles.rewardsSectionTitle}>
          🏆 {language === 'fr' ? 'Catalogue des Récompenses' : 'Rewards Catalog'}
        </Text>
        <Text style={styles.rewardsSectionSub}>
          {language === 'fr'
            ? 'Accumulez 10 points par tranche de 1$ CAD dépensé.'
            : 'Earn 10 points for every $1 CAD spent.'}
        </Text>

        <View style={styles.rewardsGrid}>
          {rewardsCatalog.map((reward, index) => {
            const isUnlocked = points >= reward.pts;
            return (
              <View key={index} style={[styles.rewardItemCard, isUnlocked && styles.rewardUnlocked]}>
                <Text style={styles.rewardEmoji}>{reward.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardItemTitle}>
                    {language === 'fr' ? reward.title_fr : reward.title_en}
                  </Text>
                  <Text style={[styles.rewardPtsText, isUnlocked && styles.rewardPtsUnlocked]}>
                    🌟 {reward.pts} pts {isUnlocked ? '(Disponible!)' : ''}
                  </Text>
                </View>
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
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  qrCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 24,
  },
  pointsBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 85, 0, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF5500',
    gap: 10,
    marginBottom: 20,
  },
  pointsBadgeEmoji: {
    fontSize: 20,
  },
  pointsBadgeValue: {
    color: '#FF5500',
    fontSize: 16,
    fontWeight: '900',
  },
  pointsBadgeSub: {
    color: '#AAA',
    fontSize: 10,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 280,
  },
  qrCodeBox: {
    width: 180,
    height: 180,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    width: 160,
    height: 160,
    backgroundColor: '#000000',
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCorner: {
    position: 'absolute',
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 8,
    borderColor: '#000000',
  },
  qrTopLeft: { top: 10, left: 10 },
  qrTopRight: { top: 10, right: 10 },
  qrBottomLeft: { bottom: 10, left: 10 },
  qrCenterPattern: {
    width: 50,
    height: 50,
    backgroundColor: '#FF5500',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrEmojiCenter: {
    fontSize: 24,
  },
  qrTokenText: {
    color: '#121212',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
    letterSpacing: 1,
  },
  pinContainer: {
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
  },
  pinLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 6,
  },
  pinBox: {
    backgroundColor: '#121212',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  pinDigits: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
  rewardToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: '#28282C',
  },
  rewardToggleTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rewardToggleSub: {
    color: '#777',
    fontSize: 10,
    marginTop: 2,
  },
  rewardsSection: {
    marginTop: 4,
  },
  rewardsSectionTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  rewardsSectionSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  rewardsGrid: {
    gap: 10,
  },
  rewardItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 12,
  },
  rewardUnlocked: {
    borderColor: '#FF5500',
    backgroundColor: 'rgba(255, 85, 0, 0.05)',
  },
  rewardEmoji: {
    fontSize: 26,
  },
  rewardItemTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rewardPtsText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  rewardPtsUnlocked: {
    color: '#FF5500',
    fontWeight: '800',
  },
});
