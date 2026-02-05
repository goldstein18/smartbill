
import UserProfileForm from "@/components/auth/UserProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
      <p className="text-muted-foreground">
        {t('profile.subtitle')}
      </p>
      
      <div className="grid gap-6 md:grid-cols-1">
        <UserProfileForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('profile.gettingStarted')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('profile.gettingStartedDescription')}
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/onboarding")}
          >
            {t('profile.viewOnboardingGuide')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
