
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CriteriaFormFields from './CriteriaFormFields';
import IndicatorsList from './IndicatorsList';
import { useCriteriaForm } from './criteria/useCriteriaForm';

const CriteriaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    criteria,
    isLoading,
    handleInputChange,
    handleWeightChange,
    handleIndicatorChange,
    handleAddIndicator,
    handleRemoveIndicator,
    handleSubmit,
  } = useCriteriaForm(id);

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
