
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: string | null;
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  features: string[];
  isLegacyUser?: boolean;
}

export const useSubscription = () => {
  const { user, session } = useSupabaseAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isSubscribed: false,
    plan: null,
    isTrialActive: false,
    trialEndsAt: null,
    features: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status from Stripe
  const checkSubscriptionStatus = async () => {
    if (!user || !session) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Checking subscription status for user:', user.email);
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        // Fallback to trial for existing users
        setTrialStatus();
        return;
      }

      console.log('Subscription data received:', data);

      if (data.subscribed) {
        setSubscription({
          isSubscribed: true,
          plan: data.subscription_tier,
          isTrialActive: false,
          trialEndsAt: data.subscription_end ? new Date(data.subscription_end) : null,
          features: getAllFeatures()
        });
      } else {
        // Check if this is a legacy user (created before subscription system)
        const userCreatedAt = new Date(user.created_at);
        const subscriptionLaunchDate = new Date('2025-01-01'); // Adjust this date
        const isLegacyUser = userCreatedAt < subscriptionLaunchDate;

        if (isLegacyUser) {
          // Legacy users get free access forever
          setSubscription({
            isSubscribed: true,
            plan: 'legacy',
            isTrialActive: false,
            trialEndsAt: null,
            features: getAllFeatures(),
            isLegacyUser: true
          });
        } else {
          // New users get trial
          setTrialStatus();
        }
      }
    } catch (error) {
      console.error('Error in checkSubscriptionStatus:', error);
      setTrialStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const setTrialStatus = () => {
    if (!user) return;
    
    // 14-day trial from user creation
    const userCreatedAt = new Date(user.created_at);
    const trialEnd = new Date(userCreatedAt);
    trialEnd.setDate(trialEnd.getDate() + 14);
    
    const isTrialActive = new Date() < trialEnd;
    
    setSubscription({
      isSubscribed: false,
      plan: 'trial',
      isTrialActive,
      trialEndsAt: trialEnd,
      features: isTrialActive ? getAllFeatures() : []
    });
  };

  const getAllFeatures = () => [
    'time_tracking',
    'analytics',
    'invoicing',
    'secure_logs',
    'desktop_app'
  ];

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user, session]);

  const hasFeature = (feature: string): boolean => {
    return subscription.features.includes(feature);
  };

  const canAccessFeature = (feature: string): boolean => {
    // Legacy users and active subscribers have full access
    if (subscription.isLegacyUser || subscription.isSubscribed) {
      return true;
    }
    // Trial users have access if trial is active
    return subscription.isTrialActive;
  };

  const refreshSubscription = () => {
    checkSubscriptionStatus();
  };

  return {
    subscription,
    hasFeature,
    canAccessFeature,
    isLoading,
    refreshSubscription
  };
};
