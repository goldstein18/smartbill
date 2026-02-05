
import { Client, DashboardStats, TimeEntry } from "@/types";
import { mergeTimeEntries } from "@/utils/mergeEntries";

export const calculateStats = (timeEntries: TimeEntry[], clients: Client[]): DashboardStats => {
  try {
    // Safety check if timeEntries or clients aren't loaded yet
    if (!timeEntries || !clients) {
      return {
        totalHours: 0,
        billableHours: 0,
        clientDistribution: [],
        unbilledAmount: 0
      };
    }

    // First merge entries to get an accurate representation of time
    const mergedEntries = mergeTimeEntries(timeEntries);

    const totalSec = mergedEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const billableSec = mergedEntries
      .filter(e => e.clientId)
      .reduce((sum, e) => sum + (e.duration || 0), 0);

    const byClient: Record<string, number> = {};
    mergedEntries.forEach(e => {
      if (e.clientId) {
        byClient[e.clientId] = (byClient[e.clientId] || 0) + (e.duration || 0);
      }
    });

    const clientDistribution = Object.entries(byClient)
      .map(([clientId, seconds]) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) {
          return {
            clientId,
            clientName: "Unknown Client",
            hours: seconds / 3600,
            amount: 0
          };
        }
        const hours = seconds / 3600;
        return {
          clientId,
          clientName: client.name,
          hours,
          amount: hours * client.hourlyRate
        };
      });

    // Calculate unbilled amount from non-client entries
    const unbilledSeconds = mergedEntries
      .filter(e => !e.clientId)
      .reduce((sum, e) => sum + (e.duration || 0), 0);
    const unbilledHours = unbilledSeconds / 3600;
    const averageRate = clients.length > 0 
      ? clients.reduce((sum, c) => sum + c.hourlyRate, 0) / clients.length 
      : 0;
    const unbilledAmount = unbilledHours * averageRate;

    const stats = {
      totalHours: totalSec / 3600,
      billableHours: billableSec / 3600,
      clientDistribution,
      unbilledAmount
    };
    
    console.log("Stats updated:", {
      totalHours: totalSec / 3600,
      billableHours: billableSec / 3600,
      totalBillable: clientDistribution.reduce((sum, client) => sum + client.amount, 0),
      unbilledAmount
    });
    
    return stats;
  } catch (error) {
    console.error("Error calculating stats:", error);
    // Set default stats if calculation fails
    return {
      totalHours: 0,
      billableHours: 0,
      clientDistribution: [],
      unbilledAmount: 0
    };
  }
};
