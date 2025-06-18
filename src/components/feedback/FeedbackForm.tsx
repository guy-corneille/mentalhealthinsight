import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import feedbackService, { FeedbackSubmission } from '@/services/feedback.service';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: FeedbackSubmission = {
        ...values,
        submitted_by: user ? user.id : null,
      };
      await feedbackService.submitFeedback(payload);
      form.reset();
      toast({
        title: "Success",
        description: "Your feedback has been submitted successfully.",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="space-y-4">
      {!user && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not logged in. Your feedback will be submitted anonymously.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
          name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title for your feedback" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
          name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your feedback in detail" 
                    className="min-h-[120px]"
                    {...field} 
          />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm; 
 