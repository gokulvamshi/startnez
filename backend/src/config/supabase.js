const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Ensure WebSocket is available for Supabase Realtime in Node environments
let WebSocketImpl;
try {
  WebSocketImpl = require('ws');
  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = WebSocketImpl;
  }
  if (typeof global.WebSocket === 'undefined') {
    global.WebSocket = WebSocketImpl;
  }
} catch (e) {
  // ws package not available or native WebSocket exists
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';

const isLiveSupabaseConfigured = () => {
  return (
    process.env.SUPABASE_URL &&
    !process.env.SUPABASE_URL.includes('your-project') &&
    !process.env.SUPABASE_URL.includes('mock.supabase.co') &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key') &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('mock-service-role-key')
  );
};

// Admin client — bypasses RLS (server-side only)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  ...(WebSocketImpl ? { realtime: { transport: WebSocketImpl } } : {})
});

// Factory: create a client scoped to the authenticated user
const createUserClient = (accessToken) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    ...(WebSocketImpl ? { realtime: { transport: WebSocketImpl } } : {})
  });
};

module.exports = {
  supabaseAdmin,
  createUserClient,
  isLiveSupabaseConfigured
};
