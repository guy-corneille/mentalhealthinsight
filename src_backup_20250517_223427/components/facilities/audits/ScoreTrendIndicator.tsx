
import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';

interface ScoreTrendIndicatorProps {
  current: number;
  previous: number | null;
}

const ScoreTrendIndicator: React.FC<ScoreTrendIndicatorProps> = ({ current, previous }) => {
  if (previous === null) return <MinusIcon className="h-4 w-4 text-gray-400" />;
  
  const diff = current - previous;
  const percentChange = previous > 0 ? (diff / previous) * 100 : 0;
  
  if (diff > 0) {
    return (
      <div className="flex items-center text-emerald-600">
        <TrendingUpIcon className="h-4 w-4 mr-1" />
        +{diff} pts ({percentChange.toFixed(1)}%)
      </div>
    );
  } else if (diff < 0) {
    return (
      <div className="flex items-center text-rose-600">
        <TrendingDownIcon className="h-4 w-4 mr-1" />
        {diff} pts ({percentChange.toFixed(1)}%)
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-gray-500">
        <MinusIcon className="h-4 w-4 mr-1" />
        No change
      </div>
    );
  }
};

export default ScoreTrendIndicator;
