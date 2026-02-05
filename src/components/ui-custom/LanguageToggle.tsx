
import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 px-3 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white shadow-sm font-medium flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'ES' : 'EN'}
    </Button>
  );
};
