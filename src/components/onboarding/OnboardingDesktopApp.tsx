
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Zap, Copy } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { DesktopTrackerStatus } from "@/components/desktop-tracker/DesktopTrackerStatus";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const OnboardingDesktopApp: React.FC<{ onActivityDetected?: () => void }> = ({ onActivityDetected }) => {
  const { user } = useSupabaseAuth();

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      toast.success("User ID copied to clipboard!");
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    // Auto copy on mount
    try {
      navigator.clipboard.writeText(user.id);
      toast.success("User ID copied to clipboard!");
    } catch {}

    // Listen for first time entry coming from desktop to auto-continue
    const channel = supabase
      .channel('time_entries_onboarding')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'time_entries', filter: `user_id=eq.${user.id}` }, () => {
        toast.success('Tracker activity detected. Redirecting...');
        onActivityDetected?.();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, onActivityDetected]);


  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Download the Desktop App
        </h2>
        <p className="text-lg text-gray-600">
          Get the most out of SmartBill with our desktop tracker for automatic time tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Monitor className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Automatic Tracking</h3>
            <p className="text-gray-600 text-sm">Tracks time automatically based on your active applications and windows</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Real-time Sync</h3>
            <p className="text-gray-600 text-sm">Syncs automatically with your web dashboard in real-time</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Cross-platform</h3>
            <p className="text-gray-600 text-sm">Works seamlessly across Windows, macOS, and Linux</p>
          </CardContent>
        </Card>
      </div>

      {/* Single Desktop Tracker Status Component with download button */}
      <DesktopTrackerStatus />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-800 mb-2">Installation Instructions</h4>
        <ol className="list-decimal list-inside space-y-2 text-yellow-700 text-sm">
          <li>Download the desktop app using the button above</li>
          <li>Install and launch the application</li>
          <li>Enter your User ID when prompted <button onClick={copyUserId} className="underline text-yellow-800">(copy again)</button></li>
          <li>Start working - time tracking will begin automatically!</li>
        </ol>
      </div>
    </div>
  );
};
