
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Trash, Plus } from 'lucide-react';

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

  const handleIndicatorChange = (index: number, field: keyof Indicator, value: string | number) => {
    const newIndicators = [...criteria.indicators];
    newIndicators[index][field] = value;
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
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <Input
              id="name"
              name="name"
              value={criteria.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={criteria.description}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="standard" className="block text-sm font-medium">Standard</label>
            <select
              id="standard"
              name="standard"
              value={criteria.standard}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            >
              <option value="WHO-AIMS 2.0">WHO-AIMS 2.0</option>
              <option value="ISO 9001">ISO 9001</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="weight" className="block text-sm font-medium">Weight (0-100)</label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={criteria.weight}
              onChange={(e) => setCriteria({ ...criteria, weight: parseFloat(e.target.value) })}
              min="0"
              max="100"
              step="0.1"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Indicators</h3>
              <Button type="button" onClick={handleAddIndicator} size="sm" className="flex items-center gap-1">
                <Plus size={16} /> Add Indicator
              </Button>
            </div>
            
            {criteria.indicators.map((indicator, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Indicator Name</label>
                  <Input
                    value={indicator.name}
                    onChange={(e) => handleIndicatorChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Weight (0-100)</label>
                  <Input
                    type="number"
                    value={indicator.weight}
                    onChange={(e) => handleIndicatorChange(index, 'weight', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
                {criteria.indicators.length > 1 && (
                  <Button 
                    type="button" 
                    onClick={() => handleRemoveIndicator(index)} 
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                  >
                    <Trash size={16} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

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
