
import { TimeEntry } from "@/types";
import { format } from "date-fns";

// Add these types to extend the existing TimeEntry type
declare module "@/types" {
  interface TimeEntry {
    merged?: boolean;
    mergedCount?: number;
    mergedIds?: string[];  // Add this property to track original entry IDs
    startTime?: string;    // Start time for merged entries
    endTime?: string;      // End time for merged entries
  }
}

// Helper function to get display text for merged entries
export const getMergedEntryText = (entry: TimeEntry): string => {
  if (entry.merged && entry.mergedCount && entry.mergedCount > 1) {
    const timeSpan = entry.mergedCount > 1 
      ? `${entry.mergedCount} entries merged` 
      : "1 entry";
      
    // Indicate client status if assigned
    const clientStatus = entry.clientId ? " (billable)" : "";
    
    return `${entry.windowTitle} (${timeSpan}${clientStatus})`;
  }
  return entry.windowTitle;
};

// Helper function to format time range for merged entries
export const formatTimeRange = (entry: TimeEntry): string => {
  if (entry.merged && entry.startTime && entry.endTime && entry.mergedCount && entry.mergedCount > 1) {
    const startTime = format(new Date(entry.startTime), "h:mm a");
    const endTime = format(new Date(entry.endTime), "h:mm a");
    
    // If start and end times are the same, just show single time
    if (startTime === endTime) {
      return startTime;
    }
    
    return `${startTime} - ${endTime}`;
  }
  
  // For non-merged entries, show single time
  return format(new Date(entry.timestamp), "h:mm a");
};
