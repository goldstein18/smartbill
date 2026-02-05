
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types";

interface ClientSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  clients: Client[];
  className?: string;
}

export const ClientSelect: React.FC<ClientSelectProps> = ({
  value,
  onValueChange,
  clients,
  className,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentValue = value || "unassigned";
  
  console.log("ClientSelect rendered with:", { 
    currentValue, 
    clientsCount: clients.length, 
    clients,
    originalValue: value 
  });
  
  const handleValueChange = async (newValue: string) => {
    console.log("ClientSelect value changing from", currentValue, "to", newValue);
    setIsUpdating(true);
    
    try {
      await onValueChange(newValue);
    } finally {
      // Reset updating state after a short delay to show the change was processed
      setTimeout(() => setIsUpdating(false), 500);
    }
  };
  
  return (
    <Select value={currentValue} onValueChange={handleValueChange} disabled={isUpdating}>
      <SelectTrigger className={`${className} ${isUpdating ? 'opacity-70' : ''}`}>
        <SelectValue placeholder="Select client" />
      </SelectTrigger>
      <SelectContent 
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        style={{ zIndex: 9999 }}
        position="popper"
        sideOffset={4}
      >
        <SelectItem value="unassigned" className="hover:bg-gray-100 dark:hover:bg-gray-700">
          Unassigned
        </SelectItem>
        {clients.map((client) => (
          <SelectItem 
            key={client.id} 
            value={client.id}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
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
  );
};
