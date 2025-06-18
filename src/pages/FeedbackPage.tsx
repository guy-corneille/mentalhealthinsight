import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackList from '@/components/feedback/FeedbackList';
import { MessageSquarePlus, ListIcon } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  // This page is intended for all users to submit and view their own feedback.
  const canManageFeedback = false;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">
            {canManageFeedback 
              ? "Manage and respond to user feedback requests." 
              : "Submit and track your feedback requests."}
          </p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue={canManageFeedback ? "all" : "submit"} className="space-y-6">
            <TabsList>
              {!canManageFeedback && (
                <TabsTrigger value="submit" className="flex items-center gap-2">
                  <MessageSquarePlus className="h-4 w-4" />
                  Submit Feedback
                </TabsTrigger>
              )}
              {canManageFeedback ? (
                <TabsTrigger value="all" className="flex items-center gap-2">
                  All Feedback
                </TabsTrigger>
              ) : (
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <ListIcon className="h-4 w-4" />
                  Your Feedback
                </TabsTrigger>
              )}
            </TabsList>

            {!canManageFeedback && (
              <TabsContent value="submit" className="space-y-4">
                <FeedbackForm />
              </TabsContent>
            )}

            {canManageFeedback ? (
              <TabsContent value="all">
                <FeedbackList isAdminView />
              </TabsContent>
            ) : (
              <TabsContent value="list">
                <FeedbackList />
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default FeedbackPage; 
 