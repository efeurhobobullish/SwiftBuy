import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { User } from '../types';
import { COLORS } from '../constants';

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      login: async (provider: 'google' | 'facebook') => {
        try {
          set({ isLoading: true });

          // Mock OAuth flow for demo purposes
          // In production, integrate with actual Google/Facebook OAuth
          const mockUser: User = {
            id: '1',
            name: provider === 'google' ? 'John Doe' : 'Jane Smith',
            email: provider === 'google' ? 'john.doe@gmail.com' : 'jane.smith@facebook.com',
            avatar: 'https://via.placeholder.com/100',
            phone: '',
            addresses: [],
            createdAt: new Date().toISOString(),
          };

          set({ user: mockUser, isLoading: false });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isLoading: false });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          // In production, verify stored token validity
          const stored = await AsyncStorage.getItem('auth-storage');
          if (stored) {
            const { state } = JSON.parse(stored);
            if (state?.user) {
              set({ user: state.user, isLoading: false });
              return;
            }
          }
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => AsyncStorage.getItem(name),
        setItem: (name, value) => AsyncStorage.setItem(name, value),
        removeItem: (name) => AsyncStorage.removeItem(name),
      },
    }
  )
);

export { useAuthStore };