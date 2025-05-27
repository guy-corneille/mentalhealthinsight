
import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { StepProgressProps } from './types';

const StepProgress: React.FC<StepProgressProps> = ({ 
  step, 
  categories, 
  totalSteps,
  setStep 
}) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        {categories.map((category, idx) => (
          <button
            key={idx}
            className={`text-sm font-medium ${idx === step ? 'text-healthiq-600' : 'text-muted-foreground'} ${idx < step ? 'text-emerald-600' : ''}`}
            onClick={() => setStep(idx)}
          >
            {idx < step ? (
              <CheckCircleIcon className="h-5 w-5 inline mr-1 text-emerald-500" />
            ) : idx === step ? (
              <span className="inline-block h-5 w-5 rounded-full bg-healthiq-600 text-white text-xs font-bold flex items-center justify-center mr-1">
                {idx + 1}
              </span>
            ) : (
              <span className="inline-block h-5 w-5 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center mr-1">
                {idx + 1}
              </span>
            )}
            {category}
          </button>
        ))}
      </div>
      <Progress value={step / (totalSteps - 1) * 100} className="h-2" />
    </div>
  );
};

export default StepProgress;
