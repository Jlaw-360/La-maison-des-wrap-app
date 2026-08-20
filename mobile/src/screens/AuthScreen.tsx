import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, language, setLanguage } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert(language === 'fr' ? 'Veuillez entrer votre adresse courriel.' : 'Please enter your email address.');
      return;
    }
    setLoading(true);
    let success = false;
    if (isSignUp) {
      if (!fullName.trim() || !phone.trim()) {
        alert(language === 'fr' ? 'Veuillez remplir votre nom et numéro de téléphone.' : 'Please fill in your name and phone number.');
        setLoading(false);
        return;
      }
      success = await signUp(email, fullName, phone, password);
    } else {
      success = await signIn(email, password);
    }
    setLoading(false);
    if (!success) {
      alert(language === 'fr' ? 'Erreur de connexion. Veuillez réessayer.' : 'Login error. Please try again.');
    }
  };

  const handleDemoLogin = async (demoRole: 'client' | 'kitchen' | 'driver' | 'admin') => {
    setLoading(true);
    const demoEmails = {
      client: 'client.test@maisondeswraps.ca',
      kitchen: 'cuisine@maisondeswraps.ca',
      driver: 'livreur@maisondeswraps.ca',
      admin: 'admin@maisondeswraps.ca',
    };
    await signIn(demoEmails[demoRole], 'password123', demoRole.toUpperCase() + ' Demo', '819-850-3972');
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Language Switcher */}
      <View style={styles.langContainer}>
        <TouchableOpacity
          style={[styles.langBtn, language === 'fr' && styles.langBtnActive]}
          onPress={() => setLanguage('fr')}
        >
          <Text style={[styles.langText, language === 'fr' && styles.langTextActive]}>FR (Français)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN (English)</Text>
        </TouchableOpacity>
      </View>

      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌯</Text>
        </View>
        <Text style={styles.brandTitle}>LA MAISON DES WRAPS</Text>
        <Text style={styles.brandSub}>
          {language === 'fr' ? 'Saveurs de l\'Inde · Drummondville, QC' : 'Indian Flavors · Drummondville, QC'}
        </Text>
      </View>

      {/* Tim Hortons / McDo Auth Card */}
      <View style={styles.card}>
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={[styles.tabBtn, !isSignUp && styles.tabBtnActive]}
            onPress={() => setIsSignUp(false)}
          >
            <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
              {language === 'fr' ? 'Connexion' : 'Sign In'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, isSignUp && styles.tabBtnActive]}
            onPress={() => setIsSignUp(true)}
          >
            <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
              {language === 'fr' ? 'Créer un compte' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>

        {isSignUp && (
          <>
            <Text style={styles.inputLabel}>{language === 'fr' ? 'Nom complet' : 'Full Name'}</Text>
            <TextInput
              style={styles.input}
              placeholder={language === 'fr' ? 'Ex. Alex Tremblay' : 'Ex. Alex Smith'}
              placeholderTextColor="#777"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.inputLabel}>{language === 'fr' ? 'Téléphone (pour livraison/SMS)' : 'Phone Number'}</Text>
            <TextInput
              style={styles.input}
              placeholder="819-555-0199"
              placeholderTextColor="#777"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        )}

        <Text style={styles.inputLabel}>{language === 'fr' ? 'Courriel' : 'Email Address'}</Text>
        <TextInput
          style={styles.input}
          placeholder="nom@exemple.ca"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>{language === 'fr' ? 'Mot de passe' : 'Password'}</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isSignUp
                ? language === 'fr'
                  ? 'Rejoindre & Gagner 100 Pts 🎁'
                  : 'Register & Earn 100 Pts 🎁'
                : language === 'fr'
                ? 'Se connecter'
                : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Quick Role Tester Demo Buttons */}
        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>
            {language === 'fr' ? '⚡ Connexion rapide démo (1-clic) :' : '⚡ Quick 1-Click Demo Login:'}
          </Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity style={styles.demoBtn} onPress={() => handleDemoLogin('client')}>
              <Text style={styles.demoBtnText}>👤 Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={() => handleDemoLogin('kitchen')}>
              <Text style={styles.demoBtnText}>👨‍🍳 Cuisine</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={() => handleDemoLogin('driver')}>
              <Text style={styles.demoBtnText}>🚗 Livreur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={() => handleDemoLogin('admin')}>
              <Text style={styles.demoBtnText}>👑 Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 24,
    justifyContent: 'center',
  },
  langContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  langBtnActive: {
    backgroundColor: '#FF5500',
  },
  langText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 85, 0, 0.15)',
    borderWidth: 2,
    borderColor: '#FF5500',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    fontFamily: 'sans-serif',
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  brandSub: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#2C2C2E',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  inputLabel: {
    color: '#DDD',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  submitBtn: {
    backgroundColor: '#FF5500',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#FF5500',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  demoLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  demoBtn: {
    backgroundColor: '#2A2A2E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  demoBtnText: {
    color: '#FF5500',
    fontSize: 12,
    fontWeight: '700',
  },
});
