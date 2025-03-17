
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

interface IndicatorItemProps {
  indicator: Indicator;
  index: number;
  onIndicatorChange: (index: number, field: 'name' | 'weight', value: string | number) => void;
  onRemoveIndicator: (index: number) => void;
  showRemoveButton: boolean;
}

const IndicatorItem: React.FC<IndicatorItemProps> = ({
  indicator,
  index,
  onIndicatorChange,
  onRemoveIndicator,
  showRemoveButton
}) => {
  const weightOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-100">
      <div className="flex-1">
        <Input
          value={indicator.name}
          onChange={(e) => onIndicatorChange(index, 'name', e.target.value)}
          placeholder="Indicator name"
        />
      </div>
      
      <div className="w-32">
        <Select
          value={indicator.weight.toString()}
          onValueChange={(value) => onIndicatorChange(index, 'weight', parseFloat(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Weight" />
          </SelectTrigger>
          <SelectContent>
            {weightOptions.map((weight) => (
              <SelectItem key={weight} value={weight.toString()}>
                {weight.toFixed(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {showRemoveButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveIndicator(index)}
        >
          <Trash2 className="h-4 w-4 text-rose-500" />
        </Button>
      )}
    </div>
  );
};

export default IndicatorItem;
