
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scale, Play, Database } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-brand-100 via-white to-brand-50 p-6">
      <div className="max-w-lg w-full bg-white/90 rounded-2xl shadow-xl p-8 space-y-8 border border-brand-200">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10 text-brand-700" />
            <span className="text-4xl font-bold text-brand-700 drop-shadow-sm text-gradient-primary">SmartBill</span>
          </div>
          <p className="text-gray-600 text-center">
            Streamline your legal practice's time tracking, billing, and client management.<br />
            Effortlessly capture billable hours and maximize your firm's profitability.
          </p>
        </div>
        
        {/* Start Tracking Module */}
        <div className="flex flex-col items-center gap-4 p-6 glass rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-900">Start Tracking Your Legal Hours</h2>
          <p className="text-gray-600 text-center mb-2">Ready to optimize your time tracking? Click below to access your legal practice dashboard.</p>
          <Button
            className="text-lg px-8 py-4 bg-brand-500 hover:bg-brand-600 transition-colors flex items-center gap-2"
            onClick={() => navigate("/")}
            size="lg"
          >
            <Play className="mr-2" />
            Start Tracking
          </Button>
        </div>
        
        {/* Authentication Options */}
        <div className="flex flex-col items-center space-y-4">
          <span className="text-gray-400 text-sm">— Choose your authentication method —</span>
          
          {/* Firebase Auth (existing) */}
          <div className="w-full space-y-2">
            <p className="text-sm text-gray-600 text-center">Firebase Authentication</p>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Sign In (Firebase)
            </Button>
          </div>
          
          {/* Supabase Auth (new) */}
          <div className="w-full space-y-2">
            <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
              <Database className="h-4 w-4" />
              Supabase Authentication (New)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate("/supabase-login")}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate("/supabase-register")}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-sm text-gray-400">
        © {new Date().getFullYear()} SmartBill — Precision Billing for Legal Professionals
      </div>
    </div>
  );
};

export default HomePage;
