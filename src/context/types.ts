
import { TimeEntry, Client, DashboardStats } from "@/types";

export interface AppContextType {
  timeEntries: TimeEntry[];
  clients: Client[];
  stats: DashboardStats;
  addTimeEntry: (entry: Omit<TimeEntry, "id">) => Promise<boolean>;
  updateTimeEntry: (entry: TimeEntry) => Promise<boolean>;
  deleteTimeEntry: (id: string) => Promise<boolean>;
  addClient: (client: Omit<Client, "id">) => Promise<boolean>;
  updateClient: (client: Client) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
  assignClientToEntry: (entryId: string, clientId: string) => Promise<boolean>;
  toggleBillableStatus: (entryId: string) => Promise<boolean>;
  calculateTotalBill: (entries: TimeEntry[], clientId?: string) => number;
}
