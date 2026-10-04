import { create } from 'zustand';
import { api } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  token: localStorage.getItem('hc_token') || null,
  isAuthenticated: !!localStorage.getItem('hc_token'),
  isOnboarded: false,
  isLoading: true,

  // initAuth is the public name used by App.jsx; calls initialize internally
  initAuth: async () => get().initialize(),

  initialize: async () => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          localStorage.setItem('hc_token', session.access_token);
          set({
            user: session.user,
            token: session.access_token,
            isAuthenticated: true
          });
          await get().fetchProfile();
          return;
        }
      }

      // Check existing token from local storage
      const token = localStorage.getItem('hc_token');
      if (token) {
        await get().fetchProfile();
      } else {
        set({ user: null, profile: null, isAuthenticated: false, isOnboarded: false, isLoading: false });
      }
    } catch (err) {
      console.warn('Auth initialization check failed, resetting state:', err);
      set({ user: null, profile: null, isAuthenticated: false, isOnboarded: false, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/profiles/me');
      if (response?.data) {
        set({
          profile: response.data,
          user: { id: response.data.id, email: response.data.email, full_name: response.data.full_name },
          isAuthenticated: true,
          isOnboarded: !!response.data.is_onboarded,
          isLoading: false
        });
        return response.data;
      }
    } catch (err) {
      if (err.status === 401) {
        get().logout();
      }
      set({ isLoading: false });
    }
    return null;
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, session } = response.data;
      const token = session?.access_token || `mock-${user.id}`;

      localStorage.setItem('hc_token', token);

      set({
        user,
        token,
        isAuthenticated: true
      });

      const profile = await get().fetchProfile();
      return { success: true, profile };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email, password, full_name) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/signup', { email, password, full_name });
      const { user, session } = response.data;
      const token = session?.access_token || `mock-${user.id}`;

      localStorage.setItem('hc_token', token);

      set({
        user,
        token,
        isAuthenticated: true,
        isOnboarded: false,
        isLoading: false
      });

      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      await api.post('/auth/logout', {}).catch(() => {});
    } catch (err) {
      // Ignore
    } finally {
      localStorage.removeItem('hc_token');
      set({
        user: null,
        profile: null,
        token: null,
        isAuthenticated: false,
        isOnboarded: false,
        isLoading: false
      });
    }
  },

  setProfile: (profile) => {
    set({
      profile,
      isOnboarded: !!profile?.is_onboarded
    });
  }
}));
