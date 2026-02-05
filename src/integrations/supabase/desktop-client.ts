
// Desktop client configuration for time tracking applications
// This uses the service role key which bypasses RLS for desktop trackers

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eussxomitqyumgsuuflq.supabase.co";
// Service role key - this should be used ONLY by desktop applications
// Never expose this key in frontend applications or public repositories
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3N4b21pdHF5dW1nc3V1ZmxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ2MDIzNiwiZXhwIjoyMDY0MDM2MjM2fQ.P8nHMWR2qv_PNs_gCdLyLFfJmYBkO-jvlGwZnYu9LfI";

// Create Supabase client for desktop applications with service role
export const desktopSupabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_SERVICE_ROLE_KEY,
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
