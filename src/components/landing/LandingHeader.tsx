
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scale, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/ui-custom/LanguageToggle";

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="bg-navy text-navy-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-white">{t('landing.header.smartBill')}</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">{t('landing.header.features')}</a>
            <a href="#benefits" className="text-slate-300 hover:text-white transition-colors">{t('landing.header.benefits')}</a>
            <button 
              onClick={() => navigate('/pricing')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t('landing.header.pricing')}
            </button>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">{t('landing.header.reviews')}</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white hover:bg-transparent"
            >
              {t('landing.header.signIn')}
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-warning hover:bg-warning/90 text-warning-foreground font-medium"
            >
              {t('landing.header.startFreeTrial')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
