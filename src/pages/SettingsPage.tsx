
import React from "react";
import { BrandingSettings } from "@/components/settings/BrandingSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const SettingsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Settings className="h-8 w-8" />
          {t('settings.title')}
        </h1>
        <p className="text-gray-600">{t('settings.account')}</p>
      </div>

      <div className="space-y-6">
        <BrandingSettings />
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.branding')}</CardTitle>
            <CardDescription>
              {t('settings.preferences')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• {t('settings.companyName')}</li>
              <li>• {t('settings.contactEmail')}</li>
              <li>• {t('settings.contactPhone')}</li>
              <li>• {t('settings.address')}</li>
              <li>• {t('settings.brandColors')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
