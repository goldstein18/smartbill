
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { Client, TimeEntry } from "@/types";
import { useEnhancedInvoiceGeneration } from "@/hooks/useEnhancedInvoiceGeneration";
import { useInvoiceGeneration } from "@/hooks/useInvoiceGeneration";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EnhancedInvoiceGenerationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  timeEntries: TimeEntry[];
  onInvoiceCreated?: (invoiceId: string) => void;
}

export const EnhancedInvoiceGenerationDialog: React.FC<EnhancedInvoiceGenerationDialogProps> = ({
  isOpen,
  onOpenChange,
  clients,
  timeEntries,
  onInvoiceCreated,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const { generateInvoiceWithTracking, isGenerating: isGeneratingDB } = useEnhancedInvoiceGeneration();
  const { generateInvoice, isGenerating: isGeneratingPDF } = useInvoiceGeneration();

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientEntries = timeEntries.filter(entry => entry.clientId === selectedClientId);
  const totalHours = clientEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
  const totalAmount = selectedClient ? totalHours * selectedClient.hourlyRate : 0;

  const isGenerating = isGeneratingDB || isGeneratingPDF;

  const handleGenerate = async () => {
    if (!selectedClient) return;

    const finalInvoiceNumber = invoiceNumber || `INV-${Date.now()}`;

    try {
      // First, save the invoice to the database
      const invoiceId = await generateInvoiceWithTracking(
        selectedClient,
        timeEntries,
        finalInvoiceNumber,
        dueDate
      );
      
      if (invoiceId) {
        // Then generate and download the PDF
        await generateInvoice(
          selectedClient,
          timeEntries,
          finalInvoiceNumber,
          dueDate
        );
        
        onInvoiceCreated?.(invoiceId);
        onOpenChange(false);
        
        // Reset form
        setSelectedClientId("");
        setInvoiceNumber("");
        setDueDate(undefined);
        
        toast.success("Invoice created, saved, and PDF downloaded successfully!");
      }
    } catch (error) {
      console.error('Error in invoice generation process:', error);
      toast.error("Failed to complete invoice generation");
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setInvoiceNumber(`INV-${timestamp}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Invoice
          </DialogTitle>
          <DialogDescription>
            Create a new invoice with tracking and PDF download capabilities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-select">Select Client *</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="client-select">
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.filter(client => {
                  // Only show clients that have time entries
                  return timeEntries.some(entry => entry.clientId === client.id);
                }).map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: client.color }} 
                      />
                      {client.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <div className="flex gap-2">
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Leave blank for auto-generation"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateInvoiceNumber}
              >
                Auto
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {selectedClient && (
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Hours:</span>
                <span className="font-medium">{totalHours.toFixed(2)}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hourly Rate:</span>
                <span className="font-medium">${selectedClient.hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-1">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {clientEntries.length} time entries
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!selectedClientId || isGenerating}
          >
            {isGenerating ? "Creating..." : "Create & Download Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
