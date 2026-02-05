
import React from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BenefitsSection: React.FC = () => {
  const { t, tArray } = useLanguage();

  return (
    <section id="benefits" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {t('landing.benefits.title')}
            </h2>
            <div className="space-y-4">
              {tArray('landing.benefits.benefits').map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-deep p-8 rounded-lg shadow-xl border border-slate-700">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">2,500+</div>
              <div className="text-slate-300 mb-6">{t('landing.benefits.trustedBy')}</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">40%</div>
                  <div className="text-sm text-slate-400">{t('landing.benefits.moreAccurateBilling')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">25min</div>
                  <div className="text-sm text-slate-400">{t('landing.benefits.savedPerDay')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99%</div>
                  <div className="text-sm text-slate-400">{t('landing.benefits.customerSatisfaction')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
