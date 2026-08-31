import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  signIn: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    set({ user, accessToken });
  },
  signOut: async () => {
    await SecureStore.deleteItemAsync('refreshToken');
    set({ user: null, accessToken: null });
  },
  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    set({ accessToken });
  },
  restoreSession: async () => {
    // In a real app, verify refresh token and get user info. 
    // Handled in api interceptor or app bootstrap.
    set({ isLoading: false });
  },
}));
