
// Desktop API utilities for time tracking
// This provides a simple interface for desktop applications to interact with Supabase

import { insertTimeEntry, testDesktopConnection } from './desktop-client';

export interface TimeEntryData {
  user_id: string;
  timestamp: string; // ISO 8601 format
  duration: number; // Duration in seconds
  application: string;
  window_title: string;
  notes?: string;
  client_id?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Main API function for desktop trackers to upload time entries
export const uploadTimeEntry = async (entryData: TimeEntryData): Promise<ApiResponse> => {
  try {
    // Validate required fields
    if (!entryData.user_id || !entryData.timestamp || !entryData.duration || 
        !entryData.application || !entryData.window_title) {
      return {
        success: false,
        error: "Missing required fields: user_id, timestamp, duration, application, window_title"
      };
    }

    // Validate user_id format (should be a UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(entryData.user_id)) {
      return {
        success: false,
        error: "Invalid user_id format. Must be a valid UUID."
      };
    }

    // Validate timestamp format
    const timestamp = new Date(entryData.timestamp);
    if (isNaN(timestamp.getTime())) {
      return {
        success: false,
        error: "Invalid timestamp format. Must be a valid ISO 8601 date string."
      };
    }

    // Validate duration
    if (entryData.duration <= 0) {
      return {
        success: false,
        error: "Duration must be greater than 0 seconds."
      };
    }

    const result = await insertTimeEntry(entryData);
    
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    console.error("Desktop API: Upload failed:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred"
    };
  }
};

// Test connection function
export const testConnection = async (): Promise<ApiResponse<boolean>> => {
  try {
    const isConnected = await testDesktopConnection();
    return {
      success: true,
      data: isConnected
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Connection test failed"
    };
  }
};

// Utility to get user ID from email (for desktop apps that only have email)
export const getUserIdFromEmail = async (email: string): Promise<ApiResponse<string>> => {
  try {
    const { desktopSupabase } = await import('./desktop-client');
    
    const { data, error } = await desktopSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      return {
        success: false,
        error: `User not found with email: ${email}`
      };
    }

    return {
      success: true,
      data: data.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get user ID"
    };
  }
};
