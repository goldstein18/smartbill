import React, { useState } from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeEntry, Client } from "@/types";
import { getMergedEntryText, formatTimeRange } from "@/types/mergedTypes";
import { ClientSelect } from "./ClientSelect";
import { BillableToggle } from "./BillableToggle";
import { Pencil, Check, X, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ActivityRowProps {
  entry: TimeEntry;
  clients: Client[];
  onEdit: (entry: TimeEntry) => void;
  onNoteUpdate: (entry: TimeEntry) => void;
  onDelete: (entryId: string) => void;
  onClientAssignment: (entryId: string, clientId: string) => void;
  onBillableToggle: (entryId: string) => void;
  formatDuration: (seconds: number) => string;
  calculateBill: (duration: number, clientId?: string) => string;
}

// Helper function to truncate text to first N words
const truncateToWords = (text: string, wordCount: number): string => {
  const words = text.split(' ');
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '...';
};

// Helper function to get condensed merged entry text
const getCondensedMergedText = (entry: TimeEntry): string => {
  if (entry.merged && entry.mergedCount && entry.mergedCount > 1) {
    const titlePreview = truncateToWords(entry.windowTitle, 5);
    return `${titlePreview} (${entry.mergedCount} entries)`;
  }
  return truncateToWords(entry.windowTitle, 5);
};

export const ActivityRow: React.FC<ActivityRowProps> = ({
  entry,
  clients,
  onEdit,
  onNoteUpdate,
  onDelete,
  onClientAssignment,
  onBillableToggle,
  formatDuration,
  calculateBill,
}) => {
  const { t } = useLanguage();
  const client = clients.find(c => c.id === entry.clientId);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(entry.notes || "");
  
  const handleSaveNote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedEntry = { ...entry, notes: noteValue };
    await onNoteUpdate(updatedEntry);
    setIsEditingNote(false);
  };

  const handleCancelNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNoteValue(entry.notes || "");
    setIsEditingNote(false);
  };

  const handleStartEditingNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNoteValue(entry.notes || "");
    setIsEditingNote(true);
  };

  const handleRowClick = () => {
    if (!isEditingNote) {
      onEdit(entry);
    }
  };

  const handleNotesContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  
  const handleBillableToggle = (isBillable: boolean) => {
    onBillableToggle(entry.id);
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={handleRowClick}>
      <TableCell>
        {formatTimeRange(entry)}
      </TableCell>
      <TableCell>{entry.application}</TableCell>
      <TableCell className="max-w-xs truncate-text" title={entry.windowTitle}>
        {getCondensedMergedText(entry)}
      </TableCell>
      <TableCell className="max-w-xs" title={entry.notes || ""}>
        {isEditingNote ? (
          <div className="flex items-center gap-1" onClick={handleNotesContainerClick}>
            <Input
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder={t('common.addNote') + "..."}
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSaveNote(e as any);
                } else if (e.key === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCancelNote(e as any);
                }
              }}
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleSaveNote}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleCancelNote}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1" onClick={handleNotesContainerClick}>
            <span className="truncate-text flex-1">
              {entry.notes ? truncateToWords(entry.notes, 5) : "-"}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
              onClick={handleStartEditingNote}
              title={entry.notes ? t('common.editNote') : t('common.addNote')}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>{formatDuration(entry.duration)}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <ClientSelect
          value={entry.clientId || "unassigned"}
          onValueChange={(value) => onClientAssignment(entry.id, value)}
          clients={clients}
          className="h-8"
        />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <BillableToggle
            isBillable={entry.is_billable ?? true}
            onToggle={handleBillableToggle}
            size="sm"
          />
          <span className={entry.is_billable === false ? "line-through text-muted-foreground" : ""}>
            {calculateBill(entry.duration, entry.clientId)}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96 bg-background border shadow-lg">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('common.time')}</h4>
                  <p className="text-sm">{format(new Date(entry.timestamp), "h:mm a - EEEE, MMMM d, yyyy")}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('common.application')}</h4>
                  <p className="text-sm">{entry.application}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('activities.windowTitle')}</h4>
                  <p className="text-sm break-words">{getMergedEntryText(entry)}</p>
                </div>
                
                {entry.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">{t('common.notes')}</h4>
                    <p className="text-sm break-words">{entry.notes}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('common.duration')}</h4>
                  <p className="text-sm">{formatDuration(entry.duration)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('common.client')}</h4>
                  <div className="flex items-center gap-2">
                    {client ? (
                      <>
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: client.color }} 
                        />
                        <span className="text-sm">{client.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t('common.unassigned')}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('common.billableAmount')}</h4>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${entry.is_billable === false ? 'line-through text-muted-foreground' : ''}`}>
                      {calculateBill(entry.duration, entry.clientId)}
                    </p>
                    {entry.is_billable === false && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {t('common.unbillable')}
                      </span>
                    )}
                  </div>
                </div>

                {entry.merged && entry.mergedCount && entry.mergedCount > 1 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">{t('common.mergedEntry')}</h4>
                    <p className="text-sm">{t('activities.mergedEntryNote').replace('{count}', entry.mergedCount.toString())}</p>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(entry)}>
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(entry.id)}
              >
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
