import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey: string = process.env.REACT_APP_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
