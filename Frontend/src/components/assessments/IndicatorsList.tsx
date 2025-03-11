import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import IndicatorItem from './IndicatorItem';

interface Indicator {
  id?: number;
  name: string;
  weight: number;
}

interface IndicatorsListProps {
  indicators: Indicator[];
  onIndicatorChange: (index: number, field: keyof Indicator, value: string | number) => void;
  onAddIndicator: () => void;
  onRemoveIndicator: (index: number) => void;
}

const IndicatorsList: React.FC<IndicatorsListProps> = ({
  indicators,
  onIndicatorChange,
  onAddIndicator,
  onRemoveIndicator
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Indicators</h3>
        <Button type="button" onClick={onAddIndicator} size="sm" className="flex items-center gap-1">
          <Plus size={16} /> Add Indicator
        </Button>
      </div>
      
      {indicators.map((indicator, index) => (
        <IndicatorItem
          key={index}
          indicator={indicator}
          index={index}
          onIndicatorChange={onIndicatorChange}
          onRemoveIndicator={onRemoveIndicator}
          showRemoveButton={indicators.length > 1}
        />
      ))}
    </div>
  );
};

export default IndicatorsList;
