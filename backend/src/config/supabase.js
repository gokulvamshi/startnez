const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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
  }
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
    }
  });
};

module.exports = {
  supabaseAdmin,
  createUserClient,
  isLiveSupabaseConfigured
};
