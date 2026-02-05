import { useState, useEffect } from "react";
import { TimeEntry } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Configurable minimum duration filter (in seconds)
const MIN_DURATION_SECONDS = 30;

export const useTimeEntries = (user: User | null) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  // Helper function to check if entry meets duration requirement
  const meetsMinimumDuration = (duration: number): boolean => {
    return duration >= MIN_DURATION_SECONDS;
  };

  // Load time entries from Supabase
  useEffect(() => {
    if (!user) return;

    const loadTimeEntries = async () => {
      try {
        console.log("Loading time entries for user:", user.id);
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('duration', MIN_DURATION_SECONDS) // Filter entries >= minimum duration
          .order('timestamp', { ascending: false });

        if (error) {
          console.error("Error loading time entries:", error);
          return;
        }

        const entries: TimeEntry[] = data.map(entry => ({
          id: entry.id,
          timestamp: entry.timestamp,
          application: entry.application,
          windowTitle: entry.window_title,
          duration: entry.duration,
          clientId: entry.client_id || undefined,
          notes: entry.notes || "",
          is_billable: entry.is_billable ?? true,
        }));

        console.log("Loaded time entries:", entries.length);
        setTimeEntries(entries);
      } catch (error) {
        console.error("Error loading time entries:", error);
      }
    };

    loadTimeEntries();

    // Set up improved real-time subscription with consistent filtering
    console.log("Setting up real-time subscription for time_entries");
    const timeEntriesSubscription = supabase
      .channel('time_entries_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events for debugging
          schema: 'public',
          table: 'time_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log("Real-time event received:", payload.eventType, payload);
          
          if (payload.eventType === 'UPDATE') {
            console.log("Processing UPDATE event for entry:", payload.new.id);
            // Apply duration filter to updates
            if (!meetsMinimumDuration(payload.new.duration)) {
              console.log("Updated entry doesn't meet minimum duration, removing from state");
              setTimeEntries(prev => prev.filter(entry => entry.id !== payload.new.id));
              return;
            }
            
            // Handle optimistic update confirmation or correction
            setTimeEntries(prev => 
              prev.map(entry => 
                entry.id === payload.new.id 
                  ? {
                      ...entry,
                      clientId: payload.new.client_id || undefined,
                      notes: payload.new.notes || "",
                      is_billable: payload.new.is_billable ?? true,
                      // Update other fields that might have changed
                      timestamp: payload.new.timestamp,
                      application: payload.new.application,
                      windowTitle: payload.new.window_title,
                      duration: payload.new.duration,
                    }
                  : entry
              )
            );
          } else if (payload.eventType === 'INSERT') {
            console.log("Processing INSERT event for new entry:", payload.new.id);
            
            // Apply duration filter to new entries
            if (!meetsMinimumDuration(payload.new.duration)) {
              console.log("New entry doesn't meet minimum duration, skipping insert");
              return;
            }
            
            const newEntry: TimeEntry = {
              id: payload.new.id,
              timestamp: payload.new.timestamp,
              application: payload.new.application,
              windowTitle: payload.new.window_title,
              duration: payload.new.duration,
              clientId: payload.new.client_id || undefined,
              notes: payload.new.notes || "",
              is_billable: payload.new.is_billable ?? true,
            };
            
            setTimeEntries(prev => {
              // Check if entry already exists (avoid duplicates)
              const exists = prev.some(entry => entry.id === newEntry.id);
              if (exists) {
                console.log("Entry already exists, skipping insert");
                return prev;
              }
              console.log("Adding new entry to state");
              return [newEntry, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            console.log("Processing DELETE event for entry:", payload.old.id);
            setTimeEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(timeEntriesSubscription);
    };
  }, [user]);

  const addTimeEntry = async (entry: Omit<TimeEntry, "id">): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          timestamp: entry.timestamp,
          application: entry.application,
          window_title: entry.windowTitle,
          duration: entry.duration,
          client_id: entry.clientId || null,
          notes: entry.notes || null,
          is_billable: entry.is_billable ?? true
        });

      if (error) {
        console.error("Error adding time entry:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error adding time entry:", error);
      return false;
    }
  };

  const updateTimeEntry = async (entry: TimeEntry): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('time_entries')
        .update({
          timestamp: entry.timestamp,
          application: entry.application,
          window_title: entry.windowTitle,
          duration: entry.duration,
          client_id: entry.clientId || null,
          notes: entry.notes || null,
          is_billable: entry.is_billable ?? true
        })
        .eq('id', entry.id)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error updating time entry:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating time entry:", error);
      return false;
    }
  };

  const deleteTimeEntry = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error deleting time entry:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting time entry:", error);
      return false;
    }
  };

  const assignClientToEntry = async (entryId: string, clientId: string): Promise<boolean> => {
    if (!user) {
      console.error("No user found for client assignment");
      return false;
    }

    console.log("Starting client assignment:", { entryId, clientId });

    // Optimistic update - immediately update local state
    const originalEntry = timeEntries.find(entry => entry.id === entryId);
    if (!originalEntry) {
      console.error("Entry not found for optimistic update:", entryId);
      return false;
    }

    console.log("Applying optimistic update for entry:", entryId);
    const finalClientId = clientId === 'unassigned' ? undefined : clientId;
    
    // Update local state immediately for instant UI feedback
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, clientId: finalClientId }
          : entry
      )
    );

    try {
      const supabaseClientId = clientId === 'unassigned' ? null : clientId;
      
      console.log("Sending database update:", { entryId, supabaseClientId });
      const { error } = await supabase
        .from('time_entries')
        .update({ client_id: supabaseClientId })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) {
        console.error("Database update failed, reverting optimistic update:", error);
        // Revert optimistic update on failure
        setTimeEntries(prev => 
          prev.map(entry => 
            entry.id === entryId 
              ? { ...entry, clientId: originalEntry.clientId }
              : entry
          )
        );
        return false;
      }

      console.log("Database update successful");
      
      // Fallback mechanism: If real-time doesn't update within 2 seconds, manually refresh
      setTimeout(async () => {
        try {
          console.log("Fallback check: Verifying entry was updated");
          const { data: verifyData, error: verifyError } = await supabase
            .from('time_entries')
            .select('client_id')
            .eq('id', entryId)
            .single();

          if (!verifyError && verifyData) {
            const dbClientId = verifyData.client_id || undefined;
            console.log("Fallback verification result:", { dbClientId, expectedClientId: finalClientId });
            
            // Only update if there's a mismatch (real-time didn't work)
            setTimeEntries(prev => {
              const currentEntry = prev.find(e => e.id === entryId);
              if (currentEntry && currentEntry.clientId !== dbClientId) {
                console.log("Fallback: Correcting local state from database");
                return prev.map(entry => 
                  entry.id === entryId 
                    ? { ...entry, clientId: dbClientId }
                    : entry
                );
              }
              return prev;
            });
          }
        } catch (fallbackError) {
          console.error("Fallback verification failed:", fallbackError);
        }
      }, 2000);

      return true;
    } catch (error) {
      console.error("Error assigning client to entry:", error);
      // Revert optimistic update on error
      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, clientId: originalEntry.clientId }
            : entry
        )
      );
      return false;
    }
  };

  const toggleBillableStatus = async (entryId: string): Promise<boolean> => {
    if (!user) {
      console.error("No user found for billable status toggle");
      return false;
    }

    console.log("Toggling billable status for entry:", entryId);

    // Find the entry and get current billable status
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry) {
      console.error("Entry not found for billable toggle:", entryId);
      return false;
    }

    const newBillableStatus = !entry.is_billable;
    
    // Optimistic update - immediately update local state
    setTimeEntries(prev => 
      prev.map(e => 
        e.id === entryId 
          ? { ...e, is_billable: newBillableStatus }
          : e
      )
    );

    try {
      const { error } = await supabase
        .from('time_entries')
        .update({ is_billable: newBillableStatus })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) {
        console.error("Database update failed, reverting optimistic update:", error);
        // Revert optimistic update on failure
        setTimeEntries(prev => 
          prev.map(e => 
            e.id === entryId 
              ? { ...e, is_billable: entry.is_billable }
              : e
          )
        );
        return false;
      }

      console.log("Billable status updated successfully");
      return true;
    } catch (error) {
      console.error("Error toggling billable status:", error);
      // Revert optimistic update on error
      setTimeEntries(prev => 
        prev.map(e => 
          e.id === entryId 
            ? { ...e, is_billable: entry.is_billable }
            : e
        )
      );
      return false;
    }
  };

  return {
    timeEntries,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    assignClientToEntry,
    toggleBillableStatus,
  };
};
