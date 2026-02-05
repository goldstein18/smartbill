
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface SmartProtectedRouteProps {
  children: React.ReactNode;
}

const SmartProtectedRoute: React.FC<SmartProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, onboardingCompleted } = useSupabaseAuth();

  console.log("SmartProtectedRoute - user:", user?.email, "isLoading:", isLoading, "onboardingCompleted:", onboardingCompleted);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    console.log("SmartProtectedRoute - No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Authenticated but onboarding not completed - redirect to onboarding
  if (!onboardingCompleted) {
    console.log("SmartProtectedRoute - User authenticated but onboarding not completed, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  // Authenticated and onboarding completed - show protected content
  console.log("SmartProtectedRoute - User authenticated and onboarding completed, showing content");
  return <>{children}</>;
};

export default SmartProtectedRoute;
