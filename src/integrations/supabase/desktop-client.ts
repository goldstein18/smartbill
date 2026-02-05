// Desktop client configuration for time tracking applications
// IMPORTANT SECURITY NOTE: 
// The service role key bypasses RLS and should NEVER be exposed in frontend code.
// This client now uses the anon key. If you need service role functionality,
// create a Supabase Edge Function that uses the service role key server-side.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
  );
}

// Create Supabase client for desktop applications
// Using anon key - ensure RLS policies are properly configured in Supabase
export const desktopSupabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Desktop apps handle their own session management
      autoRefreshToken: false
    }
  }
);

// Utility function to insert time entries from desktop tracker
export const insertTimeEntry = async (entry: {
  user_id: string;
  timestamp: string;
  duration: number;
  application: string;
  window_title: string;
  notes?: string;
  client_id?: string;
}) => {
  try {
    console.log("Desktop tracker: Inserting time entry:", entry);
    
    const { data, error } = await desktopSupabase
      .from('time_entries')
      .insert([{
        user_id: entry.user_id,
        timestamp: entry.timestamp,
        duration: entry.duration,
        application: entry.application,
        window_title: entry.window_title,
        notes: entry.notes || null,
        client_id: entry.client_id || null
      }])
      .select()
      .single();

    if (error) {
      console.error("Desktop tracker: Insert error:", error);
      throw error;
    }

    console.log("Desktop tracker: Successfully inserted:", data);
    return data;
  } catch (error) {
    console.error("Desktop tracker: Failed to insert time entry:", error);
    throw error;
  }
};

// Utility function to test the connection
export const testDesktopConnection = async () => {
  try {
    const { data, error } = await desktopSupabase
      .from('time_entries')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error("Desktop tracker: Connection test failed:", error);
      return false;
    }

    console.log("Desktop tracker: Connection test successful");
    return true;
  } catch (error) {
    console.error("Desktop tracker: Connection test failed:", error);
    return false;
  }
};
