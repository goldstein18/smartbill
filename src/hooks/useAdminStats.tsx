
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalPartnerApplications: number;
  totalUsers: number;
  activeSubscriptions: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalPartnerApplications: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      console.log('Fetching admin stats...');
      
      // Fetch all stats in parallel
      const [
        partnerApplicationsResponse,
        usersResponse,
        subscriptionsResponse
      ] = await Promise.all([
        supabase.from('partner_applications').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).not('id', 'is', null),
        supabase.from('subscribers').select('id', { count: 'exact', head: true }).eq('subscribed', true)
      ]);

      console.log('Partner applications response:', partnerApplicationsResponse);
      console.log('Total users response:', usersResponse);
      console.log('Active subscriptions response:', subscriptionsResponse);

      console.log('Partner applications count:', partnerApplicationsResponse.count);
      console.log('Total users count:', usersResponse.count);
      console.log('Active subscriptions count:', subscriptionsResponse.count);

      setStats({
        totalPartnerApplications: partnerApplicationsResponse.count || 0,
        totalUsers: usersResponse.count || 0,
        activeSubscriptions: subscriptionsResponse.count || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    refetch: fetchStats
  };
};
