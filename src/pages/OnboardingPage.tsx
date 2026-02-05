
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OnboardingWelcome } from "@/components/onboarding/OnboardingWelcome";
import { OnboardingAddClient } from "@/components/onboarding/OnboardingAddClient";
import { OnboardingDesktopApp } from "@/components/onboarding/OnboardingDesktopApp";
import { OnboardingInvoicePreview } from "@/components/onboarding/OnboardingInvoicePreview";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setIsCompleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Welcome to SmartBill! Let's start tracking your time.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingWelcome />;
      case 2:
        return <OnboardingAddClient onSkip={handleNext} onAdded={handleNext} />;
      case 3:
        return <OnboardingDesktopApp onActivityDetected={handleComplete} />;
      case 4:
        return <OnboardingInvoicePreview onComplete={handleComplete} isCompleting={isCompleting} />;
      default:
        return <OnboardingWelcome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track every billable hour. Bill accurately. Work stress-free.</h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <Button variant="ghost" size="sm" onClick={handleSkip} disabled={isCompleting}>
                Skip for now
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentStep < totalSteps && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 1 ? "Start" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
