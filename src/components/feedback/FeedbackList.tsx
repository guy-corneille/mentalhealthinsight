import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import feedbackService, { Feedback } from '@/services/feedback.service';
import { cn } from '@/lib/utils';
import { MessageCircle, Clock, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import FeedbackDialog from './FeedbackDialog';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeedbackListProps {
  isAdminView?: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  under_review: 'bg-blue-100 text-blue-800 border-blue-200',
  done: 'bg-green-100 text-green-800 border-green-200',
} as const;

const statusLabels = {
  pending: 'Pending',
  under_review: 'Under Review',
  done: 'Done',
} as const;

const FeedbackList: React.FC<FeedbackListProps> = ({ isAdminView = false }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackService.getFeedbacks();
      // If admin view, show all feedback, otherwise filter to show only user's feedback (or anonymous)
      const filteredData = !isAdminView && user 
        ? data.filter(f => f.submitted_by === user.id || f.submitted_by === null)
        : data;
      setFeedbacks(Array.isArray(filteredData) ? filteredData : []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feedback list';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
        return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {isAdminView ? "No feedback submissions found." : "You haven't submitted any feedback yet."}
        </p>
        </div>
    );
    }

  return (
    <div className="space-y-4">
      {!isAdminView && user && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Showing feedback submitted by you.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {feedback.title}
                </CardTitle>
                <Badge className={cn('ml-2', statusColors[feedback.status])}>
                  {statusLabels[feedback.status]}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(feedback.created_at), 'MMM d, yyyy')}
                <User className="h-4 w-4 ml-3 mr-1" />
                {feedback.submitted_by_name || 'Anonymous'}
                  </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {feedback.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {feedback.comments?.length || 0} comments
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>

      <FeedbackDialog
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onUpdate={fetchFeedbacks}
      />
    </div>
  );
};

export default FeedbackList; 