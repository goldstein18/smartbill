export interface TimeEntry {
  id: string;
  timestamp: string;
  application: string;
  windowTitle: string;
  duration: number;
  clientId?: string;
  notes?: string;
  screenshot?: string;
  is_billable?: boolean;
}

export interface Client {
  id: string;
  name: string;
  hourlyRate: number;
  color?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
}

export interface DashboardStats {
  totalHours: number;
  billableHours: number;
  unbilledAmount: number;
  clientDistribution: {
    clientId: string;
    clientName: string;
    hours: number;
    amount: number;
  }[];
}
