
import React, { useState } from "react";
import { useSupabaseAppContext } from "@/context/SupabaseAppProvider";
import { mergeTimeEntries, groupEntriesByDate, getSortedDates, sortEntriesByDate } from "@/utils/mergeEntries";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Index: React.FC = () => {
  const { timeEntries, clients, stats, assignClientToEntry } = useSupabaseAppContext();
  const [showMerged, setShowMerged] = useState<boolean>(true);

  // Process entries based on merge toggle state
  const processedEntries = showMerged ? mergeTimeEntries(timeEntries) : timeEntries;
  
  // Group time entries by date
  const entriesByDate = groupEntriesByDate(processedEntries);

  // Sort entries within each date in chronological order (ascending by timestamp)
  const sortedEntriesByDate = sortEntriesByDate(entriesByDate);
  
  // Sort dates in descending order (most recent first)
  const sortedDates = getSortedDates(entriesByDate);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const calculateBill = (duration: number, clientId?: string) => {
    if (!clientId) return "-";
    const client = clients.find(c => c.id === clientId);
    if (!client) return "-";
    
    const hours = duration / 3600;
    const amount = hours * client.hourlyRate;
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Activities and Clients Tabs */}
      <DashboardTabs
        sortedDates={sortedDates}
        sortedEntriesByDate={sortedEntriesByDate}
        clients={clients}
        stats={stats}
        assignClientToEntry={assignClientToEntry}
        formatDuration={formatDuration}
        calculateBill={calculateBill}
        showMerged={showMerged}
        setShowMerged={setShowMerged}
      />
    </div>
  );
};

export default Index;
