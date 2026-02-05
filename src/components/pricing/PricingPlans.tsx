
import React from 'react';
import { PricingCard } from './PricingCard';
import { PRICING_TIERS } from '@/config/pricing';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PricingPlansProps {
  currentPlan?: string;
  onPlanSelect?: (planId: string) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ 
  currentPlan,
  onPlanSelect 
}) => {
  const { user, session } = useSupabaseAuth();
  const { subscription } = useSubscription();
  const { t } = useLanguage();

  const handlePlanSelect = async (planId: string) => {
    if (!user || !session) {
      toast.error('Please sign in to select a plan');
      return;
    }

    if (onPlanSelect) {
      onPlanSelect(planId);
      return;
    }

    // Handle different plan types
    if (planId === 'trial') {
      toast.success('You are already on the free trial!');
      return;
    }

    if (planId === 'enterprise') {
      // Open email client for enterprise contact
      window.location.href = 'mailto:sales@smartbill.com?subject=Enterprise Plan Inquiry';
      return;
    }

    // Handle founder and professional plans
    if (planId === 'founder' || planId === 'professional') {
      try {
        toast.loading('Redirecting to checkout...');
        
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { planId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Checkout error:', error);
          toast.error('Failed to create checkout session');
          return;
        }

        if (data?.url) {
          // Open Stripe checkout in a new tab
          window.open(data.url, '_blank');
          toast.dismiss();
        } else {
          toast.error('No checkout URL received');
        }
      } catch (error) {
        console.error('Error creating checkout:', error);
        toast.error('Failed to start checkout process');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">
          {t('pricing.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('pricing.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {PRICING_TIERS.map((tier) => {
          const isCurrentPlan = subscription.plan === tier.id || 
                               (subscription.isLegacyUser && tier.id === 'professional') ||
                               currentPlan === tier.id;
          
          return (
            <PricingCard
              key={tier.id}
              tier={tier}
              onSelect={handlePlanSelect}
              isCurrentPlan={isCurrentPlan}
            />
          );
        })}
      </div>
    </div>
  );
};
