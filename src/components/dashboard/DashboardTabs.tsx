
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeEntry, Client } from "@/types";
import { ActivitiesTab } from "./ActivitiesTab";
import { ClientsTab } from "./ClientsTab";
import { AddEntryButton } from "@/components/time-entry/AddEntryButton";
import { MergeToggle } from "@/components/ui-custom/MergeToggle";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardTabsProps {
  sortedDates: string[];
  sortedEntriesByDate: Record<string, TimeEntry[]>;
  clients: Client[];
  stats: {
    totalHours: number;
    billableHours: number;
    clientDistribution: Array<{
      clientId: string;
      clientName: string;
      hours: number;
      amount: number;
    }>;
    unbilledAmount: number;
  };
  assignClientToEntry: (entryId: string, clientId: string) => void;
  formatDuration: (seconds: number) => string;
  calculateBill: (duration: number, clientId?: string) => string;
  showMerged: boolean;
  setShowMerged: (value: boolean) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  sortedDates,
  sortedEntriesByDate,
  clients,
  stats,
  assignClientToEntry,
  formatDuration,
  calculateBill,
  showMerged,
  setShowMerged,
}) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="activities" className="w-full">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-2">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
          <TabsTrigger value="activities">{t('dashboard.recentActivities')}</TabsTrigger>
          <TabsTrigger value="clients">{t('dashboard.clientSummary')}</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <AddEntryButton />
          <MergeToggle 
            isMerged={showMerged} 
            onToggle={setShowMerged} 
          />
        </div>
      </div>
      
      <TabsContent value="activities" className="space-y-4">
        <ActivitiesTab
          sortedDates={sortedDates}
          sortedEntriesByDate={sortedEntriesByDate}
          clients={clients}
          assignClientToEntry={assignClientToEntry}
          formatDuration={formatDuration}
          calculateBill={calculateBill}
        />
      </TabsContent>
      
      <TabsContent value="clients">
        <ClientsTab />
      </TabsContent>
    </Tabs>
  );
};
