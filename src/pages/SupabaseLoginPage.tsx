
import SupabaseLoginForm from "@/components/auth/SupabaseLoginForm";
import { Scale } from "lucide-react";

const SupabaseLoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10 text-accent" />
            <span className="text-4xl font-bold text-white">SmartBill</span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>
        
        <div className="bg-card rounded-lg p-8 shadow-lg">
          <SupabaseLoginForm />
        </div>
      </div>
    </div>
  );
};

export default SupabaseLoginPage;
