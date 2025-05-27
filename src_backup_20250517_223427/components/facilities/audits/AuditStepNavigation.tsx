
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRightIcon,
  BarChart3Icon,
  SaveIcon
} from 'lucide-react';
import { AuditStepNavigationProps } from './types';

const AuditStepNavigation: React.FC<AuditStepNavigationProps> = ({
  overallScore,
  isFirstStep,
  isLastStep,
  prevStep,
  nextStep,
  handleSubmitAudit,
  loading
}) => {
  return (
    <div className="flex items-center justify-between pt-2 border-t">
      <div className="flex items-center">
        <BarChart3Icon className="h-5 w-5 mr-2 text-muted-foreground" />
        <span className="text-muted-foreground">Current Score: {overallScore}%</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        
        {isLastStep ? (
          <Button 
            onClick={handleSubmitAudit}
            disabled={loading}
            className="bg-healthiq-600 hover:bg-healthiq-700"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Complete Audit
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            className="bg-healthiq-600 hover:bg-healthiq-700"
          >
            Next
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuditStepNavigation;
