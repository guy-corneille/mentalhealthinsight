import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import feedbackService from '../../services/feedback.service';
import styles from './Feedback.module.css';

const { TextArea } = Input;

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await feedbackService.submitFeedback({
        title: values.title,
        description: values.description
      });
      message.success('Feedback submitted successfully');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('Failed to submit feedback');
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.feedbackForm}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Brief description of your feedback" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea
            rows={4}
            placeholder="Provide detailed feedback..."
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Feedback
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FeedbackForm; 
 