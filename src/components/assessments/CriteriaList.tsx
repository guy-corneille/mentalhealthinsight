import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  SearchIcon, 
  ClipboardListIcon,
  EditIcon,
  Trash2Icon,
  ArrowUpDownIcon
} from 'lucide-react';
import { 
  useAssessmentCriteria, 
  useDeleteAssessmentCriteria, 
  AssessmentCriteria 
} from '@/services/criteriaService';

interface CriteriaListProps {
  criteriaType: 'assessment' | 'audit';
}

const CriteriaList: React.FC<CriteriaListProps> = ({ criteriaType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredCriteria, setFilteredCriteria] = useState<AssessmentCriteria[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AssessmentCriteria;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });
  
  const { data: criteria, isLoading, error } = useAssessmentCriteria(criteriaType);
  const deleteCriteriaMutation = useDeleteAssessmentCriteria();
  
  useEffect(() => {
    if (!criteria) return;
    
    let results = [...criteria];
    
    if (categoryFilter !== 'all') {
      results = results.filter(criterion => 
        criterion.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(criterion => 
        criterion.name.toLowerCase().includes(query) ||
        criterion.description?.toLowerCase().includes(query)
      );
    }
    
    results.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredCriteria(results);
  }, [criteria, searchQuery, categoryFilter, sortConfig]);
  
  const handleSort = (key: keyof AssessmentCriteria) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleDelete = (id: number, name: string, purpose: 'Assessment' | 'Audit') => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCriteriaMutation.mutate({ id, purpose }, {
        onSuccess: () => {
          toast({
            title: "Criterion Deleted",
            description: `"${name}" has been removed.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete "${name}". Please try again.`,
            variant: "destructive",
          });
          console.error("Delete error:", error);
        }
      });
    }
  };
  
  const getCategoryBadgeStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'clinical':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'facility':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'administrative':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'ethical':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'quality improvement':
        return 'bg-teal-100 text-teal-800 hover:bg-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading criteria...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-500 mb-2">Error loading criteria</p>
        <p className="text-muted-foreground">{(error as Error).message || 'Unknown error occurred'}</p>
      </div>
    );
  }
  
  const categories = criteria
    ? ['all', ...new Set(criteria.map(item => item.category.toLowerCase()))]
    : ['all'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(cat => cat !== 'all').map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={() => navigate(`/criteria/add?type=${criteriaType}`)}
          className="bg-healthiq-600 hover:bg-healthiq-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add {criteriaType === 'assessment' ? 'Assessment' : 'Audit'} Criterion
        </Button>
      </div>
      
      {filteredCriteria.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <ClipboardListIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No criteria found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : `Get started by adding a new ${criteriaType} criterion.`}
            </p>
            {(searchQuery || categoryFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>{criteriaType === 'assessment' ? 'Assessment' : 'Audit'} Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === 'name' && (
                        <ArrowUpDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortConfig.key === 'category' && (
                        <ArrowUpDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Indicators</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCriteria.map(criterion => (
                  <TableRow key={criterion.id}>
                    <TableCell className="font-medium">{criterion.name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadgeStyle(criterion.category)}>
                        {criterion.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {criterion.description}
                    </TableCell>
                    <TableCell>{criterion.indicators?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/criteria/edit/${criterion.id}`)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(criterion.id, criterion.name, criterion.purpose)}
                        >
                          <Trash2Icon className="h-4 w-4 text-rose-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CriteriaList;
