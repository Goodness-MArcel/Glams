import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbdmwqrswkoxnokrlprh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZG13cXJzd2tveG5va3JscHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM2NDE4MCwiZXhwIjoyMDgwOTQwMTgwfQ.-ZTrebQ6lGN8ZkqmSIlUPj_PKknTOFICC1mDtYEsXo8';

export const supabase = createClient(supabaseUrl, supabaseKey);