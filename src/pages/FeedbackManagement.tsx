import React from 'react';
import Layout from '@/components/layout/Layout';
import FeedbackList from '@/components/feedback/FeedbackList';
import { usePageAuth } from '@/hooks/usePageAuth';

const FeedbackManagementPage: React.FC = () => {
  // Restrict access to admin and higher roles
  usePageAuth('admin');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Feedback Management</h1>
          <p className="text-muted-foreground">
            Review and manage all user feedback submissions.
          </p>
        </div>

        {/* List all feedback with admin controls */}
        <FeedbackList isAdminView />
      </div>
    </Layout>
  );
};

export default FeedbackManagementPage; 