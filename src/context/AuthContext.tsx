import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, getCurrentUserProfile, upsertUserProfile, subscribeToUserProfile } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  points: number;
  language: 'fr' | 'en';
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRolePreview: UserRole | null;
  signIn: (email: string, password?: string, fullName?: string, phone?: string) => Promise<boolean>;
  signUp: (email: string, fullName: string, phone: string, password?: string) => Promise<boolean>;
  signOut: () => void;
  setLanguage: (lang: 'fr' | 'en') => void;
  refreshUserData: () => Promise<void>;
  switchRolePreview: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRolePreview, setActiveRolePreview] = useState<UserRole | null>(null);
  const [language, setLanguageState] = useState<'fr' | 'en'>('fr');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved Better Auth persistent session on launch
  useEffect(() => {
    const initSession = async () => {
      try {
        const savedUserStr = localStorage.getItem('better_auth_user_session');
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          setLanguageState(parsed.preferred_language || 'fr');

          // Always verify latest role & points directly from Supabase
          if (parsed.id) {
            const fresh = await getCurrentUserProfile(parsed.id);
            if (fresh) {
              setUser(fresh);
              localStorage.setItem('better_auth_user_session', JSON.stringify(fresh));
            }
          }
        }
      } catch (e) {
        console.warn('Better Auth session load error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  // Listen for Realtime Role & Points changes from Admin in Supabase
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToUserProfile(user.id, (updatedProfile) => {
      console.log('Realtime role/profile update from Admin:', updatedProfile);
      setUser(updatedProfile);
      localStorage.setItem('better_auth_user_session', JSON.stringify(updatedProfile));
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  const refreshUserData = async () => {
    if (!user?.id) return;
    const freshProfile = await getCurrentUserProfile(user.id);
    if (freshProfile) {
      setUser(freshProfile);
      localStorage.setItem('better_auth_user_session', JSON.stringify(freshProfile));
    }
  };

  const signIn = async (email: string, password?: string, fullName?: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      // Check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      let profile: UserProfile;

      if (existingUser) {
        profile = existingUser as UserProfile;
      } else {
        // Automatic default: New users are strictly assigned 'client' role
        const newProfile: Partial<UserProfile> = {
          email: cleanEmail,
          full_name: fullName || 'Client ' + cleanEmail.split('@')[0],
          phone: phone || '',
          role: 'client', // Strictly 'client' by default
          points_balance: 100, // Welcome reward bonus
          preferred_language: language,
        };
        const created = await upsertUserProfile(newProfile);
        profile = created || {
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          email: cleanEmail,
          full_name: fullName || 'Client',
          role: 'client',
          points_balance: 100,
          preferred_language: language,
        };
      }

      setUser(profile);
      // Persist in localStorage so user stays logged in automatically
      localStorage.setItem('better_auth_user_session', JSON.stringify(profile));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Better Auth Sign in error:', err);
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, fullName: string, phone: string, password?: string): Promise<boolean> => {
    return signIn(email, password, fullName, phone);
  };

  const signOut = () => {
    setUser(null);
    setActiveRolePreview(null);
    localStorage.removeItem('better_auth_user_session');
    localStorage.removeItem('lmdw_user_profile');
  };

  const setLanguage = (lang: 'fr' | 'en') => {
    setLanguageState(lang);
    if (user) {
      setUser({ ...user, preferred_language: lang });
      upsertUserProfile({ id: user.id, preferred_language: lang });
    }
  };

  // If admin is previewing a role, use preview; otherwise use strictly the assigned role in Supabase
  const effectiveRole = user?.role === 'admin' && activeRolePreview ? activeRolePreview : (user?.role || 'client');

  return (
    <AuthContext.Provider
      value={{
        user,
        role: effectiveRole,
        points: user?.points_balance || 0,
        language,
        isAuthenticated: !!user,
        isLoading,
        activeRolePreview,
        signIn,
        signUp,
        signOut,
        setLanguage,
        refreshUserData,
        switchRolePreview: setActiveRolePreview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
