
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TimeEntry, Client } from "@/types";

interface ClientAnalyticsChartProps {
  timeEntries: TimeEntry[];
  clients: Client[];
}

export const ClientAnalyticsChart: React.FC<ClientAnalyticsChartProps> = ({
  timeEntries,
  clients
}) => {
  // Group entries by client and calculate hours
  const clientHours = timeEntries.reduce((acc, entry) => {
    const clientId = entry.clientId || 'unassigned';
    acc[clientId] = (acc[clientId] || 0) + entry.duration / 3600;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data
  const chartData = Object.entries(clientHours).map(([clientId, hours]) => {
    const client = clientId === 'unassigned' 
      ? { name: 'Unassigned', color: '#6B7280' }
      : clients.find(c => c.id === clientId);
    
    return {
      name: client?.name || 'Unknown Client',
      hours: Math.round(hours * 10) / 10,
      color: client?.color || '#6B7280'
    };
  }).sort((a, b) => b.hours - a.hours);

  const chartConfig = chartData.reduce((config, item, index) => {
    config[item.name] = {
      label: item.name,
      color: item.color,
    };
    return config;
  }, {} as any);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="hours"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value, name) => [`${value}h`, name]}
          />
          <Legend 
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
