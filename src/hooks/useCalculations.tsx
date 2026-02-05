
import { useMemo } from "react";
import { TimeEntry, Client, DashboardStats } from "@/types";
import { calculateStats } from "@/context/statsCalculations";

export const useCalculations = (timeEntries: TimeEntry[], clients: Client[]) => {
  const stats = useMemo(() => {
    return calculateStats(timeEntries, clients);
  }, [timeEntries, clients]);

  const calculateTotalBill = (entries: TimeEntry[], clientId?: string) => {
    const relevantEntries = clientId 
      ? entries.filter(entry => entry.clientId === clientId)
      : entries.filter(entry => entry.clientId);

    return relevantEntries.reduce((total, entry) => {
      const client = clients.find(c => c.id === entry.clientId);
      if (!client) return total;
      
      const hours = entry.duration / 3600;
      return total + (hours * client.hourlyRate);
    }, 0);
  };

  return {
    stats,
    calculateTotalBill,
  };
};
