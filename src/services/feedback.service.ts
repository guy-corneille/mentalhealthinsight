import api from './api';

export interface Comment {
  id: string;
  comment: string;
  created_at: string;
  added_by: string | null;
  added_by_name: string | null;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'under_review' | 'done';
  submitted_by: string | null;
  submitted_by_name: string | null;
  created_at: string;
  updated_at: string;
  comments: Comment[];
}

export interface FeedbackSubmission {
  title: string;
  description: string;
  submitted_by?: string | null;
}

const feedbackService = {
  submitFeedback: async (feedback: FeedbackSubmission): Promise<Feedback> => {
    try {
      const data = await api.post<Feedback>('/api/feedback/', feedback);
      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback. Please try again.');
    }
  },

  getFeedbacks: async (): Promise<Feedback[]> => {
    try {
      // The API may return a paginated object { results: [...] } or a raw array.
      const data = await api.get<any>('/api/feedback/');

      if (Array.isArray(data)) {
        return data;
      }

      if (data && Array.isArray(data.results)) {
        return data.results as Feedback[];
      }

      // Fallback to empty array if unexpected structure
      return [];
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw new Error('Failed to fetch feedback list. Please try again.');
    }
  },

  getFeedback: async (id: string): Promise<Feedback> => {
    try {
      const data = await api.get<Feedback>(`/api/feedback/${id}/`);
      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error('Failed to fetch feedback details. Please try again.');
    }
  },

  updateStatus: async (id: string, status: string): Promise<Feedback> => {
    try {
      const data = await api.post<Feedback>(`/api/feedback/${id}/update_status/`, { status });
      return data;
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw new Error('Failed to update feedback status. Please try again.');
    }
  },

  addComment: async (feedbackId: string, comment: string): Promise<Comment> => {
    try {
      const data = await api.post<Comment>(`/api/feedback/${feedbackId}/add_comment/`, { comment });
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment. Please try again.');
    }
  },
};

export default feedbackService; 
 