
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import CriteriaFormFields from './CriteriaFormFields';
import IndicatorsList from './IndicatorsList';
import { useAssessmentCriterion, useCreateAssessmentCriteria, useUpdateAssessmentCriteria } from '@/services/criteriaService';
import { useToast } from '@/hooks/use-toast';

interface CriteriaFormProps {
  criteriaType?: 'assessment' | 'audit';
}

// Define the allowed category and purpose types to match what CriteriaFormFields expects
type CriteriaCategory = 'Clinical' | 'Facility' | 'Administrative' | 'Ethical' | 'Quality Improvement';
type CriteriaPurpose = 'Assessment' | 'Audit';

const CriteriaForm: React.FC<CriteriaFormProps> = ({ criteriaType }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Form state with proper types
  const [formData, setFormData] = React.useState({
    name: '',
    category: 'Clinical' as CriteriaCategory, // Explicitly type this
    description: '',
    purpose: criteriaType === 'audit' ? 'Audit' as CriteriaPurpose : 'Assessment' as CriteriaPurpose,
    indicators: [{ name: '', weight: 1.0 }]
  });

  // Get criterion if editing
  const { data: criterion, isLoading: isLoadingCriterion } = useAssessmentCriterion(
    id ? parseInt(id) : 0,
    { enabled: !!id }
  );

  // Mutations for create and update
  const createMutation = useCreateAssessmentCriteria();
  const updateMutation = useUpdateAssessmentCriteria(id ? parseInt(id) : 0);
  
  const isLoading = isLoadingCriterion || createMutation.isPending || updateMutation.isPending;

  // Populate form when editing existing criterion
  useEffect(() => {
    if (criterion) {
      setFormData({
        name: criterion.name,
        category: criterion.category as CriteriaCategory, // Cast to the correct type
        description: criterion.description || '',
        purpose: criterion.purpose || 'Assessment' as CriteriaPurpose,
        indicators: criterion.indicators?.length 
          ? criterion.indicators 
          : [{ name: '', weight: 1.0 }]
      });
    }
  }, [criterion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fix for the indicator change handler to properly type the field and value
  const handleIndicatorChange = (index: number, field: keyof typeof formData.indicators[0], value: string | number) => {
    const newIndicators = [...formData.indicators];
    if (field === 'name' && typeof value === 'string') {
      newIndicators[index].name = value;
    } else if (field === 'weight' && typeof value === 'number') {
      newIndicators[index].weight = value;
    }
    setFormData(prev => ({ ...prev, indicators: newIndicators }));
  };

  const handleAddIndicator = () => {
    setFormData(prev => ({
      ...prev,
      indicators: [...prev.indicators, { name: '', weight: 1.0 }]
    }));
  };

  const handleRemoveIndicator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      indicators: prev.indicators.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Name and category are required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Validate indicators
    const validIndicators = formData.indicators.filter(ind => ind.name.trim() !== '');
    if (validIndicators.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one indicator is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const criteriaData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        purpose: formData.purpose,
        indicators: validIndicators
      };
      
      if (id) {
        // Update existing criterion
        await updateMutation.mutateAsync(criteriaData);
        toast({
          title: "Success",
          description: "Criterion updated successfully"
        });
      } else {
        // Create new criterion
        await createMutation.mutateAsync(criteriaData);
        toast({
          title: "Success",
          description: "New criterion created successfully"
        });
      }
      
      // Navigate back to criteria list
      navigate('/criteria');
    } catch (error) {
      console.error("Error saving criterion:", error);
      toast({
        title: "Error",
        description: "Failed to save criterion. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {id ? 'Edit Criteria' : `Add New ${formData.purpose} Criteria`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !formData.name ? (
          <div className="py-8 text-center flex justify-center items-center">
            <Spinner size="lg" />
            <span className="ml-2">Loading criteria data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <CriteriaFormFields
              name={formData.name}
              description={formData.description}
              category={formData.category}
              purpose={formData.purpose}
              onInputChange={handleInputChange}
            />

            <IndicatorsList
              indicators={formData.indicators}
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
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" size="sm" />
                    {id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  id ? 'Update Criteria' : 'Add Criteria'
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CriteriaForm;
