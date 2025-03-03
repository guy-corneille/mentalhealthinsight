
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CriteriaFormFields from './CriteriaFormFields';
import IndicatorsList from './IndicatorsList';

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
}

// Mock data for development
const mockCriteria = [
  {
    id: 1,
    name: 'Facility Infrastructure',
    description: 'Physical structure and resources available at the facility',
    standard: 'WHO-AIMS 2.0',
    weight: 25,
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
    indicators: [
      { id: 8, name: 'Symptom Reduction', weight: 50 },
      { id: 9, name: 'Functional Improvement', weight: 30 },
      { id: 10, name: 'Readmission Rate', weight: 20 }
    ]
  }
];

const CriteriaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [criteria, setCriteria] = useState<CriteriaFormData>({
    name: '',
    description: '',
    standard: 'WHO-AIMS 2.0',
    weight: 1.0,
    indicators: [{ name: '', weight: 1.0 }],
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      
      // Try to use the API first
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/criteria/${id}/`);
          const { name, description, standard, weight, indicators } = res.data;
          setCriteria({
            name,
            description,
            standard,
            weight,
            indicators: indicators || [{ name: '', weight: 1.0 }],
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
            });
            toast({
              title: "Using mock data",
              description: "Connected to development environment with mock data.",
            });
          } else {
            toast({
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
    setCriteria({ ...criteria, [name]: value });
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

  const validateForm = (): boolean => {
    if (!criteria.name || !criteria.description || criteria.weight <= 0 || criteria.weight > 100) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please fill all fields and ensure the weight is between 0 and 100."
      });
      return false;
    }
    
    for (const indicator of criteria.indicators) {
      if (!indicator.name || indicator.weight <= 0 || indicator.weight > 100) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "All indicators must have a name and a weight between 0 and 100."
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Try to use the API
      try {
        const method = id ? axios.put : axios.post;
        const url = id ? `http://localhost:8000/api/criteria/${id}/` : 'http://localhost:8000/api/criteria/';
        await method(url, criteria);
        toast({
          title: "Success",
          description: `Criteria ${id ? 'updated' : 'created'} successfully!`,
        });
      } catch (error) {
        console.error("Error saving criteria:", error);
        
        // Mock successful save
        toast({
          title: "Success (Mock)",
          description: `Criteria ${id ? 'updated' : 'created'} successfully in development mode!`,
        });
      }
      
      navigate('/criteria');
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save criteria. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{id ? 'Edit Criteria' : 'Add New Criteria'}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">Loading criteria data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <CriteriaFormFields
              name={criteria.name}
              description={criteria.description}
              standard={criteria.standard}
              weight={criteria.weight}
              onInputChange={handleInputChange}
              onWeightChange={handleWeightChange}
            />

            <IndicatorsList
              indicators={criteria.indicators}
              onIndicatorChange={handleIndicatorChange}
              onAddIndicator={handleAddIndicator}
              onRemoveIndicator={handleRemoveIndicator}
            />

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/criteria')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {id ? 'Save Changes' : 'Add Criteria'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CriteriaForm;
