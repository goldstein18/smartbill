
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface AnalyticsDateFilterProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export const AnalyticsDateFilter: React.FC<AnalyticsDateFilterProps> = ({
  dateRange,
  onDateRangeChange
}) => {
  const quickRanges = [
    {
      label: "Last 7 days",
      range: {
        from: startOfDay(subDays(new Date(), 7)),
        to: endOfDay(new Date())
      }
    },
    {
      label: "Last 30 days",
      range: {
        from: startOfDay(subDays(new Date(), 30)),
        to: endOfDay(new Date())
      }
    },
    {
      label: "Last 90 days",
      range: {
        from: startOfDay(subDays(new Date(), 90)),
        to: endOfDay(new Date())
      }
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Quick range buttons */}
      <div className="hidden sm:flex gap-2">
        {quickRanges.map(({ label, range }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => onDateRangeChange(range)}
            className={cn(
              "text-xs",
              dateRange.from.getTime() === range.from.getTime() &&
              dateRange.to.getTime() === range.to.getTime() &&
              "bg-primary text-primary-foreground"
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Custom date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange({
                  from: startOfDay(range.from),
                  to: endOfDay(range.to)
                });
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
