
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const CriteriaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState<CriteriaFormData>({
    name: '',
    description: '',
    standard: 'WHO-AIMS 2.0',
    weight: 1.0,
    indicators: [{ name: '', weight: 1.0 }],
  });

  useEffect(() => {
    if (id) {
      // Fetch criteria data for editing
      axios.get(`http://localhost:8000/api/criteria/${id}/`)
        .then(res => {
          const { name, description, standard, weight, indicators } = res.data;
          setCriteria({
            name,
            description,
            standard,
            weight,
            indicators: indicators || [{ name: '', weight: 1.0 }],
          });
        })
        .catch(err => console.error('Error fetching criteria:', err));
    }
  }, [id]);

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
      alert("Please fill all fields and ensure the weight is between 0 and 100.");
      return false;
    }
    for (const indicator of criteria.indicators) {
      if (!indicator.name || indicator.weight <= 0 || indicator.weight > 100) {
        alert("All indicators must have a name and a weight between 0 and 100.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const method = id ? axios.put : axios.post;
      const url = id ? `http://localhost:8000/api/criteria/${id}/` : 'http://localhost:8000/api/criteria/';
      await method(url, criteria);
      alert("Criteria saved successfully!");
      navigate('/criteria');
    } catch (error) {
      console.error("Error saving criteria:", error);
      alert("Failed to save criteria. Please try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{id ? 'Edit Criteria' : 'Add New Criteria'}</CardTitle>
      </CardHeader>
      <CardContent>
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
            >
              Cancel
            </Button>
            <Button type="submit">
              {id ? 'Save Changes' : 'Add Criteria'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CriteriaForm;
