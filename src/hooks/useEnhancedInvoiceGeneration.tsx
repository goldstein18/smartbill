
import { useState } from "react";
import { Client, TimeEntry } from "@/types";
import { InvoiceWithDetails } from "@/types/invoice";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { useInvoices } from "./useInvoices";
import { toast } from "sonner";
import { format } from "date-fns";

export const useEnhancedInvoiceGeneration = () => {
  const { user } = useSupabaseAuth();
  const { createInvoice } = useInvoices(user);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoiceWithTracking = async (
    client: Client,
    timeEntries: TimeEntry[],
    invoiceNumber?: string,
    dueDate?: Date
  ): Promise<string | null> => {
    if (!user) {
      toast.error("User not authenticated");
      return null;
    }

    setIsGenerating(true);
    try {
      // Filter entries for this client
      const clientEntries = timeEntries.filter(entry => entry.clientId === client.id);
      
      if (clientEntries.length === 0) {
        toast.error("No time entries found for this client");
        return null;
      }

      // Calculate totals
      const totalHours = clientEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
      const totalAmount = totalHours * client.hourlyRate;

      // Prepare invoice items
      const invoiceItems = clientEntries.map(entry => {
        const hours = entry.duration / 3600;
        const amount = hours * client.hourlyRate;
        
        return {
          time_entry_id: entry.id,
          description: `${entry.application} - ${entry.windowTitle}`,
          hours,
          rate: client.hourlyRate,
          amount,
          date: format(new Date(entry.timestamp), 'yyyy-MM-dd'),
        };
      });

      // Create invoice in database
      const invoiceId = await createInvoice({
        client_id: client.id,
        invoice_number: invoiceNumber || `INV-${Date.now()}`,
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
        total_amount: totalAmount,
        total_hours: totalHours,
        items: invoiceItems,
      });

      if (!invoiceId) {
        throw new Error("Failed to create invoice");
      }

      toast.success("Invoice created and saved successfully!");
      return invoiceId;

    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error("Failed to generate invoice");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { 
    generateInvoiceWithTracking, 
    isGenerating 
  };
};
