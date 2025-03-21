
import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  ArrowRightIcon, 
  BarChart3Icon, 
  HelpCircleIcon,
  SaveIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface AuditFormProps {
  facilityId: number;
  facilityName: string;
}

// Define the audit criterion structure
interface AuditCriterion {
  id: string;
  category: string;
  description: string;
  guidance: string;
  weight: number;
}

// Define the rating type
type Rating = "pass" | "fail" | "partial" | "not-rated";

// Map of criteria IDs to their ratings
type CriteriaRatings = Record<string, {
  rating: Rating;
  notes: string;
}>;

const AuditForm: React.FC<AuditFormProps> = ({ facilityId, facilityName }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<CriteriaRatings>({});
  const [loading, setLoading] = useState(false);
  
  // Audit criteria based on mental health facility standards
  const auditCriteria: AuditCriterion[][] = [
    // Infrastructure and Safety
    [
      {
        id: "inf-1",
        category: "Infrastructure",
        description: "Facility has adequate physical space for patient care",
        guidance: "Examine if rooms, corridors, and common areas meet size standards for mental health facilities",
        weight: 3
      },
      {
        id: "inf-2",
        category: "Infrastructure",
        description: "Safety features are in place for patient protection",
        guidance: "Check for secured windows, anti-ligature fixtures, emergency call systems",
        weight: 5
      },
      {
        id: "inf-3",
        category: "Infrastructure",
        description: "Accessibility accommodations for persons with disabilities",
        guidance: "Verify ramps, handrails, accessible restrooms, and other accessibility features",
        weight: 4
      },
      {
        id: "inf-4",
        category: "Infrastructure",
        description: "Appropriate separation of high-risk and lower-risk patients",
        guidance: "Evaluate physical layout for proper patient separation based on acuity levels",
        weight: 4
      }
    ],
    // Staffing and Training
    [
      {
        id: "staff-1",
        category: "Staffing",
        description: "Adequate staffing ratios for patient population",
        guidance: "Review staff schedules and patient census, compare to recommended ratios",
        weight: 5
      },
      {
        id: "staff-2",
        category: "Staffing",
        description: "Staff have appropriate qualifications and licensing",
        guidance: "Check credentials for clinical staff against regulatory requirements",
        weight: 5
      },
      {
        id: "staff-3",
        category: "Staffing",
        description: "Regular training on crisis management and de-escalation",
        guidance: "Review training records for frequency and comprehensiveness",
        weight: 4
      },
      {
        id: "staff-4",
        category: "Staffing",
        description: "Staff receive suicide prevention and assessment training",
        guidance: "Verify training records and knowledge through staff interviews",
        weight: 5
      }
    ],
    // Treatment and Care
    [
      {
        id: "care-1",
        category: "Treatment",
        description: "Individualized treatment plans for all patients",
        guidance: "Review sample of patient charts for comprehensive treatment planning",
        weight: 4
      },
      {
        id: "care-2",
        category: "Treatment",
        description: "Evidence-based therapeutic interventions",
        guidance: "Observe therapy sessions, review documentation of interventions",
        weight: 4
      },
      {
        id: "care-3",
        category: "Treatment",
        description: "Appropriate medication management protocols",
        guidance: "Review medication administration records and prescribing practices",
        weight: 5
      },
      {
        id: "care-4",
        category: "Treatment",
        description: "Discharge planning begins at admission",
        guidance: "Verify discharge planning documentation in patient records",
        weight: 3
      }
    ],
    // Rights and Dignity
    [
      {
        id: "rights-1",
        category: "Rights",
        description: "Patient rights are clearly communicated",
        guidance: "Check for posted rights information, admission materials",
        weight: 3
      },
      {
        id: "rights-2",
        category: "Rights",
        description: "Complaint/grievance process is accessible to patients",
        guidance: "Review complaint process documentation and resolution records",
        weight: 3
      },
      {
        id: "rights-3",
        category: "Rights",
        description: "Privacy and confidentiality practices meet standards",
        guidance: "Observe patient interactions, review information sharing protocols",
        weight: 4
      },
      {
        id: "rights-4",
        category: "Rights",
        description: "Procedures for informed consent are followed",
        guidance: "Review consent forms and documentation of consent process",
        weight: 4
      }
    ]
  ];

  const categories = ["Infrastructure & Safety", "Staffing & Training", "Treatment & Care", "Rights & Dignity"];

  // Rating utilities
  const getRatingValue = (rating: Rating): number => {
    switch (rating) {
      case "pass": return 1;
      case "partial": return 0.5;
      case "fail": return 0;
      default: return 0;
    }
  };

  // Calculate completion rate for current step
  const getStepCompletionRate = (): number => {
    const currentCriteria = auditCriteria[step];
    let ratedCount = 0;
    
    currentCriteria.forEach(criterion => {
      if (ratings[criterion.id]?.rating && ratings[criterion.id].rating !== "not-rated") {
        ratedCount++;
      }
    });
    
    return (ratedCount / currentCriteria.length) * 100;
  };

  // Calculate overall score
  const calculateScore = (): number => {
    let totalScore = 0;
    let totalWeight = 0;
    
    auditCriteria.flat().forEach(criterion => {
      if (ratings[criterion.id]?.rating && ratings[criterion.id].rating !== "not-rated") {
        totalScore += getRatingValue(ratings[criterion.id].rating) * criterion.weight;
        totalWeight += criterion.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  };

  // Handler for rating a criterion
  const handleRatingChange = (criterionId: string, rating: Rating) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        rating
      }
    }));
  };

  // Handler for updating notes
  const handleNotesChange = (criterionId: string, notes: string) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId] || { rating: "not-rated" },
        notes
      }
    }));
  };

  // Handler for submitting the audit
  const handleSubmitAudit = () => {
    setLoading(true);
    
    // In a real app, this would send data to an API
    setTimeout(() => {
      const score = calculateScore();
      
      toast({
        title: "Audit Completed",
        description: `Facility audit for ${facilityName} completed with a score of ${score}%.`,
      });
      
      setLoading(false);
      
      // Close the dialog
      const closeButton = document.querySelector('[data-dialog-close]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
      
      // In a real app, we'd refresh the audit history
    }, 1500);
  };

  // Navigate to next/previous step
  const nextStep = () => {
    if (step < auditCriteria.length - 1) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const isLastStep = step === auditCriteria.length - 1;
  const isFirstStep = step === 0;
  const stepCompletion = getStepCompletionRate();
  const overallScore = calculateScore();

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
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
        <Progress value={step / (auditCriteria.length - 1) * 100} className="h-2" />
      </div>
      
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
        
        {auditCriteria[step].map(criterion => (
          <Card key={criterion.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{criterion.description}</CardTitle>
                  <CardDescription>{criterion.category} (Weight: {criterion.weight})</CardDescription>
                </div>
                <TooltipProvider>
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
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={ratings[criterion.id]?.rating === "pass" ? "default" : "outline"}
                    className={ratings[criterion.id]?.rating === "pass" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    onClick={() => handleRatingChange(criterion.id, "pass")}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Pass
                  </Button>
                  <Button
                    variant={ratings[criterion.id]?.rating === "partial" ? "default" : "outline"}
                    className={ratings[criterion.id]?.rating === "partial" ? "bg-amber-600 hover:bg-amber-700" : ""}
                    onClick={() => handleRatingChange(criterion.id, "partial")}
                  >
                    <AlertCircleIcon className="h-4 w-4 mr-2" />
                    Partial
                  </Button>
                  <Button
                    variant={ratings[criterion.id]?.rating === "fail" ? "default" : "outline"}
                    className={ratings[criterion.id]?.rating === "fail" ? "bg-rose-600 hover:bg-rose-700" : ""}
                    onClick={() => handleRatingChange(criterion.id, "fail")}
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Fail
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
                    value={ratings[criterion.id]?.notes || ""}
                    onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
    </div>
  );
};

export default AuditForm;
