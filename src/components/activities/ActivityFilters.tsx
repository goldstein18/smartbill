
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Filter } from "lucide-react";
import { Client } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface ActivityFiltersProps {
  clients: Client[];
  applications: string[];
  selectedClient: string;
  selectedApp: string;
  selectedDate: Date | undefined;
  onClientChange: (value: string) => void;
  onAppChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onExport: () => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  clients,
  applications,
  selectedClient,
  selectedApp,
  selectedDate,
  onClientChange,
  onAppChange,
  onDateChange,
  onExport,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">{t('activities.filters')}:</span>
      </div>
      
      <Select value={selectedClient} onValueChange={onClientChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('activities.filterByClient')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('activities.allClients')}</SelectItem>
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

      <Select value={selectedApp} onValueChange={onAppChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('activities.filterByApplication')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('activities.allApplications')}</SelectItem>
          {applications.map(app => (
            <SelectItem key={app} value={app}>{app}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
            {selectedDate ? format(selectedDate, "PPP") : t('activities.pickDate')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDateChange(undefined)}
        >
          {t('activities.clearDate')}
        </Button>
      )}

      <Button 
        variant="outline" 
        className="ml-auto"
        onClick={onExport}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        {t('activities.exportToPdf')}
      </Button>
    </div>
  );
};
