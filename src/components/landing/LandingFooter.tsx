
import React from "react";
import { useNavigate } from "react-router-dom";
import { Scale } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const LandingFooter: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="bg-navy text-navy-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-white">{t('landing.header.smartBill')}</span>
            </div>
            <p className="text-slate-400">
              {t('landing.footer.tagline')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('landing.footer.product')}</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/faq")}>{t('landing.footer.features')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/pricing")}>{t('landing.footer.pricing')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/privacy")}>{t('landing.footer.security')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/help")}>{t('landing.footer.integrations')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('landing.footer.support')}</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/help")}>{t('landing.footer.helpCenter')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/contact")}>{t('landing.footer.contactUs')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/faq")}>{t('landing.footer.apiDocs')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/help")}>{t('landing.footer.systemStatus')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('landing.footer.company')}</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/contact")}>{t('landing.footer.about')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/privacy")}>{t('landing.footer.privacy')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/terms")}>{t('landing.footer.terms')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/contact")}>{t('landing.footer.careers')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>{t('landing.footer.copyright')}</p>
          <p className="mt-2 text-sm">Powered by REXX AI</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
