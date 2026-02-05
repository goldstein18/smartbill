
import React, { useState } from "react";
import { useSupabaseAppContext } from "@/context/SupabaseAppProvider";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { TimeAnalyticsChart } from "@/components/analytics/TimeAnalyticsChart";
import { ClientAnalyticsChart } from "@/components/analytics/ClientAnalyticsChart";
import { AnalyticsDateFilter } from "@/components/analytics/AnalyticsDateFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, TrendingUp } from "lucide-react";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";

const AnalyticsPage: React.FC = () => {
  const { timeEntries, clients } = useSupabaseAppContext();
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date())
  });

  // Filter entries by date range
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= dateRange.from && entryDate <= dateRange.to;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">
            {t('analytics.overview')}
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
        clients={clients} 
      />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              {t('analytics.timeTrends')}
            </CardTitle>
            <CardDescription>
              {t('analytics.dailyTimeTracking')}
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
              {t('analytics.clientDistribution')}
            </CardTitle>
            <CardDescription>
              {t('analytics.clientDistribution')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientAnalyticsChart 
              timeEntries={filteredEntries}
              clients={clients}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
