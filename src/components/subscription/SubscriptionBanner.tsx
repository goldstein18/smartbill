
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Crown, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SubscriptionBanner: React.FC = () => {
  const { subscription, refreshSubscription } = useSubscription();
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    if (!session) {
      toast.error('Please sign in to manage your subscription');
      return;
    }

    try {
      toast.loading('Opening subscription management...');
      
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Portal error:', error);
        toast.error('Failed to open subscription management');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.dismiss();
        // Refresh subscription status after a delay
        setTimeout(() => refreshSubscription(), 3000);
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    }
  };

  // Don't show banner for legacy users
  if (subscription.isLegacyUser) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-800">Legacy User</p>
                <p className="text-sm text-purple-700">You have lifetime access to SmartBill</p>
              </div>
            </div>
            <Badge className="bg-purple-600 text-white">
              Lifetime Access
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expired trial banner
  if (!subscription.isTrialActive && !subscription.isSubscribed) {
    return (
      <Card className="bg-red-50 border-red-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Trial Expired</p>
                <p className="text-sm text-red-700">Upgrade to continue using SmartBill</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/pricing')}
              className="bg-red-600 hover:bg-red-700"
            >
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active trial banner
  if (subscription.isTrialActive && subscription.trialEndsAt) {
    const daysLeft = Math.ceil((subscription.trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <Card className="bg-blue-50 border-blue-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-blue-800">Free Trial Active</p>
                  <Badge className="bg-blue-600 text-white">
                    {daysLeft} days left
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">Full access to all features</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/pricing')}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active subscription banner
  if (subscription.isSubscribed) {
    const getPlanDisplay = () => {
      switch (subscription.plan) {
        case 'founder':
          return { name: 'Founder Plan', icon: Star, color: 'yellow' };
        case 'professional':
          return { name: 'Professional Plan', icon: Crown, color: 'purple' };
        case 'enterprise':
          return { name: 'Enterprise Plan', icon: Crown, color: 'slate' };
        default:
          return { name: 'Subscribed', icon: Zap, color: 'green' };
      }
    };

    const planDisplay = getPlanDisplay();
    const IconComponent = planDisplay.icon;

    return (
      <Card className={`bg-${planDisplay.color}-50 border-${planDisplay.color}-200 mb-6`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className={`h-5 w-5 text-${planDisplay.color}-600`} />
              <div>
                <div className="flex items-center gap-2">
                  <p className={`font-semibold text-${planDisplay.color}-800`}>{planDisplay.name}</p>
                  <Badge className={`bg-${planDisplay.color}-600 text-white`}>
                    Active
                  </Badge>
                </div>
                <p className={`text-sm text-${planDisplay.color}-700`}>
                  {subscription.trialEndsAt && 
                    `Renews ${subscription.trialEndsAt.toLocaleDateString()}`
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={handleManageSubscription}
              variant="outline"
              className={`border-${planDisplay.color}-300 text-${planDisplay.color}-700 hover:bg-${planDisplay.color}-100`}
            >
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
