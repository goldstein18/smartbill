
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MergeToggleProps {
  isMerged: boolean;
  onToggle: (value: boolean) => void;
}

export const MergeToggle: React.FC<MergeToggleProps> = ({ isMerged, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Toggle
                pressed={isMerged}
                onPressedChange={onToggle}
                aria-label="Toggle merge view"
                className="data-[state=on]:bg-primary"
              >
                {isMerged ? "Merged" : "Detailed"}
              </Toggle>
              <Label htmlFor="merge-toggle" className="text-sm cursor-pointer">
                {isMerged ? "Merged View" : "Detailed View"}
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isMerged
                ? "Showing entries with same window title merged (all entries within the same day)"
                : "Showing all individual time entries without merging"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
