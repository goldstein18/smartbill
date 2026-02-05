
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface SupabaseProtectedRouteProps {
  children: React.ReactNode;
}

const SupabaseProtectedRoute: React.FC<SupabaseProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/supabase-login" replace />;
  }

  return <>{children}</>;
};

export default SupabaseProtectedRoute;
