
import { TimeEntry } from "@/types";
import { isSameDay } from "date-fns";

/**
 * Merges time entries with the same window title that occur within the same day
 */
export const mergeTimeEntries = (entries: TimeEntry[]): TimeEntry[] => {
  if (!entries.length) return [];
  
  // Clone and sort entries by timestamp (ascending)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Group entries by date and window title
  const entriesByDateAndTitle: Record<string, TimeEntry[]> = {};
  
  // Process each entry
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    const key = `${entryDate}|${entry.application}|${entry.windowTitle.trim()}`;
    
    if (!entriesByDateAndTitle[key]) {
      entriesByDateAndTitle[key] = [];
    }
    
    entriesByDateAndTitle[key].push(entry);
  }
  
  // Merged entries map to track which original entries are part of which merged entry
  const mergedEntriesMap: Record<string, string[]> = {};
  
  // Merge groups into single entries
  const result: TimeEntry[] = [];
  
  for (const key in entriesByDateAndTitle) {
    const group = entriesByDateAndTitle[key];
    if (group.length > 1) {
      // Create a merged entry from the group
      const mergedEntry = mergeGroup(group);
      
      // Store the mapping of merged entry ID to original entry IDs
      mergedEntriesMap[mergedEntry.id] = group.map(entry => entry.id);
      
      result.push(mergedEntry);
    } else {
      result.push(group[0]);
    }
  }
  
  // Sort results by timestamp (descending for display)
  result.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return result;
};

/**
 * Merges a group of entries into a single entry
 */
const mergeGroup = (entries: TimeEntry[]): TimeEntry => {
  if (entries.length === 1) return entries[0];
  
  // Use the first entry as the base
  const firstEntry = entries[0];
  const lastEntry = entries[entries.length - 1];
  
  // Sum the durations
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
  
  // Calculate time span in readable format
  const firstTime = new Date(firstEntry.timestamp).getTime();
  const lastTime = new Date(lastEntry.timestamp).getTime();
  const timeSpanMinutes = Math.round((lastTime - firstTime) / (1000 * 60));
  
  // Check if all entries have the same client ID
  const nonEmptyClientIds = entries
    .map(e => e.clientId)
    .filter((id): id is string => id !== undefined && id !== null);
  
  const uniqueClientIds = Array.from(new Set(nonEmptyClientIds));
  
  let clientId = undefined;
  if (uniqueClientIds.length === 1) {
    // If all assigned entries have the same client ID, use it
    clientId = uniqueClientIds[0];
  } else if (nonEmptyClientIds.length > 0) {
    // Use most common client ID if there are multiple
    const clientIdCounts: Record<string, number> = {};
    nonEmptyClientIds.forEach(id => {
      clientIdCounts[id] = (clientIdCounts[id] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostCommonClientId = undefined;
    
    for (const [id, count] of Object.entries(clientIdCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonClientId = id;
      }
    }
    
    clientId = mostCommonClientId;
  }
  
  // Store the IDs of all original entries
  const mergedIds = entries.map(entry => entry.id);
  
  // Create a merged entry that preserves original ID and start time
  const mergedEntry: TimeEntry = {
    ...firstEntry,
    duration: totalDuration,
    clientId: clientId,
    merged: true,
    mergedCount: entries.length,
    mergedIds: mergedIds,
    startTime: firstEntry.timestamp,
    endTime: lastEntry.timestamp,
    notes: entries.some(e => e.notes) 
      ? entries.filter(e => e.notes).map(e => e.notes).join(' | ') 
      : firstEntry.notes
  };
  
  console.log(`Created merged entry with ${mergedIds.length} original entries. Client: ${clientId || 'none'}`);
  
  return mergedEntry;
};

/**
 * Groups entries by date in format YYYY-MM-DD
 */
export const groupEntriesByDate = (
  entries: TimeEntry[]
): Record<string, TimeEntry[]> => {
  return entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);
};

/**
 * Sorts entries within each date in chronological order (ascending by timestamp)
 */
export const sortEntriesByDate = (
  entriesByDate: Record<string, TimeEntry[]>
): Record<string, TimeEntry[]> => {
  const result = { ...entriesByDate };
  Object.keys(result).forEach(date => {
    result[date] = [...result[date]].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });
  return result;
};

/**
 * Gets dates sorted in descending order (most recent first)
 */
export const getSortedDates = (entriesByDate: Record<string, TimeEntry[]>): string[] => {
  return Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
};
