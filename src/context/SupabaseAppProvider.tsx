
import React, { createContext, useContext } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useTimeEntries } from "@/hooks/useTimeEntries";
import { useClients } from "@/hooks/useClients";
import { useCalculations } from "@/hooks/useCalculations";
import { AppContextType } from "./types";

const SupabaseAppContext = createContext<AppContextType | undefined>(undefined);

export const SupabaseAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSupabaseAuth();
  
  const {
    timeEntries,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    assignClientToEntry,
    toggleBillableStatus,
  } = useTimeEntries(user);

  const {
    clients,
    addClient,
    updateClient,
    deleteClient,
  } = useClients(user);

  const {
    stats,
    calculateTotalBill,
  } = useCalculations(timeEntries, clients);

  return (
    <SupabaseAppContext.Provider value={{
      timeEntries,
      clients,
      stats,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
      addClient,
      updateClient,
      deleteClient,
      assignClientToEntry,
      toggleBillableStatus,
      calculateTotalBill,
    }}>
      {children}
    </SupabaseAppContext.Provider>
  );
};

export const useSupabaseAppContext = () => {
  const context = useContext(SupabaseAppContext);
  if (context === undefined) {
    throw new Error("useSupabaseAppContext must be used within a SupabaseAppProvider");
  }
  return context;
};
