
import React from "react";
import { AddEntryButton } from "@/components/time-entry/AddEntryButton";
import { MergeToggle } from "@/components/ui-custom/MergeToggle";
import { useLanguage } from "@/context/LanguageContext";

interface ActivitiesHeaderProps {
  showMerged: boolean;
  onToggleMerge: (value: boolean) => void;
}

export const ActivitiesHeader: React.FC<ActivitiesHeaderProps> = ({
  showMerged,
  onToggleMerge,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <h1 className="text-2xl font-bold">{t('activities.title')}</h1>
      <div className="flex items-center gap-2">
        <AddEntryButton />
        <MergeToggle 
          isMerged={showMerged} 
          onToggle={onToggleMerge} 
        />
      </div>
    </div>
  );
};
