
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PartnerApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  experience?: string;
  network?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const usePartnerApplications = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure proper typing
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setApplications(typedData);
    } catch (error) {
      console.error('Error fetching partner applications:', error);
      toast.error('Failed to fetch partner applications');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('partner_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await fetchApplications();
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    isLoading,
    updateApplicationStatus,
    refetch: fetchApplications
  };
};
