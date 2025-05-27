import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormDatePickerProps {
  label: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  placeholderText = 'Select date...'
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <DatePicker
        id={name}
        selected={value}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholderText}
        className={`
          mt-1 block w-full rounded-md shadow-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100' : 'bg-white'}
          focus:ring-blue-500 focus:border-blue-500 sm:text-sm
        `}
        dateFormat="MMMM d, yyyy"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormDatePicker; 