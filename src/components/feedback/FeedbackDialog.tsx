import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Feedback } from '@/services/feedback.service';
import feedbackService from '@/services/feedback.service';
import { Clock, MessageCircle, User } from 'lucide-react';

interface FeedbackDialogProps {
  feedback: Feedback | null;
  onClose: () => void;
  onUpdate: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  feedback,
  onClose,
  onUpdate
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const handleAddComment = async () => {
    if (!feedback || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await feedbackService.addComment(feedback.id, comment.trim());
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      setComment('');
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!feedback) return;

    setIsSubmitting(true);
    try {
      await feedbackService.updateStatus(feedback.id, newStatus);
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        variant: "outline" as const,
        className: "bg-yellow-50 text-yellow-600 border-yellow-200"
      },
      under_review: {
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-600 border-blue-200"
      },
      done: {
        variant: "outline" as const,
        className: "bg-emerald-50 text-emerald-600 border-emerald-200"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge 
        variant={config.variant}
        className={config.className}
      >
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!feedback) return null;

  return (
    <Dialog open={!!feedback} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle>{feedback.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDate(feedback.created_at)}
                <span className="mx-2">•</span>
                <User className="h-3 w-3" />
                {feedback.submitted_by_name}
              </DialogDescription>
            </div>
            {getStatusBadge(feedback.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Description</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {feedback.description}
            </p>
          </div>

          {/* Comments Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <h4 className="font-semibold">Comments</h4>
            </div>
            <div className="space-y-3">
              {feedback.comments.map(comment => (
                <div 
                  key={comment.id}
                  className="bg-muted/50 rounded-lg p-3 space-y-1"
                >
                  <p className="text-sm">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    By {comment.added_by_name} on {formatDate(comment.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="space-y-4">
              {/* Status Update Buttons */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Update Status</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('under_review')}
                    disabled={feedback.status === 'under_review' || isSubmitting}
                  >
                    Mark Under Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('done')}
                    disabled={feedback.status === 'done' || isSubmitting}
                  >
                    Mark as Done
                  </Button>
                </div>
              </div>

              {/* Add Comment Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Add Comment</h4>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment here..."
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || isSubmitting}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog; 