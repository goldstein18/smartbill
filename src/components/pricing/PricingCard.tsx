
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown } from 'lucide-react';
import { PricingTier } from '@/config/pricing';
import { useLanguage } from '@/context/LanguageContext';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tierId: string) => void;
  isCurrentPlan?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ tier, onSelect, isCurrentPlan = false }) => {
  const { t, tArray } = useLanguage();

  const formatPrice = (price: number | null) => {
    if (price === null) return t('pricing.buttons.contactUs');
    if (price === 0) return t('pricing.buttons.free');
    return `$${price.toLocaleString()}`;
  };

  const getIcon = () => {
    if (tier.enterprise) return <Crown className="h-5 w-5 text-accent" />;
    if (tier.popular) return <Star className="h-5 w-5 text-warning" />;
    return null;
  };

  const getCardClassName = () => {
    let baseClass = "relative h-full transition-all duration-200 hover:shadow-md";
    
    if (isCurrentPlan) {
      baseClass += " ring-2 ring-primary bg-primary/5";
    } else if (tier.popular) {
      baseClass += " ring-2 ring-primary shadow-lg scale-105";
    } else if (tier.enterprise) {
      baseClass += " ring-2 ring-accent bg-accent/5";
    }
    
    return baseClass;
  };

  // Get translated content for the tier
  const tierName = t(`pricing.plans.${tier.id}.name`);
  const tierDescription = t(`pricing.plans.${tier.id}.description`);
  const tierFeatures = tArray(`pricing.plans.${tier.id}.features`);

  return (
    <Card className={getCardClassName()}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">{t('pricing.buttons.mostPopular')}</Badge>
        </div>
      )}
      
      {tier.enterprise && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground px-3 py-1">{t('pricing.buttons.enterprise')}</Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getIcon()}
          <CardTitle className="text-2xl font-bold text-card-foreground">{tierName}</CardTitle>
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-card-foreground">
            {formatPrice(tier.price)}
            {tier.price !== null && tier.price > 0 && <span className="text-lg font-normal text-muted-foreground">/{tier.interval}</span>}
          </div>
          <p className="text-muted-foreground text-sm">{tierDescription}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {tierFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSelect(tier.id)}
          className={`w-full ${
            isCurrentPlan 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : tier.enterprise
              ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan 
            ? t('pricing.buttons.currentPlan')
            : tier.trial 
            ? t('pricing.buttons.startFreeTrial')
            : tier.enterprise 
            ? t('pricing.buttons.contactSales')
            : t('pricing.buttons.getStarted')
          }
        </Button>
      </CardContent>
    </Card>
  );
};
