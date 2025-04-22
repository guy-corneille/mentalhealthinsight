
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export interface AuditFormData {
  facilityId: number;
  facilityName: string;
  criteria: {
    id: number;
    name: string;
    score: number;
    notes: string;
  }[];
  totalScore: number;
  notes: string;
}

export const useAuditForm = (facilityId: number, facilityName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [formData, setFormData] = useState<AuditFormData>({
    facilityId,
    facilityName,
    criteria: [],
    totalScore: 0,
    notes: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const setCriteriaScore = (criteriaId: number, score: number, notes: string = '') => {
    const updatedCriteria = formData.criteria.map(c => 
      c.id === criteriaId ? { ...c, score, notes } : c
    );
    
    // If criteria doesn't exist yet, add it
    if (!updatedCriteria.find(c => c.id === criteriaId)) {
      const criteriaItem = criteria.find(c => c.id === criteriaId);
      if (criteriaItem) {
        updatedCriteria.push({
          id: criteriaId,
          name: criteriaItem.name || 'Unnamed Criteria',
          score,
          notes
        });
      }
    }
    
    // Calculate new total score
    const totalScore = Math.round(
      updatedCriteria.reduce((sum, item) => sum + item.score, 0) / 
      (updatedCriteria.length || 1) // Prevent division by zero
    );
    
    setFormData({
      ...formData,
      criteria: updatedCriteria,
      totalScore
    });
  };

  const setNotes = (notes: string) => {
    setFormData({
      ...formData,
      notes
    });
  };

  const submitAudit = async () => {
    setIsLoading(true);
    
    try {
      const auditData = {
        facility: formData.facilityId,
        audit_date: new Date().toISOString(),
        overall_score: formData.totalScore,
        status: 'completed', // Set status to completed automatically
        notes: formData.notes,
      };
      
      // Create the audit
      const auditResponse = await api.post('/api/audits/', auditData);
      // Safely access the id property with proper type checking
      const auditId = auditResponse && typeof auditResponse === 'object' && 'id' in auditResponse 
        ? auditResponse.id 
        : null;
      
      if (!auditId) {
        throw new Error('Failed to get audit ID from response');
      }
      
      // Add criteria scores
      for (const criterion of formData.criteria) {
        await api.post('/api/audit-criteria/', {
          audit: auditId,
          criteria_name: criterion.name,
          score: criterion.score,
          notes: criterion.notes,
        });
      }
      
      toast({
        title: 'Audit Completed',
        description: `Audit for ${formData.facilityName} has been successfully saved.`,
      });
      
      // Redirect back to facility details
      navigate(`/facilities/${formData.facilityId}`);
    } catch (error) {
      console.error('Error submitting audit:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit audit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    formData,
    isLoading,
    criteria,
    setCriteria,
    nextStep,
    prevStep,
    setCriteriaScore,
    setNotes,
    submitAudit,
  };
};
