
import React from 'react';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { PartnerProgram } from '@/components/pricing/PartnerProgram';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/ui-custom/LanguageToggle';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-navy-foreground sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Scale className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-white">SmartBill</span>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-slate-300 hover:text-white hover:bg-slate-deep"
              >
                {t('landing.header.signIn')}
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {t('landing.header.startFreeTrial')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        <PricingPlans />
        
        <Separator className="my-16" />
        
        <PartnerProgram />
      </div>
    </div>
  );
};

export default PricingPage;
