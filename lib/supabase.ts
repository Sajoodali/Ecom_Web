
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Your current key 'sb_publishable_...' is NOT a Supabase Anon Key.
// Go to Supabase -> Settings -> API -> Copy 'anon public' (starts with eyJ...)
const supabaseUrl = 'https://fblgnxekjrmqypwvdruu.supabase.co';
const supabaseAnonKey = 'sb_publishable_vFRghc0b9Olsb1hGGCbOCw_wk7rSdJ5'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
