
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Scale } from "lucide-react";

const LoginPage = () => {
  const { user, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-100 via-white to-brand-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10 text-brand-700" />
            <span className="text-4xl font-bold text-brand-700">SmartBill</span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
