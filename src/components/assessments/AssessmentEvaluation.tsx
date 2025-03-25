
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  Save, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon,
  MinusCircleIcon,
  StarIcon,
  StarHalfIcon,
  BanIcon
} from 'lucide-react';
import { 
  type Rating, 
  getRatingValue, 
  calculateWeightedScoreWithExclusions 
} from '@/utils/ratingUtils';
import { useAssessmentCriteria } from '@/services/criteriaService';
import { usePatient } from '@/services/patientService';
import api from '@/services/api';

interface AssessmentEvaluationProps {
  patientId: string;
  facilityId: string;
  onComplete: () => void;
  onCancel: () => void;
}

interface Indicator {
  id: number;
  name: string;
  weight: number;
  score: number;
  rating: Rating;
}

interface Criterion {
  id: number;
  name: string;
  description: string;
  weight: number;
  indicators: Indicator[];
  type: 'assessment' | 'audit';
  standard: string;
}

const AssessmentEvaluation: React.FC<AssessmentEvaluationProps> = ({
  patientId,
  facilityId,
  onComplete,
  onCancel
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('evaluation');
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState('');
  const [overallScore, setOverallScore] = useState(0);
  
  // Fetch patient details
  const { data: patient } = usePatient(patientId);
  
  // Use the React Query hook to fetch criteria
  const { data: apiCriteria, isLoading, error } = useAssessmentCriteria('assessment');
  
  // State to store processed criteria with scores
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  
  // Process API data when it's received
  useEffect(() => {
    if (apiCriteria && apiCriteria.length > 0) {
      // Transform API criteria to add score and rating properties to indicators
      const criteriaWithScores = apiCriteria.map((criterion: any) => ({
        ...criterion,
        weight: calculateCriterionWeight(apiCriteria, criterion.id),
        type: 'assessment',
        standard: criterion.category, // Use category as standard for now
        indicators: criterion.indicators?.map((indicator: any) => ({
          ...indicator,
          score: 0,
          rating: "not-rated" as Rating
        })) || []
      }));
      setCriteria(criteriaWithScores);
    }
  }, [apiCriteria]);
  
  // Calculate the weight for each criterion based on total criteria count
  const calculateCriterionWeight = (criteria: any[], criterionId: number): number => {
    const totalCriteria = criteria.length;
    return totalCriteria > 0 ? Math.round(100 / totalCriteria) : 0;
  };

  const handleRatingChange = (criterionIndex: number, indicatorIndex: number, rating: Rating) => {
    const newCriteria = [...criteria];
    const score = rating === "not-applicable" ? 0 : getRatingValue(rating) * 100;
    newCriteria[criterionIndex].indicators[indicatorIndex].rating = rating;
    newCriteria[criterionIndex].indicators[indicatorIndex].score = score;
    setCriteria(newCriteria);
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    for (const criterion of newCriteria) {
      const criterionScore = calculateWeightedScoreWithExclusions(
        criterion.indicators.map(i => ({ weight: i.weight, rating: i.rating }))
      );
      
      totalWeightedScore += (criterionScore * criterion.weight);
      totalWeight += criterion.weight;
    }
    
    const calculatedOverallScore = totalWeight > 0 
      ? (totalWeightedScore / totalWeight)
      : 0;
    
    setOverallScore(Math.round(calculatedOverallScore * 10) / 10);
  };
  
  const handleNext = () => {
    if (currentStep < criteria.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setActiveTab('review');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    try {
      console.info("Making API request to: /assessments/", {
        patient: patientId,
        facility: facilityId,
        assessment_date: new Date().toISOString(),
        score: overallScore,
        notes: notes,
        criteria: criteria[0]?.id, 
        indicator_scores: criteria.flatMap(criterion => 
          criterion.indicators.map(indicator => ({
            indicator: indicator.id,
            score: indicator.score,
            rating: indicator.rating,
            notes: ''
          }))
        )
      });
      
      // Prepare assessment data
      const assessmentData = {
        patient: patientId,
        facility: facilityId,
        assessment_date: new Date().toISOString(),
        score: overallScore,
        notes: notes,
        criteria: criteria[0]?.id,
        indicator_scores: criteria.flatMap(criterion => 
          criterion.indicators.map(indicator => ({
            indicator: indicator.id,
            score: indicator.score,
            rating: indicator.rating,
            notes: ''
          }))
        )
      };
      
      // Submit assessment to API
      const response = await api.post('/assessments/', assessmentData);
      console.log('Assessment created successfully:', response);
      
      toast({
        title: "Assessment Completed",
        description: `Assessment for patient ${patientId} has been saved successfully.`,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getCurrentCriterion = () => criteria[currentStep];
  
  const getProgressPercentage = () => {
    return ((currentStep + 1) / criteria.length) * 100;
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center">
          Loading assessment criteria...
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center text-rose-600">
          Error loading assessment criteria. Please try again.
        </CardContent>
      </Card>
    );
  }
  
  if (!criteria || criteria.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center">
          No assessment criteria found. Please add criteria in the Criteria management section.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Patient Assessment</CardTitle>
        <CardDescription>
          Evaluate patient {patientId} {patient && `(${patient.first_name} ${patient.last_name})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="review">Review & Submit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="evaluation" className="space-y-4 mt-4">
            {criteria.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{getCurrentCriterion().name}</h3>
                    <p className="text-sm text-muted-foreground">{getCurrentCriterion().description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Weight: {getCurrentCriterion().weight}%
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">
                    Criterion {currentStep + 1} of {criteria.length}
                  </span>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
                
                <div className="space-y-6 my-6">
                  {getCurrentCriterion().indicators.map((indicator, i) => (
                    <div key={indicator.id} className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{indicator.name}</Label>
                        <span className="text-sm text-muted-foreground">Weight: {indicator.weight}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={indicator.rating === "pass" ? "default" : "outline"}
                            className={indicator.rating === "pass" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                            onClick={() => handleRatingChange(currentStep, i, "pass")}
                            size="sm"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Pass (100%)
                          </Button>
                          <Button
                            variant={indicator.rating === "high-partial" ? "default" : "outline"}
                            className={indicator.rating === "high-partial" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                            onClick={() => handleRatingChange(currentStep, i, "high-partial")}
                            size="sm"
                          >
                            <StarIcon className="h-4 w-4 mr-1" />
                            Good (75%)
                          </Button>
                          <Button
                            variant={indicator.rating === "partial" ? "default" : "outline"}
                            className={indicator.rating === "partial" ? "bg-amber-600 hover:bg-amber-700" : ""}
                            onClick={() => handleRatingChange(currentStep, i, "partial")}
                            size="sm"
                          >
                            <StarHalfIcon className="h-4 w-4 mr-1" />
                            Partial (50%)
                          </Button>
                          <Button
                            variant={indicator.rating === "low-partial" ? "default" : "outline"}
                            className={indicator.rating === "low-partial" ? "bg-amber-500 hover:bg-amber-600" : ""}
                            onClick={() => handleRatingChange(currentStep, i, "low-partial")}
                            size="sm"
                          >
                            <MinusCircleIcon className="h-4 w-4 mr-1" />
                            Limited (25%)
                          </Button>
                          <Button
                            variant={indicator.rating === "fail" ? "default" : "outline"}
                            className={indicator.rating === "fail" ? "bg-rose-600 hover:bg-rose-700" : ""}
                            onClick={() => handleRatingChange(currentStep, i, "fail")}
                            size="sm"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Fail (0%)
                          </Button>
                          <Button
                            variant={indicator.rating === "not-applicable" ? "default" : "outline"}
                            className={indicator.rating === "not-applicable" ? "bg-gray-600 hover:bg-gray-700" : ""}
                            onClick={() => handleRatingChange(currentStep, i, "not-applicable")}
                            size="sm"
                          >
                            <BanIcon className="h-4 w-4 mr-1" />
                            N/A
                          </Button>
                        </div>
                        <div className="w-16 text-center font-medium">
                          {indicator.rating === "not-applicable" ? "N/A" : `${indicator.score}%`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button onClick={handleNext}>
                    {currentStep < criteria.length - 1 ? (
                      <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                    ) : (
                      <>Review <Check className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                No assessment criteria found. Please add criteria in the Criteria management section.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="review" className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Assessment Summary</h3>
              <div className="text-2xl font-bold flex items-center">
                Overall Score: <span className="ml-2 text-healthiq-600">{overallScore}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{criterion.name}</h4>
                    <span className="text-sm text-muted-foreground">Weight: {criterion.weight}%</span>
                  </div>
                  
                  <div className="space-y-2">
                    {criterion.indicators.map((indicator) => (
                      <div key={indicator.id} className="flex justify-between items-center text-sm">
                        <span>{indicator.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Weight: {indicator.weight}%</span>
                          <span className="font-medium">
                            {indicator.rating === "not-applicable" ? "N/A" : `${indicator.score}%`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Enter any additional observations or notes about this assessment..."
              />
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setActiveTab('evaluation')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Evaluation
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-healthiq-600 hover:bg-healthiq-700">
                  <Save className="mr-2 h-4 w-4" /> Complete Assessment
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssessmentEvaluation;
