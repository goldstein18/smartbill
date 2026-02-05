
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ManualEntryDialog } from "./ManualEntryDialog";
import { useLanguage } from "@/context/LanguageContext";

interface AddEntryButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddEntryButton({ variant = "default", size = "sm", className }: AddEntryButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        onClick={() => setDialogOpen(true)}
        className={className}
      >
        <Plus className="h-4 w-4 mr-1" /> {t('activities.addEntry')}
      </Button>
      <ManualEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
