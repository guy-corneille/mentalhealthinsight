
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  type: 'assessment' | 'audit';
}

interface CriteriaListProps {
  criteriaType: 'assessment' | 'audit';
}

const CriteriaList: React.FC<CriteriaListProps> = ({ criteriaType }) => {
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCriteria, setExpandedCriteria] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/criteria/', {
          params: { search: searchTerm, type: criteriaType },
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
    // Different mock data based on the criteriaType
    const getMockData = (): Criterion[] => {
      if (criteriaType === 'audit') {
        return [
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
      } else {
        return [
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
      }
    };
    
    // Instead of calling the API, we'll use the mock data for now
    setTimeout(() => {
      setCriteria(getMockData());
      setLoading(false);
    }, 500);
    
    // Uncomment this to use the actual API
    // fetchData();
  }, [searchTerm, criteriaType]);

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
            <CardTitle>{criteriaType === 'assessment' ? 'Patient Assessment Criteria' : 'Facility Audit Criteria'}</CardTitle>
            <CardDescription>
              {criteriaType === 'assessment' 
                ? 'Define and manage criteria for evaluating patient mental health'
                : 'Define and manage criteria for evaluating mental health facilities'
              }
            </CardDescription>
          </div>
          <Button asChild>
            <Link to={`/criteria/add?type=${criteriaType}`} className="flex items-center gap-1">
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
            No {criteriaType} criteria found. Create a new criterion to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CriteriaList;
