
import React from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TimeEntry, Client } from "@/types";
import { ActivityRow } from "./ActivityRow";
import { parseLocalDate } from "@/utils/dateUtils";
import { useLanguage } from "@/context/LanguageContext";

interface ActivitiesTableProps {
  entriesByDate: Record<string, TimeEntry[]>;
  sortedDates: string[];
  clients: Client[];
  onEdit: (entry: TimeEntry) => void;
  onNoteUpdate: (entry: TimeEntry) => void;
  onDelete: (entryId: string) => void;
  onClientAssignment: (entryId: string, clientId: string) => void;
  onBillableToggle: (entryId: string) => void;
  formatDuration: (seconds: number) => string;
  calculateBill: (duration: number, clientId?: string) => string;
}

export const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  entriesByDate,
  sortedDates,
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

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">{t('activities.noActivitiesFound')}</p>
      </div>
    );
  }

  return (
    <>
      {sortedDates.map(date => (
        <div key={date} className="space-y-2">
          <h3 className="text-lg font-semibold">
            {format(parseLocalDate(date), "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.time')}</TableHead>
                  <TableHead>{t('common.application')}</TableHead>
                  <TableHead>{t('activities.windowTitle')}</TableHead>
                  <TableHead>{t('common.notes')}</TableHead>
                  <TableHead>{t('common.duration')}</TableHead>
                  <TableHead>{t('common.client')}</TableHead>
                  <TableHead>{t('common.billable')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entriesByDate[date].map(entry => (
                  <ActivityRow
                    key={entry.id}
                    entry={entry}
                    clients={clients}
                    onEdit={onEdit}
                    onNoteUpdate={onNoteUpdate}
                    onDelete={onDelete}
                    onClientAssignment={onClientAssignment}
                    onBillableToggle={onBillableToggle}
                    formatDuration={formatDuration}
                    calculateBill={calculateBill}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </>
  );
};
