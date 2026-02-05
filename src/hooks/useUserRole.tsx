
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

export type UserRole = 'user' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const { user } = useSupabaseAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole('user');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else {
          setRole(data || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || role === 'super_admin';

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isLoading
  };
};
