
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-navy">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          {t('landing.cta.title')}
        </h2>
        <p className="text-xl text-slate-300 mb-8">
          {t('landing.cta.subtitle')}
        </p>
        <Button
          size="lg"
          className="text-lg px-8 py-6 bg-warning hover:bg-warning/90 text-warning-foreground font-semibold"
          onClick={() => navigate("/register")}
        >
          {t('landing.cta.startFreeTrial')}
        </Button>
        <p className="text-slate-400 mt-4">{t('landing.cta.disclaimer')}</p>
      </div>
    </section>
  );
};

export default CTASection;
