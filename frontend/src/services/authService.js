import { api } from './api';
import { supabase } from '../lib/supabase';

export const authService = {
  async signup(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      // Fallback to Express backend if needed
      return api.post('/auth/signup', { email, password, full_name: fullName });
    }
  },

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (err) {
      // Fallback to Express backend
      return api.post('/auth/login', { email, password });
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore
    }
    return api.post('/auth/logout', {});
  },

  async loginWithOAuth(provider) {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    });
  },

  async forgotPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return data;
    } catch (err) {
      return api.post('/auth/forgot-password', { email });
    }
  },

  async resetPassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    } catch (err) {
      return api.post('/auth/reset-password', { password: newPassword });
    }
  },

  async getSession() {
    return api.get('/auth/session');
  }
};
