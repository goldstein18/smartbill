
import React from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ModeToggle } from "../ui-custom/ModeToggle";
import { LanguageToggle } from "../ui-custom/LanguageToggle";
import { UserMenu } from "./UserMenu";
import { Scale, Home, Clock, Users, BarChart, FileText, Settings, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useDemo } from "@/context/DemoContext";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDemoMode } = useDemo();
  const { demoUser } = useDemoAuth();
  const { isSuperAdmin } = useUserRole();

  const navigationItems = [
    { name: t('navigation.dashboard'), href: isDemoMode ? '/demo' : '/dashboard', icon: Home, tab: 'dashboard' },
    { name: t('navigation.activities'), href: isDemoMode ? '/demo' : '/activities', icon: Clock, tab: 'activities' },
    { name: t('navigation.clients'), href: isDemoMode ? '/demo' : '/clients', icon: Users, tab: 'clients' },
    { name: t('navigation.analytics'), href: isDemoMode ? '/demo' : '/analytics', icon: BarChart, tab: 'analytics' },
    { name: t('navigation.invoices'), href: isDemoMode ? '/demo' : '/invoices', icon: FileText, tab: 'invoices' },
  ];

  // Add admin navigation for super admins
  if (isSuperAdmin && !isDemoMode) {
    navigationItems.push({
      name: 'Admin Dashboard',
      href: '/admin',
      icon: Shield,
      tab: 'admin'
    });
  }

  const handleDemoNavigation = (tab: string) => {
    if (isDemoMode) {
      // Update URL with hash to indicate the active tab
      navigate(`/demo#${tab}`, { replace: true });
      // Trigger a custom event to update the tab in DemoPage
      window.dispatchEvent(new CustomEvent('demo-tab-change', { detail: { tab } }));
    }
  };

  const getCurrentTab = () => {
    if (location.pathname === '/demo') {
      const hash = location.hash.replace('#', '');
      return hash || 'dashboard';
    }
    return location.pathname;
  };

  const isActive = (item: any) => {
    if (isDemoMode) {
      const currentTab = getCurrentTab();
      return currentTab === item.tab;
    }
    return location.pathname === item.href;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="flex h-14 items-center px-4 border-b border-sidebar-border">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-semibold text-sidebar-foreground hover:text-accent transition-colors"
            >
              <Scale className="h-5 w-5 text-accent" />
              <span>SmartBill</span>
              {isDemoMode && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">DEMO</span>}
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild={!isDemoMode} 
                        isActive={isActive(item)}
                        onClick={isDemoMode ? () => handleDemoNavigation(item.tab) : undefined}
                      >
                        {isDemoMode ? (
                          <div className="flex items-center cursor-pointer">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </div>
                        ) : (
                          <Link to={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {!isDemoMode && (
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/settings'}>
                    <Link to="/settings">
                      <Settings className="h-4 w-4" />
                      <span>{t('navigation.settings')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          )}
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4 text-card-foreground">
                {isDemoMode ? 'Demo Dashboard' : t('navigation.legalPracticeDashboard')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
              {!isDemoMode && <UserMenu />}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
