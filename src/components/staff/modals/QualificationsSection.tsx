
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, XIcon } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';

interface QualificationsSectionProps {
  control: Control<any>;
  disabled?: boolean;
}

const QualificationsSection: React.FC<QualificationsSectionProps> = ({
  control,
  disabled = false
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });

  const [newQualification, setNewQualification] = React.useState("");

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      append({ qualification: newQualification.trim() });
      setNewQualification("");
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>Qualifications</FormLabel>
      <div className="space-y-3">
        {!disabled && (
          <div className="flex gap-2">
            <Input
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              placeholder="Add qualification"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleAddQualification}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {fields.map((field: any, index) => (
            <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
              {field.qualification}
              {!disabled && (
                <XIcon 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => remove(index)}
                />
              )}
            </Badge>
          ))}
          {fields.length === 0 && (
            <div className="text-sm text-muted-foreground">No qualifications added yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualificationsSection;
