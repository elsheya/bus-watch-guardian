
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bqpwfkwskqpvbbjbgihw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcHdma3dza3FwdmJiamJnaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTgyNDUsImV4cCI6MjA2MzAzNDI0NX0.EZVyp9aMwFa-P-Da3ruUbY_-PfWjhCrdjTmgihQkg_A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
