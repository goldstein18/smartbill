
import React from "react";
import { Clock, Users, DollarSign, BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Clock,
      title: t('landing.features.automaticTimeTracking.title'),
      description: t('landing.features.automaticTimeTracking.description')
    },
    {
      icon: DollarSign,
      title: t('landing.features.smartBilling.title'),
      description: t('landing.features.smartBilling.description')
    },
    {
      icon: Users,
      title: t('landing.features.clientManagement.title'),
      description: t('landing.features.clientManagement.description')
    },
    {
      icon: BarChart3,
      title: t('landing.features.analyticsReports.title'),
      description: t('landing.features.analyticsReports.description')
    }
  ];

  return (
    <section id="features" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('landing.features.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('landing.features.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-deep/10 border border-border mb-4">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
