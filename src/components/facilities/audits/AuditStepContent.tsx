
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from 'lucide-react';
import CriterionCard from './CriterionCard';
import { AuditStepContentProps, Rating } from './types';

const AuditStepContent: React.FC<AuditStepContentProps> = ({
  step,
  categories,
  currentCriteria,
  stepCompletion,
  ratings,
  handleRatingChange,
  handleNotesChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{categories[step]}</h3>
        <Badge variant="outline" className={stepCompletion === 100 ? "bg-emerald-50 text-emerald-600" : ""}>
          {stepCompletion === 100 ? (
            <CheckCircleIcon className="h-3 w-3 mr-1" />
          ) : null}
          {stepCompletion}% Complete
        </Badge>
      </div>
      
      {currentCriteria.map(criterion => (
        <CriterionCard
          key={criterion.id}
          criterion={criterion}
          rating={ratings[criterion.id]?.rating || "not-rated"}
          onRatingChange={handleRatingChange}
          onNotesChange={handleNotesChange}
        />
      ))}
      
      {currentCriteria.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No criteria defined for this category.
        </div>
      )}
    </div>
  );
};

export default AuditStepContent;
