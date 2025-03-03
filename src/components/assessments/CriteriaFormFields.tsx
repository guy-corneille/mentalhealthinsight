
import React from 'react';
import { Input } from '@/components/ui/input';

interface CriteriaFormFieldsProps {
  name: string;
  description: string;
  standard: string;
  weight: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onWeightChange: (value: number) => void;
}

const CriteriaFormFields: React.FC<CriteriaFormFieldsProps> = ({
  name,
  description,
  standard,
  weight,
  onInputChange,
  onWeightChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onInputChange}
          required
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="standard" className="block text-sm font-medium">Standard</label>
        <select
          id="standard"
          name="standard"
          value={standard}
          onChange={onInputChange}
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="WHO-AIMS 2.0">WHO-AIMS 2.0</option>
          <option value="ISO 9001">ISO 9001</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="weight" className="block text-sm font-medium">Weight (0-100)</label>
        <Input
          id="weight"
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(parseFloat(e.target.value))}
          min="0"
          max="100"
          step="0.1"
          required
        />
      </div>
    </>
  );
};

export default CriteriaFormFields;
