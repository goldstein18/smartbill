
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalHours: number;
    billableHours: number;
    clientDistribution: Array<{
      clientId: string;
      clientName: string;
      hours: number;
      amount: number;
    }>;
    unbilledAmount: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground">All tracked time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Billable Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.billableHours.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalHours > 0 
              ? `${((stats.billableHours / stats.totalHours) * 100).toFixed(0)}% of total`
              : "0% of total"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Billable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.clientDistribution.reduce((sum, client) => sum + client.amount, 0).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Across all clients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unbilled Potential</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.unbilledAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Unassigned time</p>
        </CardContent>
      </Card>
    </div>
  );
};
