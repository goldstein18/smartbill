
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserWithSubscription {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  stripe_customer_id: string | null;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users with subscription data...');
      
      // Fetch profiles first
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, display_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data:', profilesData);

      // Fetch all subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('user_id, subscribed, subscription_tier, subscription_end, stripe_customer_id');

      if (subscribersError) {
        console.error('Error fetching subscribers:', subscribersError);
        throw subscribersError;
      }

      console.log('Subscribers data:', subscribersData);

      // Transform the data by combining profiles with their subscription info
      const transformedUsers: UserWithSubscription[] = profilesData?.map(profile => {
        const subscription = subscribersData?.find(sub => sub.user_id === profile.id);
        
        return {
          id: profile.id,
          email: profile.email,
          display_name: profile.display_name,
          created_at: profile.created_at,
          subscribed: subscription?.subscribed || false,
          subscription_tier: subscription?.subscription_tier || null,
          subscription_end: subscription?.subscription_end || null,
          stripe_customer_id: subscription?.stripe_customer_id || null,
        };
      }) || [];

      console.log('Transformed users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserSubscription = async (userId: string, subscriptionData: {
    subscribed: boolean;
    subscription_tier?: string | null;
    subscription_end?: string | null;
  }) => {
    try {
      console.log('Updating subscription for user:', userId, subscriptionData);
      
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: userId,
          email: users.find(u => u.id === userId)?.email || '',
          subscribed: subscriptionData.subscribed,
          subscription_tier: subscriptionData.subscription_tier,
          subscription_end: subscriptionData.subscription_end,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }

      toast.success('Subscription updated successfully');
      await fetchUsers(); // Refresh the data
    } catch (error) {
      console.error('Error in updateUserSubscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  const cancelUserSubscription = async (userId: string) => {
    await updateUserSubscription(userId, {
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
    });
  };

  const upgradeUserSubscription = async (userId: string, tier: string) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month from now
    
    await updateUserSubscription(userId, {
      subscribed: true,
      subscription_tier: tier,
      subscription_end: endDate.toISOString(),
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    refetch: fetchUsers,
    cancelUserSubscription,
    upgradeUserSubscription,
  };
};
