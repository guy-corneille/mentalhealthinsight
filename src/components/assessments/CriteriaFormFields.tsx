
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CriteriaCategory = 'Clinical' | 'Facility' | 'Administrative' | 'Ethical' | 'Quality Improvement';
type CriteriaPurpose = 'Assessment' | 'Audit';

interface CriteriaFormFieldsProps {
  name: string;
  description: string;
  category: CriteriaCategory;
  purpose: CriteriaPurpose;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const CriteriaFormFields: React.FC<CriteriaFormFieldsProps> = ({
  name,
  description,
  category,
  purpose,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Criteria Name *
        </label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          placeholder="Enter criteria name"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category *
        </label>
        <Select name="category" value={category} onValueChange={(value) => onInputChange({ target: { name: 'category', value } } as any)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Clinical">Clinical</SelectItem>
            <SelectItem value="Facility">Facility</SelectItem>
            <SelectItem value="Administrative">Administrative</SelectItem>
            <SelectItem value="Ethical">Ethical</SelectItem>
            <SelectItem value="Quality Improvement">Quality Improvement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium mb-1">
          Purpose *
        </label>
        <Select name="purpose" value={purpose} onValueChange={(value: CriteriaPurpose) => onInputChange({ target: { name: 'purpose', value } } as any)}>
          <SelectTrigger id="purpose">
            <SelectValue placeholder="Select purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Assessment">Patient Assessment</SelectItem>
            <SelectItem value="Audit">Facility Audit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onInputChange}
          placeholder="Enter a detailed description of this criteria"
          rows={4}
        />
      </div>
    </div>
  );
};

export default CriteriaFormFields;
