
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { useDemo } from '@/context/DemoContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientsTab } from '@/components/dashboard/ClientsTab';
import { ActivitiesPage } from '@/components/demo/DemoActivitiesPage';
import { AnalyticsPage } from '@/components/demo/DemoAnalyticsPage';
import { InvoicesPage } from '@/components/demo/DemoInvoicesPage';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { demoTimeEntries, demoClients, demoStats, exitDemoMode } = useDemo();
  const { demoUser } = useDemoAuth();
  
  // Get initial tab from URL hash or default to dashboard
  const getInitialTab = () => {
    const hash = location.hash.replace('#', '');
    return hash || 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

  useEffect(() => {
    // Ensure we're in demo mode when accessing this page
    if (!demoUser) {
      navigate('/');
    }
  }, [demoUser, navigate]);

  useEffect(() => {
    // Listen for demo navigation events from sidebar
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('demo-tab-change', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('demo-tab-change', handleTabChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Update tab when URL hash changes
    const hash = location.hash.replace('#', '');
    if (hash && hash !== activeTab) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Group entries by date for display using ISO date format (YYYY-MM-DD)
  const sortedEntriesByDate: Record<string, typeof demoTimeEntries> = {};
  demoTimeEntries.forEach(entry => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD format
    if (!sortedEntriesByDate[date]) {
      sortedEntriesByDate[date] = [];
    }
    sortedEntriesByDate[date].push(entry);
  });

  const sortedDates = Object.keys(sortedEntriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateBill = (duration: number, clientId?: string): string => {
    if (!clientId) return '$0.00';
    const client = demoClients.find(c => c.id === clientId);
    if (!client) return '$0.00';
    const hours = duration / 3600;
    return `$${(hours * client.hourlyRate).toFixed(2)}`;
  };

  const assignClientToEntry = () => {
    // Demo mode - no actual changes
  };

  if (!demoUser) {
    return null;
  }

  return (
    <div className="relative">
      {/* Demo Banner */}
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <ExternalLink className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>Demo Mode Active</strong> - You're exploring SmartBill with realistic legal practice data. 
            This shows potential unbilled revenue of <strong>${demoStats.unbilledAmount.toLocaleString()}</strong> from just 3 days of tracked time!
          </span>
          <div className="flex gap-2 ml-4">
            <Button 
              size="sm" 
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Tracking Real Hours <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                exitDemoMode();
                navigate('/');
              }}
            >
              Exit Demo
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Practice Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {demoUser.displayName} • Last 7 days activity
              </p>
            </div>
          </div>

          <StatsCards
            stats={{
              totalHours: demoStats.totalHours,
              billableHours: demoStats.billableHours,
              clientDistribution: demoStats.clientDistribution,
              unbilledAmount: demoStats.unbilledAmount
            }}
          />

          {/* Demo Content based on active tab */}
          {activeTab === 'dashboard' && (
            <DashboardTabs
              sortedDates={sortedDates}
              sortedEntriesByDate={sortedEntriesByDate}
              clients={demoClients}
              stats={demoStats}
              assignClientToEntry={assignClientToEntry}
              formatDuration={formatDuration}
              calculateBill={calculateBill}
              showMerged={false}
              setShowMerged={() => {}}
            />
          )}
          
          {activeTab === 'activities' && <ActivitiesPage />}
          {activeTab === 'clients' && <ClientsTab />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'invoices' && <InvoicesPage />}
        </div>
      </AppLayout>
    </div>
  );
};

export default DemoPage;
