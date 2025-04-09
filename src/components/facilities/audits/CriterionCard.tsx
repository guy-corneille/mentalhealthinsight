
import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon,
  HelpCircleIcon 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { CriterionCardProps, Rating } from './types';

const CriterionCard: React.FC<CriterionCardProps> = ({
  criterion,
  rating,
  onRatingChange,
  onNotesChange
}) => {
  // Get appropriate class for button based on rating
  const getRatingButtonClass = (currentRating: Rating, buttonRating: Rating) => {
    if (currentRating !== buttonRating) return "";
    
    switch (buttonRating) {
      case "pass": return "bg-emerald-600 hover:bg-emerald-700";
      case "good": return "bg-green-600 hover:bg-green-700";
      case "partial": return "bg-amber-600 hover:bg-amber-700";
      case "limited": return "bg-orange-600 hover:bg-orange-700";
      case "fail": return "bg-rose-600 hover:bg-rose-700";
      case "not-applicable": return "bg-slate-600 hover:bg-slate-700";
      default: return "";
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{criterion.description}</CardTitle>
            <CardDescription>{criterion.category} (Weight: {criterion.weight})</CardDescription>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircleIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>{criterion.guidance}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={rating.rating === "pass" ? "default" : "outline"}
              className={getRatingButtonClass(rating.rating, "pass")}
              onClick={() => onRatingChange(criterion.id, "pass")}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Pass (100%)
            </Button>
            <Button
              variant={rating.rating === "good" ? "default" : "outline"}
              className={getRatingButtonClass(rating.rating, "good")}
              onClick={() => onRatingChange(criterion.id, "good")}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Good (75%)
            </Button>
            <Button
              variant={rating.rating === "partial" ? "default" : "outline"}
              className={getRatingButtonClass(rating.rating, "partial")}
              onClick={() => onRatingChange(criterion.id, "partial")}
            >
              <AlertCircleIcon className="h-4 w-4 mr-2" />
              Partial (50%)
            </Button>
            <Button
              variant={rating.rating === "limited" ? "default" : "outline"}
              className={getRatingButtonClass(rating.rating, "limited")}
              onClick={() => onRatingChange(criterion.id, "limited")}
            >
              <AlertCircleIcon className="h-4 w-4 mr-2" />
              Limited (25%)
            </Button>
            <Button
              variant={rating.rating === "fail" ? "default" : "outline"}
              className={getRatingButtonClass(rating.rating, "fail")}
              onClick={() => onRatingChange(criterion.id, "fail")}
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              Fail (0%)
            </Button>
            <Button
              variant={rating.rating === "not-applicable" ? "default" : "outline"}
              className={getRatingButtonClass(rating.rating, "not-applicable")}
              onClick={() => onRatingChange(criterion.id, "not-applicable")}
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              N/A
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <label htmlFor={`notes-${criterion.id}`} className="text-sm font-medium">
              Notes / Observations
            </label>
            <Textarea
              id={`notes-${criterion.id}`}
              placeholder="Enter observation notes..."
              value={rating.notes || ""}
              onChange={(e) => onNotesChange(criterion.id, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriterionCard;
