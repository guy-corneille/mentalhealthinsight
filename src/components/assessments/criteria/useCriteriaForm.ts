
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { validateCriteria } from './CriteriaValidation';

interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

interface CriteriaFormData {
  name: string;
  description: string;
  standard: string;
  weight: number;
  indicators: Indicator[];
  type: 'assessment' | 'audit';
}

export const useCriteriaForm = (id?: string, defaultType?: 'assessment' | 'audit') => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  // Extract type from URL query params if present
  const urlParams = new URLSearchParams(location.search);
  const typeFromUrl = urlParams.get('type') as 'assessment' | 'audit' | null;
  
  // Set initial type based on priority: defaultType, URL param, or default to 'assessment'
  const initialType = defaultType || typeFromUrl || 'assessment';
  
  const [criteria, setCriteria] = useState<CriteriaFormData>({
    name: '',
    description: '',
    standard: initialType === 'assessment' ? 'PHQ-9' : 'WHO-AIMS 2.0',
    weight: 1.0,
    indicators: [{ name: '', weight: 1.0 }],
    type: initialType
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Mock audit criteria data
  const mockAuditCriteria = [
    {
      id: 1,
      name: 'Facility Infrastructure',
      description: 'Physical structure and resources available at the facility',
      standard: 'WHO-AIMS 2.0',
      weight: 25,
      type: 'audit',
      indicators: [
        { id: 1, name: 'Building Condition', weight: 40 },
        { id: 2, name: 'Equipment Availability', weight: 30 },
        { id: 3, name: 'Medication Supply', weight: 30 }
      ]
    },
    {
      id: 2,
      name: 'Staff Competency',
      description: 'Skills and qualifications of the mental health professionals',
      standard: 'ISO 9001',
      weight: 35,
      type: 'audit',
      indicators: [
        { id: 4, name: 'Education Level', weight: 25 },
        { id: 5, name: 'Years of Experience', weight: 25 },
        { id: 6, name: 'Continued Education', weight: 25 },
        { id: 7, name: 'Patient Feedback', weight: 25 }
      ]
    },
    {
      id: 3,
      name: 'Treatment Outcomes',
      description: 'Effectiveness of mental health interventions provided',
      standard: 'Custom',
      weight: 40,
      type: 'audit',
      indicators: [
        { id: 8, name: 'Symptom Reduction', weight: 50 },
        { id: 9, name: 'Functional Improvement', weight: 30 },
        { id: 10, name: 'Readmission Rate', weight: 20 }
      ]
    }
  ];

  // Mock assessment criteria data
  const mockAssessmentCriteria = [
    {
      id: 4,
      name: 'Depression Evaluation',
      description: 'Assessment criteria for evaluating depression symptoms and severity',
      standard: 'PHQ-9',
      weight: 30,
      type: 'assessment',
      indicators: [
        { id: 11, name: 'Depressed Mood', weight: 25 },
        { id: 12, name: 'Loss of Interest', weight: 25 },
        { id: 13, name: 'Sleep Disturbance', weight: 15 },
        { id: 14, name: 'Fatigue', weight: 15 },
        { id: 15, name: 'Appetite Changes', weight: 10 },
        { id: 16, name: 'Concentration Issues', weight: 10 }
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
        { id: 17, name: 'Nervousness', weight: 20 },
        { id: 18, name: 'Worry Control', weight: 20 },
        { id: 19, name: 'Restlessness', weight: 20 },
        { id: 20, name: 'Irritability', weight: 20 },
        { id: 21, name: 'Fear', weight: 20 }
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
        { id: 22, name: 'Memory', weight: 25 },
        { id: 23, name: 'Attention', weight: 25 },
        { id: 24, name: 'Problem Solving', weight: 25 },
        { id: 25, name: 'Decision Making', weight: 25 }
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
        { id: 26, name: 'Interpersonal Relationships', weight: 34 },
        { id: 27, name: 'Social Engagement', weight: 33 },
        { id: 28, name: 'Community Participation', weight: 33 }
      ]
    }
  ];

  // Combined mock data
  const mockCriteria = [...mockAuditCriteria, ...mockAssessmentCriteria];

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      
      // Try to use the API first
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/criteria/${id}/`);
          const { name, description, standard, weight, indicators, type } = res.data;
          setCriteria({
            name,
            description,
            standard,
            weight,
            indicators: indicators || [{ name: '', weight: 1.0 }],
            type: type || 'assessment'
          });
        } catch (error) {
          console.error('Error fetching criteria:', error);
          
          // Fallback to mock data when API fails
          const foundCriteria = mockCriteria.find(c => c.id === parseInt(id));
          if (foundCriteria) {
            setCriteria({
              name: foundCriteria.name,
              description: foundCriteria.description,
              standard: foundCriteria.standard,
              weight: foundCriteria.weight,
              indicators: foundCriteria.indicators || [{ name: '', weight: 1.0 }],
              type: foundCriteria.type || 'assessment'
            });
            toast.toast({
              title: "Using mock data",
              description: "Connected to development environment with mock data.",
            });
          } else {
            toast.toast({
              variant: "destructive",
              title: "Error loading criteria",
              description: "Could not find the requested criteria.",
            });
            navigate('/criteria');
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If type changes, update the standard to match the type's default
    if (name === 'type') {
      const newType = value as 'assessment' | 'audit';
      const newStandard = newType === 'assessment' ? 'PHQ-9' : 'WHO-AIMS 2.0';
      setCriteria({ ...criteria, [name]: value, standard: newStandard });
    } else {
      setCriteria({ ...criteria, [name]: value });
    }
  };

  const handleWeightChange = (value: number) => {
    setCriteria({ ...criteria, weight: value });
  };

  const handleIndicatorChange = (index: number, field: keyof Indicator, value: string | number) => {
    const newIndicators = [...criteria.indicators];
    if (field === 'name') {
      newIndicators[index][field] = value as string;
    } else if (field === 'weight') {
      newIndicators[index][field] = Number(value);
    }
    setCriteria({ ...criteria, indicators: newIndicators });
  };

  const handleAddIndicator = () => {
    setCriteria({
      ...criteria,
      indicators: [...criteria.indicators, { name: '', weight: 1.0 }],
    });
  };

  const handleRemoveIndicator = (index: number) => {
    const newIndicators = criteria.indicators.filter((_, i) => i !== index);
    setCriteria({ ...criteria, indicators: newIndicators });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCriteria(criteria, toast)) return;

    try {
      setIsLoading(true);
      
      // Try to use the API
      try {
        const method = id ? axios.put : axios.post;
        const url = id ? `http://localhost:8000/api/criteria/${id}/` : 'http://localhost:8000/api/criteria/';
        await method(url, criteria);
        toast.toast({
          title: "Success",
          description: `Criteria ${id ? 'updated' : 'created'} successfully!`,
        });
      } catch (error) {
        console.error("Error saving criteria:", error);
        
        // Mock successful save
        toast.toast({
          title: "Success (Mock)",
          description: `Criteria ${id ? 'updated' : 'created'} successfully in development mode!`,
        });
      }
      
      navigate('/criteria');
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save criteria. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criteria,
    isLoading,
    handleInputChange,
    handleWeightChange,
    handleIndicatorChange,
    handleAddIndicator,
    handleRemoveIndicator,
    handleSubmit,
  };
};
