
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeEntry, Client } from "@/types";
import { ClientSelect } from "./ClientSelect";

interface EditEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: TimeEntry | null;
  onEntryChange: (entry: TimeEntry) => void;
  onSave: () => void;
  clients: Client[];
}

export const EditEntryDialog: React.FC<EditEntryDialogProps> = ({
  isOpen,
  onOpenChange,
  editingEntry,
  onEntryChange,
  onSave,
  clients,
}) => {
  if (!editingEntry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time Entry</DialogTitle>
          <DialogDescription>
            Make changes to this time entry.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="application" className="text-right text-sm font-medium">
              Application
            </label>
            <Input
              id="application"
              value={editingEntry.application}
              onChange={(e) => onEntryChange({ ...editingEntry, application: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="window-title" className="text-right text-sm font-medium">
              Window Title
            </label>
            <Input
              id="window-title"
              value={editingEntry.windowTitle}
              onChange={(e) => onEntryChange({ ...editingEntry, windowTitle: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="duration" className="text-right text-sm font-medium">
              Duration (sec)
            </label>
            <Input
              id="duration"
              type="number"
              value={editingEntry.duration}
              onChange={(e) => onEntryChange({ 
                ...editingEntry, 
                duration: parseInt(e.target.value) || 0 
              })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="client" className="text-right text-sm font-medium">
              Client
            </label>
            <ClientSelect
              value={editingEntry.clientId || "unassigned"}
              onValueChange={(value) => onEntryChange({ 
                ...editingEntry, 
                clientId: value === "unassigned" ? undefined : value 
              })}
              clients={clients}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              value={editingEntry.notes || ""}
              onChange={(e) => onEntryChange({ ...editingEntry, notes: e.target.value })}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
