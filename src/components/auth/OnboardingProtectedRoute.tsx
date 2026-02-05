
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface OnboardingProtectedRouteProps {
  children: React.ReactNode;
}

const OnboardingProtectedRoute: React.FC<OnboardingProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, onboardingCompleted } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Already completed onboarding - redirect to dashboard
  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and onboarding not completed - show onboarding
  return <>{children}</>;
};

export default OnboardingProtectedRoute;
