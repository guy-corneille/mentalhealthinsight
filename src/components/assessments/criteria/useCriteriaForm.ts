import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { validateCriteria } from './CriteriaValidation';
import { AssessmentCriteria, Indicator } from '@/services/criteriaService';

interface CriteriaFormData {
  name: string;
  category: string;
  description: string;
  guidance?: string;
  weight: number;
  indicators: Indicator[];
  type: 'assessment' | 'audit';
  standard?: string;
}

export const useCriteriaForm = (id?: string, defaultType?: 'assessment' | 'audit') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract type from URL query params if present
  const urlParams = new URLSearchParams(location.search);
  const typeFromUrl = urlParams.get('type') as 'assessment' | 'audit' | null;
  
  // Set initial type based on priority: defaultType, URL param, or default to 'assessment'
  const initialType = defaultType || (typeFromUrl as 'assessment' | 'audit') || 'assessment';
  
  const [criteria, setCriteria] = useState<CriteriaFormData>({
    name: '',
    category: '',
    description: '',
    guidance: '',
    weight: 1.0,
    indicators: [{ name: '', weight: 1.0 }],
    type: initialType,
    standard: initialType === 'assessment' ? 'PHQ-9' : 'WHO-AIMS 2.0'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/criteria/${id}/`);
          const { name, description, category, guidance, weight, indicators, type } = res.data;
          setCriteria({
            name,
            category,
            description,
            guidance,
            weight: weight || 1.0,
            indicators: indicators || [{ name: '', weight: 1.0 }],
            type: type as 'assessment' | 'audit' || 'assessment',
            standard: type as 'assessment' | 'audit' === 'assessment' ? 'PHQ-9' : 'WHO-AIMS 2.0'
          });
        } catch (error) {
          console.error('Error fetching criteria:', error);
          toast({
            variant: "destructive",
            title: "Error loading criteria",
            description: "Could not find the requested criteria.",
          });
          navigate('/criteria');
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
      setCriteria(prev => ({ ...prev, type: newType, standard: newStandard }));
    } else {
      setCriteria(prev => ({ ...prev, [name]: value }));
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
      
      const method = id ? axios.put : axios.post;
      const url = id ? `http://localhost:8000/api/criteria/${id}/` : 'http://localhost:8000/api/criteria/';
      await method(url, criteria);
      toast({
        title: "Success",
        description: `Criteria ${id ? 'updated' : 'created'} successfully!`,
      });
      
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

  return {
    criteria,
    isLoading,
    handleInputChange,
    handleWeightChange,
    handleIndicatorChange,
    handleAddIndicator,
    handleRemoveIndicator,
    handleSubmit
  };
};
