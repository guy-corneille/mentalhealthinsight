
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check, FileText, Save } from 'lucide-react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  
  // Mock data for development - now only showing assessment-type criteria
  const mockCriteria: Criterion[] = [
    {
      id: 4,
      name: 'Depression Evaluation',
      description: 'Assessment criteria for evaluating depression symptoms and severity',
      standard: 'PHQ-9',
      weight: 30,
      type: 'assessment',
      indicators: [
        { id: 11, name: 'Depressed Mood', weight: 25, score: 0 },
        { id: 12, name: 'Loss of Interest', weight: 25, score: 0 },
        { id: 13, name: 'Sleep Disturbance', weight: 15, score: 0 },
        { id: 14, name: 'Fatigue', weight: 15, score: 0 },
        { id: 15, name: 'Appetite Changes', weight: 10, score: 0 },
        { id: 16, name: 'Concentration Issues', weight: 10, score: 0 }
      ]
    },
    {
      id: 5,
      name: 'Anxiety Assessment',
      description: 'Evaluation of anxiety symptoms and their impact on daily functioning',
      standard: 'GAD-7',
      weight: 25,
      type: 'assessment',
      indicators: [
        { id: 17, name: 'Nervousness', weight: 20, score: 0 },
        { id: 18, name: 'Worry Control', weight: 20, score: 0 },
        { id: 19, name: 'Restlessness', weight: 20, score: 0 },
        { id: 20, name: 'Irritability', weight: 20, score: 0 },
        { id: 21, name: 'Fear', weight: 20, score: 0 }
      ]
    },
    {
      id: 6,
      name: 'Cognitive Function',
      description: 'Assessment of cognitive abilities and impairments',
      standard: 'Custom',
      weight: 20,
      type: 'assessment',
      indicators: [
        { id: 22, name: 'Memory', weight: 25, score: 0 },
        { id: 23, name: 'Attention', weight: 25, score: 0 },
        { id: 24, name: 'Problem Solving', weight: 25, score: 0 },
        { id: 25, name: 'Decision Making', weight: 25, score: 0 }
      ]
    },
    {
      id: 7,
      name: 'Social Functioning',
      description: 'Evaluation of social relationships and community integration',
      standard: 'Custom',
      weight: 15,
      type: 'assessment',
      indicators: [
        { id: 26, name: 'Interpersonal Relationships', weight: 34, score: 0 },
        { id: 27, name: 'Social Engagement', weight: 33, score: 0 },
        { id: 28, name: 'Community Participation', weight: 33, score: 0 }
      ]
    }
  ];
  
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  
  useEffect(() => {
    // In a real app, fetch the assessment criteria from the API
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from API
        const response = await axios.get('http://localhost:8000/api/criteria/', {
          params: { type: 'assessment' }
        });
        
        if (response.data && response.data.length > 0) {
          // Transform API data to include score property
          const criteriaWithScores = response.data.map((criterion: Criterion) => ({
            ...criterion,
            indicators: criterion.indicators.map(indicator => ({
              ...indicator,
              score: 0
            }))
          }));
          setCriteria(criteriaWithScores);
        } else {
          // Fallback to mock data
          setCriteria(mockCriteria);
        }
      } catch (error) {
        console.error('Error fetching criteria:', error);
        // Fallback to mock data
        setCriteria(mockCriteria);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCriteria();
  }, []);
  
  const handleScoreChange = (criterionIndex: number, indicatorIndex: number, score: number) => {
    const newCriteria = [...criteria];
    newCriteria[criterionIndex].indicators[indicatorIndex].score = score;
    setCriteria(newCriteria);
    
    // Calculate overall score
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    for (const criterion of newCriteria) {
      let criterionScore = 0;
      let criterionTotalWeight = 0;
      
      for (const indicator of criterion.indicators) {
        criterionScore += (indicator.score * indicator.weight);
        criterionTotalWeight += indicator.weight;
      }
      
      const weightedCriterionScore = criterionTotalWeight > 0 
        ? (criterionScore / criterionTotalWeight) * criterion.weight 
        : 0;
      
      totalWeightedScore += weightedCriterionScore;
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
  
  const handleSubmit = () => {
    toast({
      title: "Assessment Completed",
      description: `Assessment for Patient ID: ${patientId} at Facility ID: ${facilityId} has been saved.`,
    });
    onComplete();
  };
  
  const getCurrentCriterion = () => criteria[currentStep];
  
  const getProgressPercentage = () => {
    return ((currentStep + 1) / criteria.length) * 100;
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center">
          Loading assessment criteria...
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Patient Assessment</CardTitle>
        <CardDescription>
          Evaluate patient {patientId} at facility {facilityId}
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
                      <div className="flex items-center gap-3">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={indicator.score}
                          onChange={(e) => handleScoreChange(currentStep, i, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {indicator.score}%
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
                          <span className="font-medium">{indicator.score}%</span>
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
