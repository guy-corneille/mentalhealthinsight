
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, XIcon } from 'lucide-react';

interface QualificationsSectionProps {
  qualifications: string[];
  newQualification: string;
  setNewQualification: (value: string) => void;
  addQualification: () => void;
  removeQualification: (index: number) => void;
}

const QualificationsSection: React.FC<QualificationsSectionProps> = ({
  qualifications,
  newQualification,
  setNewQualification,
  addQualification,
  removeQualification
}) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">
        Qualifications
      </Label>
      <div className="col-span-3 space-y-3">
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
            onClick={addQualification}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {qualifications.map((qual, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              {qual}
              <XIcon 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeQualification(idx)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualificationsSection;
