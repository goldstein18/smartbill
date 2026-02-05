
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Calendar, Users } from "lucide-react";
import { TimeEntry, Client } from "@/types";

interface AnalyticsOverviewProps {
  timeEntries: TimeEntry[];
  clients: Client[];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  timeEntries,
  clients
}) => {
  // Calculate metrics
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
  
  const totalRevenue = timeEntries.reduce((sum, entry) => {
    if (!entry.clientId) return sum;
    const client = clients.find(c => c.id === entry.clientId);
    if (!client) return sum;
    const hours = entry.duration / 3600;
    return sum + (hours * client.hourlyRate);
  }, 0);

  const totalDays = new Set(
    timeEntries.map(entry => new Date(entry.timestamp).toDateString())
  ).size;

  const activeClients = new Set(
    timeEntries.filter(entry => entry.clientId).map(entry => entry.clientId)
  ).size;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatHours(totalHours)}</div>
          <p className="text-xs text-muted-foreground">
            Across {totalDays} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            From billable hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Days</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDays}</div>
          <p className="text-xs text-muted-foreground">
            Days with activity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">
            Clients worked with
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
