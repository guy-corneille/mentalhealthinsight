
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CriteriaFormFields from './CriteriaFormFields';
import IndicatorsList from './IndicatorsList';
import { useCriteriaForm } from './criteria/useCriteriaForm';

interface CriteriaFormProps {
  criteriaType?: 'assessment' | 'audit';
}

const CriteriaForm: React.FC<CriteriaFormProps> = ({ criteriaType }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If editing existing criteria, we'll get the type from the API
  // For new criteria, use the passed type from the parent
  const formType = id ? undefined : criteriaType || 'assessment';
  
  const {
    criteria,
    isLoading,
    handleInputChange,
    handleWeightChange,
    handleIndicatorChange,
    handleAddIndicator,
    handleRemoveIndicator,
    handleSubmit,
  } = useCriteriaForm(id, formType);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {id ? 'Edit Criteria' : `Add New ${formType === 'assessment' ? 'Assessment' : 'Audit'} Criteria`}
        </CardTitle>
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
              type={criteria.type}
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
