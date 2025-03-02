
import React from 'react';
import { 
  ListChecksIcon, 
  SearchIcon,
  PlusIcon,
  FilterIcon,
  InfoIcon,
  EditIcon,
  Trash2Icon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CriteriaList: React.FC = () => {
  const criteria = [
    { 
      id: 'C-001', 
      name: 'Staffing Adequacy', 
      description: 'Adequate number of qualified mental health professionals relative to patient population',
      weight: 15,
      standard: 'WHO-AIMS 2.0',
      type: 'core'
    },
    { 
      id: 'C-002', 
      name: 'Medication Availability', 
      description: 'Essential psychotropic medications are available and accessible to patients',
      weight: 20,
      standard: 'WHO-AIMS 2.0',
      type: 'core'
    },
    { 
      id: 'C-003', 
      name: 'Physical Environment', 
      description: 'Safe, clean, and therapeutic physical environment for patient care',
      weight: 15,
      standard: 'ISO 9001',
      type: 'core'
    },
    { 
      id: 'C-004', 
      name: 'Treatment Planning', 
      description: 'Individualized treatment plans for each patient based on comprehensive assessment',
      weight: 10,
      standard: 'WHO-AIMS 2.0',
      type: 'core'
    },
    { 
      id: 'C-005', 
      name: 'Crisis Intervention', 
      description: 'Protocols and resources for managing psychiatric emergencies and crises',
      weight: 15,
      standard: 'WHO-AIMS 2.0',
      type: 'core'
    },
    { 
      id: 'C-006', 
      name: 'Documentation Quality', 
      description: 'Accurate, complete, and timely documentation of patient care',
      weight: 10,
      standard: 'ISO 9001',
      type: 'core'
    },
    { 
      id: 'C-007', 
      name: 'Community Integration', 
      description: 'Programs and services to facilitate patient reintegration into the community',
      weight: 10,
      standard: 'Custom',
      type: 'optional'
    },
    { 
      id: 'C-008', 
      name: 'Cultural Competence', 
      description: 'Services delivered in a culturally sensitive and appropriate manner',
      weight: 5,
      standard: 'Custom',
      type: 'optional'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search criteria..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-32 bg-muted/50 border-none focus:ring-1">
              <SelectValue placeholder="Standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards</SelectItem>
              <SelectItem value="who">WHO-AIMS 2.0</SelectItem>
              <SelectItem value="iso">ISO 9001</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-32 bg-muted/50 border-none focus:ring-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="optional">Optional</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-healthiq-600 hover:bg-healthiq-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Criteria
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {criteria.map((criterion, index) => (
          <Card key={criterion.id} className="transition-all duration-200 hover:shadow-md animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{criterion.name}</CardTitle>
                  <CardDescription>{criterion.description}</CardDescription>
                </div>
                <Badge variant={criterion.type === 'core' ? 'default' : 'outline'} className={
                  criterion.type === 'core' 
                    ? 'bg-healthiq-100 text-healthiq-800 hover:bg-healthiq-200 border-none' 
                    : 'border-healthiq-200 text-healthiq-800'
                }>
                  {criterion.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">Standard</p>
                  <div className="flex items-center mt-1">
                    <p className="font-medium">{criterion.standard}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Reference standard for this criteria</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <div className="flex items-center mt-1">
                    <p className="font-medium">{criterion.weight}%</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Contribution to overall assessment score</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <EditIcon className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                  <Trash2Icon className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CriteriaList;
