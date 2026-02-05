
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TimeEntry, Client } from "@/types";
import { getMergedEntryText, formatTimeRange } from "@/types/mergedTypes";
import { parseLocalDate } from "@/utils/dateUtils";
import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ActivitiesTabProps {
  sortedDates: string[];
  sortedEntriesByDate: Record<string, TimeEntry[]>;
  clients: Client[];
  assignClientToEntry: (entryId: string, clientId: string) => void;
  formatDuration: (seconds: number) => string;
  calculateBill: (duration: number, clientId?: string) => string;
}

// Helper function to truncate text to first N words
const truncateToWords = (text: string, wordCount: number): string => {
  const words = text.split(' ');
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '...';
};

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  sortedDates,
  sortedEntriesByDate,
  clients,
  assignClientToEntry,
  formatDuration,
  calculateBill,
}) => {
  const { t } = useLanguage();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('activities.noActivities')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDates.map(date => (
        <div key={date} className="space-y-2">
          <h3 className="text-lg font-semibold">
            {format(parseLocalDate(date), "EEEE, MMMM d, yyyy")}
          </h3>
          <Card>
            <CardContent className="p-0">
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
                    <TableHead className="text-right">{t('common.info')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEntriesByDate[date].map(entry => {
                    const client = clients.find(c => c.id === entry.clientId);
                    
                    return (
                      <TableRow key={entry.id} className="hover:bg-muted/50">
                        <TableCell>
                          {formatTimeRange(entry)}
                        </TableCell>
                        <TableCell>{entry.application}</TableCell>
                        <TableCell className="max-w-xs truncate-text" title={entry.windowTitle}>
                          {truncateToWords(getMergedEntryText(entry), 5)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate-text" title={entry.notes || ""}>
                          {entry.notes ? truncateToWords(entry.notes, 4) : "-"}
                        </TableCell>
                        <TableCell>{formatDuration(entry.duration)}</TableCell>
                        <TableCell>
                          <Select
                            value={entry.clientId || "unassigned"}
                            onValueChange={(value) => assignClientToEntry(entry.id, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder={t('common.unassigned')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">{t('common.unassigned')}</SelectItem>
                              {clients.map(client => (
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
                        </TableCell>
                        <TableCell>
                          {calculateBill(entry.duration, entry.clientId)}
                        </TableCell>
                        <TableCell className="text-right">
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
                                  <p className="text-sm font-medium">{calculateBill(entry.duration, entry.clientId)}</p>
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
