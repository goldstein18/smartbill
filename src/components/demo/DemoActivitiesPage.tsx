
import React, { useState, useMemo } from "react";
import { isSameDay } from "date-fns";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { useDemo } from "@/context/DemoContext";
import { mergeTimeEntries } from "@/utils/mergeEntries";
import { TimeEntry } from "@/types";
import { ActivitiesHeader } from "@/components/activities/ActivitiesHeader";
import { ActivitiesTable } from "@/components/activities/ActivitiesTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const ActivitiesPage: React.FC = () => {
  const { demoTimeEntries, demoClients } = useDemo();
  
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedApp, setSelectedApp] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showMerged, setShowMerged] = useState<boolean>(true);

  // Applications array
  const applications = useMemo(() => {
    const appSet = new Set<string>();
    demoTimeEntries.forEach(entry => {
      if (entry.application) {
        appSet.add(entry.application);
      }
    });
    return Array.from(appSet);
  }, [demoTimeEntries]);

  // Filter and process entries
  const filteredEntries = useMemo(() => {
    return demoTimeEntries.filter(entry => {
      const matchesClient = selectedClient === "all" || entry.clientId === selectedClient;
      const matchesApp = selectedApp === "all" || entry.application === selectedApp;
      const matchesDate = !selectedDate || isSameDay(new Date(entry.timestamp), selectedDate);
      return matchesClient && matchesApp && matchesDate;
    });
  }, [demoTimeEntries, selectedClient, selectedApp, selectedDate]);

  const processedEntries = useMemo(() => {
    return showMerged ? mergeTimeEntries(filteredEntries) : filteredEntries;
  }, [filteredEntries, showMerged]);

  const entriesByDate = useMemo(() => {
    return processedEntries.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {} as Record<string, typeof processedEntries>);
  }, [processedEntries]);

  const sortedEntriesByDate = useMemo(() => {
    const result = { ...entriesByDate };
    Object.keys(result).forEach(date => {
      result[date] = [...result[date]].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    return result;
  }, [entriesByDate]);

  const sortedDates = useMemo(() => {
    return Object.keys(entriesByDate).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [entriesByDate]);

  // Utility functions
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateBill = (duration: number, clientId?: string) => {
    if (!clientId) return "-";
    const client = demoClients.find(c => c.id === clientId);
    if (!client) return "-";
    
    const hours = duration / 3600;
    const amount = hours * client.hourlyRate;
    return `$${amount.toFixed(2)}`;
  };

  // Demo handlers (no-op)
  const handleEdit = () => {};
  const handleNoteUpdate = () => {};
  const handleDelete = () => {};
  const handleClientAssignment = () => {};
  const handleBillableToggle = () => {};
  const handleExport = () => {};

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This is a read-only view of the Activities page with sample data. 
          All edit functions are disabled.
        </AlertDescription>
      </Alert>

      <ActivitiesHeader 
        showMerged={showMerged} 
        onToggleMerge={setShowMerged} 
      />
      
      <ActivityFilters 
        clients={demoClients}
        applications={applications}
        selectedClient={selectedClient}
        selectedApp={selectedApp}
        selectedDate={selectedDate}
        onClientChange={setSelectedClient}
        onAppChange={setSelectedApp}
        onDateChange={setSelectedDate}
        onExport={handleExport}
      />
      
      <div id="activities-content">
        <ActivitiesTable
          entriesByDate={sortedEntriesByDate}
          sortedDates={sortedDates}
          clients={demoClients}
          onEdit={handleEdit}
          onNoteUpdate={handleNoteUpdate}
          onDelete={handleDelete}
          onClientAssignment={handleClientAssignment}
          onBillableToggle={handleBillableToggle}
          formatDuration={formatDuration}
          calculateBill={calculateBill}
        />
      </div>
    </div>
  );
};
