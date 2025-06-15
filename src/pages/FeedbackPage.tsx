import React, { useState } from 'react';
import { Tabs } from 'antd';
import FeedbackForm from '../components/feedback/FeedbackForm';
import FeedbackList from '../components/feedback/FeedbackList';
import styles from '../components/feedback/Feedback.module.css';
import MainLayout from '../components/common/layout/MainLayout';

const FeedbackPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('list');
  const [listKey, setListKey] = useState(0); // Used to force re-render of FeedbackList

  const handleFeedbackSubmitted = () => {
    setActiveKey('list');
    setListKey(prev => prev + 1); // Force re-render of FeedbackList
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Feedback</h1>
        <div className={styles.feedbackContainer}>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={[
              {
                key: 'list',
                label: 'Feedback List',
                children: <FeedbackList key={listKey} />
              },
              {
                key: 'submit',
                label: 'Submit Feedback',
                children: <FeedbackForm onSuccess={handleFeedbackSubmitted} />
              }
            ]}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default FeedbackPage; 
 