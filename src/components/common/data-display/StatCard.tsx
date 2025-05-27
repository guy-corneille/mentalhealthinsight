import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  description
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-gray-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
      {(change || description) && (
        <div className="mt-4">
          {change && (
            <div className={`flex items-center text-sm ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{change.type === 'increase' ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(change.value)}%</span>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard; 