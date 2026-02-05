import React, { useState, useMemo } from "react";
import { isSameDay } from "date-fns";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { useSupabaseAppContext } from "@/context/SupabaseAppProvider";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { mergeTimeEntries } from "@/utils/mergeEntries";
import { toast } from "sonner";
import { TimeEntry } from "@/types";

// Import new components
import { ActivitiesHeader } from "@/components/activities/ActivitiesHeader";
import { ActivitiesTable } from "@/components/activities/ActivitiesTable";
import { EditEntryDialog } from "@/components/activities/EditEntryDialog";
import { DeleteConfirmDialog } from "@/components/activities/DeleteConfirmDialog";

const ActivitiesPage: React.FC = () => {
  const { 
    timeEntries, 
    clients, 
    updateTimeEntry, 
    deleteTimeEntry,
    assignClientToEntry,
    toggleBillableStatus
  } = useSupabaseAppContext();
  
  console.log("Clients in ActivitiesPage:", clients); // Debug log
  console.log("Time entries in ActivitiesPage:", timeEntries); // Debug log
  
  // Add back all the missing state variables
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedApp, setSelectedApp] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showMerged, setShowMerged] = useState<boolean>(true);

  // Applications array
  const applications = useMemo(() => {
    const appSet = new Set<string>();
    timeEntries.forEach(entry => {
      if (entry.application) {
        appSet.add(entry.application);
      }
    });
    return Array.from(appSet);
  }, [timeEntries]);

  // Filter and process entries
  const filteredEntries = useMemo(() => {
    return timeEntries.filter(entry => {
      const matchesClient = selectedClient === "all" || entry.clientId === selectedClient;
      const matchesApp = selectedApp === "all" || entry.application === selectedApp;
      const matchesDate = !selectedDate || isSameDay(new Date(entry.timestamp), selectedDate);
      return matchesClient && matchesApp && matchesDate;
    });
  }, [timeEntries, selectedClient, selectedApp, selectedDate]);

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
    const client = clients.find(c => c.id === clientId);
    if (!client) return "-";
    
    const hours = duration / 3600;
    const amount = hours * client.hourlyRate;
    return `$${amount.toFixed(2)}`;
  };

  const handleExport = async () => {
    const element = document.getElementById('activities-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('activities.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Event handlers
  const handleOpenEditDialog = (entry: TimeEntry) => {
    setEditingEntry({ ...entry });
    setIsDialogOpen(true);
  };

  const handleSaveEntry = async () => {
    if (editingEntry) {
      try {
        await updateTimeEntry(editingEntry);
        toast.success("Time entry updated successfully");
        setIsDialogOpen(false);
        setEditingEntry(null);
      } catch (error) {
        console.error('Error updating entry:', error);
        toast.error("Failed to update time entry");
      }
    }
  };

  // New handler for direct note updates without opening dialog
  const handleNoteUpdate = async (entry: TimeEntry) => {
    try {
      await updateTimeEntry(entry);
      toast.success("Note updated successfully");
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (entryToDelete) {
      try {
        await deleteTimeEntry(entryToDelete);
        toast.success("Time entry deleted successfully");
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast.error("Failed to delete time entry");
      }
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleClientAssignment = async (entryId: string, value: string) => {
    console.log("Assigning client:", { entryId, value, availableClients: clients }); // Debug log
    try {
      await assignClientToEntry(entryId, value);
      toast.success("Client assigned successfully");
    } catch (error) {
      console.error('Error assigning client:', error);
      toast.error("Failed to assign client");
    }
  };

  const handleBillableToggle = async (entryId: string) => {
    try {
      await toggleBillableStatus(entryId);
      // Toast is handled by the BillableToggle component
    } catch (error) {
      console.error('Error toggling billable status:', error);
      toast.error("Failed to update billable status");
    }
  };

  return (
    <div className="space-y-6">
      <ActivitiesHeader 
        showMerged={showMerged} 
        onToggleMerge={setShowMerged} 
      />
      
      <ActivityFilters 
        clients={clients}
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
          clients={clients}
          onEdit={handleOpenEditDialog}
          onNoteUpdate={handleNoteUpdate}
          onDelete={handleDeleteClick}
          onClientAssignment={handleClientAssignment}
          onBillableToggle={handleBillableToggle}
          formatDuration={formatDuration}
          calculateBill={calculateBill}
        />
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <EditEntryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEntry={editingEntry}
        onEntryChange={setEditingEntry}
        onSave={handleSaveEntry}
        clients={clients}
      />
    </div>
  );
};

export default ActivitiesPage;
