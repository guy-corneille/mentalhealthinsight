import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import StandardBadge from './StandardBadge';

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
  type?: 'assessment' | 'audit';
}

interface CriterionItemProps {
  criterion: Criterion;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: (id: number) => void;
}

const CriterionItem: React.FC<CriterionItemProps> = ({ 
  criterion, 
  isExpanded, 
  onToggleExpand, 
  onDelete 
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? 
            <ChevronDown className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          }
          <div>
            <h3 className="font-medium">{criterion.name}</h3>
            <p className="text-sm text-muted-foreground">{criterion.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StandardBadge standard={criterion.standard} />
          {criterion.type && (
            <Badge variant="outline" className={criterion.type === 'assessment' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}>
              {criterion.type === 'assessment' ? 'Assessment' : 'Audit'}
            </Badge>
          )}
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
              onDelete(criterion.id);
            }}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
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
  );
};

export default CriterionItem;
