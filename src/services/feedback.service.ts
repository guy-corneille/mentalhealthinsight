import api from '@/services/api';
import { PaginatedResponse } from '@/types/common';
import { AxiosResponse } from 'axios';

const API_URL = '/api/feedback/';

export interface FeedbackSubmission {
  title: string;
  description: string;
}

export interface FeedbackComment {
  id: string;
  comment: string;
  added_by_name: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'under_review' | 'done';
  submitted_by_name: string;
  created_at: string;
  comments: FeedbackComment[];
}

const feedbackService = {
  async getAllFeedback(): Promise<Feedback[]> {
    const response = await api.get<AxiosResponse<PaginatedResponse<Feedback>>>(API_URL);
    return response.data.results;
  },

  async submitFeedback(data: FeedbackSubmission): Promise<Feedback> {
    const response = await api.post<AxiosResponse<Feedback>>(API_URL, data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await api.post(`${API_URL}${id}/update_status/`, { status });
  },

  async addComment(id: string, comment: string): Promise<void> {
    await api.post(`${API_URL}${id}/add_comment/`, { comment });
  }
};

export default feedbackService; 
 