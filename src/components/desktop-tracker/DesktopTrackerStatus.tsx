
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Download, Copy, User } from "lucide-react";
import { toast } from "sonner";

export const DesktopTrackerStatus: React.FC = () => {
  const { user } = useSupabaseAuth();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDownload = () => {
    const downloadUrl = "https://eussxomitqyumgsuuflq.supabase.co/storage/v1/object/sign/smartbill-installer/smartbill-tracker%20Setup%201.0.0.exe?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMmI2NTA3Ny0wYzc0LTQ2NGQtOWFlZi0yYTZjYWU1YzI5ZTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzbWFydGJpbGwtaW5zdGFsbGVyL3NtYXJ0YmlsbC10cmFja2VyIFNldHVwIDEuMC4wLmV4ZSIsImlhdCI6MTc1MDI3MTU5OSwiZXhwIjoxNzUwODc2Mzk5fQ.txokrQn7lvnifxhaAOwjMtMsHyYgSPeYahNBxKrvfZQ";
    window.open(downloadUrl, '_blank');
    toast.success("Download started!");
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Desktop Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download Button */}
        <Button
          onClick={handleDownload}
          className="w-full flex items-center gap-2"
          size="lg"
        >
          <Download className="h-4 w-4" />
          Download for Windows
        </Button>

        {/* User ID Section */}
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Your User ID:</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono">
              {user.id}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(user.id, "User ID")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
