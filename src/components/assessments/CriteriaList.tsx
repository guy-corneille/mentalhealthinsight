
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import CriterionItem from './criteria/CriterionItem';

interface Indicator {
  id: number;
  name: string;
  weight: number;
}

interface Criterion {
  id: number;
  name: string;
  description: string;
  standard: string;
  weight: number;
  indicators: Indicator[];
}

const CriteriaList: React.FC = () => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCriteria, setExpandedCriteria] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/criteria/', {
          params: { search: searchTerm },
        });
        console.log('API Response:', response.data);
        setCriteria(response.data || []);
      } catch (error) {
        console.error('Error fetching criteria:', error);
        setCriteria([]);
      } finally {
        setLoading(false);
      }
    };
    
    // For now, let's use mock data for development
    const mockData: Criterion[] = [
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
    
    // Instead of calling the API, we'll use the mock data for now
    setTimeout(() => {
      setCriteria(mockData);
      setLoading(false);
    }, 500);
    
    // Uncomment this to use the actual API
    // fetchData();
  }, [searchTerm]);

  const toggleExpand = (id: number) => {
    setExpandedCriteria(expandedCriteria === id ? null : id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this criterion?')) {
      try {
        // Mock deletion
        setCriteria(criteria.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting criterion:', error);
        alert('Failed to delete criterion. Please try again.');
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Evaluation Criteria</CardTitle>
            <CardDescription>
              Define and manage assessment criteria for mental health evaluations
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/criteria/add" className="flex items-center gap-1">
              <Plus size={16} />
              Add New
            </Link>
          </Button>
        </div>
        <div className="pt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search criteria..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading criteria...</div>
        ) : criteria.length > 0 ? (
          <div className="space-y-4">
            {criteria.map((criterion) => (
              <CriterionItem 
                key={criterion.id}
                criterion={criterion}
                isExpanded={expandedCriteria === criterion.id}
                onToggleExpand={() => toggleExpand(criterion.id)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No criteria found. Create a new criterion to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CriteriaList;
