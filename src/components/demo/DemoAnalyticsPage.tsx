
import React, { useState } from "react";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { TimeAnalyticsChart } from "@/components/analytics/TimeAnalyticsChart";
import { ClientAnalyticsChart } from "@/components/analytics/ClientAnalyticsChart";
import { AnalyticsDateFilter } from "@/components/analytics/AnalyticsDateFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, PieChart, Info } from "lucide-react";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { useDemo } from "@/context/DemoContext";

export const AnalyticsPage: React.FC = () => {
  const { demoTimeEntries, demoClients } = useDemo();
  const [dateRange, setDateRange] = useState({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date())
  });

  // Filter entries by date range
  const filteredEntries = demoTimeEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= dateRange.from && entryDate <= dateRange.to;
  });

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This is a read-only view of the Analytics page with sample data.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your time tracking and productivity
          </p>
        </div>
        <AnalyticsDateFilter 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
      </div>

      {/* Overview Cards */}
      <AnalyticsOverview 
        timeEntries={filteredEntries} 
        clients={demoClients} 
      />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Time Trends
            </CardTitle>
            <CardDescription>
              Daily time tracking patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimeAnalyticsChart 
              timeEntries={filteredEntries}
              dateRange={dateRange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Client Distribution
            </CardTitle>
            <CardDescription>
              Time distribution across clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientAnalyticsChart 
              timeEntries={filteredEntries}
              clients={demoClients}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
