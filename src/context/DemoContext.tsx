
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimeEntry, Client } from '@/types';

interface DemoContextProps {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  demoTimeEntries: TimeEntry[];
  demoClients: Client[];
  demoStats: {
    totalHours: number;
    billableHours: number;
    unbilledAmount: number;
    clientDistribution: Array<{
      clientId: string;
      clientName: string;
      hours: number;
      amount: number;
    }>;
  };
}

const DemoContext = createContext<DemoContextProps | undefined>(undefined);

// Mock data for realistic legal practice demonstration
const mockClients: Client[] = [
  {
    id: 'demo-client-1',
    name: 'Thornfield & Associates LLC',
    hourlyRate: 450,
    color: '#3B82F6',
  },
  {
    id: 'demo-client-2',
    name: 'Metropolitan Insurance Corp',
    hourlyRate: 375,
    color: '#10B981',
  },
  {
    id: 'demo-client-3',
    name: 'Riverstone Development Group',
    hourlyRate: 525,
    color: '#F59E0B',
  },
  {
    id: 'demo-client-4',
    name: 'Pro Bono - Legal Aid Society',
    hourlyRate: 0,
    color: '#8B5CF6',
  },
];

const mockTimeEntries: TimeEntry[] = [
  // Recent entries showing high billable value
  {
    id: 'demo-entry-1',
    application: 'Microsoft Word',
    windowTitle: 'Contract Review - Thornfield Merger Agreement.docx',
    timestamp: new Date('2024-06-22T09:30:00').toISOString(),
    duration: 9900, // 2h 45m
    clientId: 'demo-client-1',
    notes: 'Comprehensive review of merger agreement terms, identified 12 key issues requiring negotiation',
  },
  {
    id: 'demo-entry-2',
    application: 'Zoom',
    windowTitle: 'Client Conference Call - Metropolitan Insurance',
    timestamp: new Date('2024-06-22T14:00:00').toISOString(),
    duration: 5400, // 1h 30m
    clientId: 'demo-client-2',
    notes: 'Strategy session for upcoming litigation, discussed discovery timeline and witness preparation',
  },
  {
    id: 'demo-entry-3',
    application: 'LexisNexis+',
    windowTitle: 'Case Research - Property Development Zoning Laws',
    timestamp: new Date('2024-06-21T10:15:00').toISOString(),
    duration: 12600, // 3h 30m
    clientId: 'demo-client-3',
    notes: 'In-depth research on municipal zoning regulations, found 3 relevant precedents',
  },
  {
    id: 'demo-entry-4',
    application: 'Outlook',
    windowTitle: 'Email Correspondence - Insurance Claim Dispute',
    timestamp: new Date('2024-06-21T16:00:00').toISOString(),
    duration: 2700, // 45m
    clientId: 'demo-client-2',
    notes: 'Drafted detailed response to opposing counsel regarding coverage dispute',
  },
  {
    id: 'demo-entry-5',
    application: 'Google Chrome',
    windowTitle: 'Court Filing Portal - Riverstone Permit Application',
    timestamp: new Date('2024-06-20T11:30:00').toISOString(),
    duration: 2700, // 45m
    clientId: 'demo-client-3',
    notes: 'Filed motion for expedited hearing on zoning variance application',
  },
  {
    id: 'demo-entry-6',
    application: 'Adobe Acrobat',
    windowTitle: 'Document Preparation - Settlement Agreement Draft',
    timestamp: new Date('2024-06-20T14:30:00').toISOString(),
    duration: 9000, // 2h 30m
    clientId: 'demo-client-1',
    notes: 'Drafted comprehensive settlement agreement with indemnification clauses',
  },
  {
    id: 'demo-entry-7',
    application: 'Microsoft Teams',
    windowTitle: 'Internal Team Meeting - Case Strategy',
    timestamp: new Date('2024-06-19T09:00:00').toISOString(),
    duration: 5400, // 1h 30m
    notes: 'Weekly team sync, reviewed caseload distribution and upcoming deadlines',
  },
  {
    id: 'demo-entry-8',
    application: 'Westlaw',
    windowTitle: 'Legal Research - Corporate Liability Precedents',
    timestamp: new Date('2024-06-19T13:15:00').toISOString(),
    duration: 11700, // 3h 15m
    clientId: 'demo-client-1',
    notes: 'Comprehensive research on director liability in M&A transactions',
  },
  {
    id: 'demo-entry-9',
    application: 'Microsoft Word',
    windowTitle: 'Brief Writing - Motion to Dismiss',
    timestamp: new Date('2024-06-18T10:00:00').toISOString(),
    duration: 15300, // 4h 15m
    clientId: 'demo-client-2',
    notes: 'Drafted motion to dismiss with comprehensive legal arguments and precedent citations',
  },
  {
    id: 'demo-entry-10',
    application: 'Excel',
    windowTitle: 'Damages Calculator - Insurance Claim Analysis',
    timestamp: new Date('2024-06-18T15:30:00').toISOString(),
    duration: 5400, // 1h 30m
    clientId: 'demo-client-2',
    notes: 'Calculated potential damages and created financial impact analysis',
  },
];

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode based on URL
    const path = window.location.pathname;
    if (path === '/demo') {
      setIsDemoMode(true);
    }
  }, []);

  const enterDemoMode = () => {
    setIsDemoMode(true);
    window.history.pushState({}, '', '/demo');
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    window.history.pushState({}, '', '/');
  };

  // Calculate demo stats
  const calculateDemoStats = () => {
    const billableEntries = mockTimeEntries.filter(entry => entry.clientId);
    const totalSeconds = billableEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const totalHours = totalSeconds / 3600;
    
    let unbilledAmount = 0;
    const clientHours: Record<string, number> = {};
    
    billableEntries.forEach(entry => {
      if (entry.clientId) {
        const client = mockClients.find(c => c.id === entry.clientId);
        if (client) {
          const hours = entry.duration / 3600;
          unbilledAmount += hours * client.hourlyRate;
          clientHours[entry.clientId] = (clientHours[entry.clientId] || 0) + hours;
        }
      }
    });

    const clientDistribution = Object.entries(clientHours).map(([clientId, hours]) => {
      const client = mockClients.find(c => c.id === clientId);
      return {
        clientId,
        clientName: client?.name || 'Unknown',
        hours,
        amount: hours * (client?.hourlyRate || 0),
      };
    });

    return {
      totalHours,
      billableHours: totalHours,
      unbilledAmount,
      clientDistribution,
    };
  };

  const demoStats = calculateDemoStats();

  const value: DemoContextProps = {
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    demoTimeEntries: mockTimeEntries,
    demoClients: mockClients,
    demoStats,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextProps => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
