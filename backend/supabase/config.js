import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: {
    persistSession: true,     // keep user logged in after refresh
    autoRefreshToken: true,   // refresh tokens automatically
    detectSessionInUrl: true, // needed for magic link / OAuth redirect
    flowType: 'pkce',         // recommended for security
    storageKey: 'myapp-session', // optional: change storage key
  }
});