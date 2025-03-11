import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

interface IndicatorItemProps {
  indicator: Indicator;
  index: number;
  onIndicatorChange: (index: number, field: keyof Indicator, value: string | number) => void;
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
  return (
    <div className="p-4 border rounded-md space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Indicator Name</label>
        <Input
          value={indicator.name}
          onChange={(e) => onIndicatorChange(index, 'name', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Weight (0-100)</label>
        <Input
          type="number"
          value={indicator.weight}
          onChange={(e) => onIndicatorChange(index, 'weight', parseFloat(e.target.value))}
          min="0"
          max="100"
          step="0.1"
          required
        />
      </div>
      {showRemoveButton && (
        <Button 
          type="button" 
          onClick={() => onRemoveIndicator(index)} 
          variant="destructive"
          size="sm"
          className="mt-2"
        >
          <Trash size={16} className="mr-1" /> Remove
        </Button>
      )}
    </div>
  );
};

export default IndicatorItem;
