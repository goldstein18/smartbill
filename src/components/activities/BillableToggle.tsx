
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, DollarSign, Undo2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BillableToggleProps {
  isBillable: boolean;
  onToggle: (isBillable: boolean) => void;
  size?: "sm" | "default";
}

export const BillableToggle: React.FC<BillableToggleProps> = ({
  isBillable,
  onToggle,
  size = "default"
}) => {
  const { t } = useLanguage();
  const [showUndo, setShowUndo] = useState(false);
  const [previousState, setPreviousState] = useState(isBillable);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showUndo) {
      timeoutId = setTimeout(() => {
        setShowUndo(false);
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showUndo]);

  const handleToggle = () => {
    setPreviousState(isBillable);
    const newState = !isBillable;
    onToggle(newState);
    setShowUndo(true);
    
    if (newState) {
      toast.success("Marked as billable", {
        action: {
          label: "Undo",
          onClick: handleUndo
        }
      });
    } else {
      toast.success("Marked as unbillable", {
        action: {
          label: "Undo", 
          onClick: handleUndo
        }
      });
    }
  };

  const handleUndo = () => {
    onToggle(previousState);
    setShowUndo(false);
    toast.success("Change undone");
  };

  const buttonSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={isBillable ? "default" : "outline"}
        size="icon"
        className={`${buttonSize} ${isBillable ? 'bg-green-600 hover:bg-green-700' : 'border-orange-300 hover:bg-orange-50'}`}
        onClick={handleToggle}
        title={isBillable ? t('common.billable') : t('common.unbillable')}
      >
        {isBillable ? (
          <DollarSign className={iconSize} />
        ) : (
          <Clock className={iconSize} />
        )}
      </Button>
      
      {showUndo && (
        <Button
          variant="ghost"
          size="icon"
          className={`${buttonSize} text-blue-600 hover:text-blue-700 hover:bg-blue-50`}
          onClick={handleUndo}
          title="Undo"
        >
          <Undo2 className={iconSize} />
        </Button>
      )}
    </div>
  );
};
