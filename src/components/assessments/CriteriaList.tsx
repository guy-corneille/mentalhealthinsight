
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
        
        // Uncomment for actual API call
        // await axios.delete(`http://localhost:8000/api/criteria/${id}/`);
        // setCriteria(criteria.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting criterion:', error);
        alert('Failed to delete criterion. Please try again.');
      }
    }
  };

  const getStandardBadgeColor = (standard: string) => {
    switch (standard) {
      case 'WHO-AIMS 2.0':
        return 'bg-blue-500';
      case 'ISO 9001':
        return 'bg-green-500';
      case 'Custom':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
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
              <div key={criterion.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
                  onClick={() => toggleExpand(criterion.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedCriteria === criterion.id ? 
                      <ChevronDown className="h-5 w-5 text-muted-foreground" /> : 
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    }
                    <div>
                      <h3 className="font-medium">{criterion.name}</h3>
                      <p className="text-sm text-muted-foreground">{criterion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStandardBadgeColor(criterion.standard)}>
                      {criterion.standard}
                    </Badge>
                    <div className="text-sm text-muted-foreground font-medium w-16 text-right">
                      {criterion.weight}%
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/criteria/edit/${criterion.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(criterion.id);
                      }}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {expandedCriteria === criterion.id && (
                  <div className="p-4 pt-0 border-t bg-muted/30">
                    <h4 className="font-medium mb-3 pl-8 text-sm">Indicators</h4>
                    <div className="space-y-3 pl-8">
                      {criterion.indicators.map((indicator) => (
                        <div key={indicator.id} className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{indicator.name}</p>
                          </div>
                          <div className="w-24 pr-2 text-right text-sm">
                            Weight: {indicator.weight}%
                          </div>
                          <div className="w-32">
                            <Progress 
                              value={indicator.weight} 
                              className="h-2"
                              indicatorClassName="bg-healthiq-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
