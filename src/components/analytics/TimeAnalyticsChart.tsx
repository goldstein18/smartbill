
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TimeEntry } from "@/types";
import { format, eachDayOfInterval, startOfDay } from "date-fns";

interface TimeAnalyticsChartProps {
  timeEntries: TimeEntry[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const TimeAnalyticsChart: React.FC<TimeAnalyticsChartProps> = ({
  timeEntries,
  dateRange
}) => {
  // Generate all days in the range
  const allDays = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to
  });

  // Group entries by day and calculate total hours
  const chartData = allDays.map(day => {
    const dayStart = startOfDay(day);
    const dayEntries = timeEntries.filter(entry => {
      const entryDay = startOfDay(new Date(entry.timestamp));
      return entryDay.getTime() === dayStart.getTime();
    });

    const totalHours = dayEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;

    return {
      date: format(day, "MMM dd"),
      hours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
      fullDate: day
    };
  });

  const chartConfig = {
    hours: {
      label: "Hours",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}h`}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />} 
            formatter={(value) => [`${value}h`, "Hours"]}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return format(payload[0].payload.fullDate, "EEEE, MMMM do");
              }
              return label;
            }}
          />
          <Bar 
            dataKey="hours" 
            fill="var(--color-hours)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
