import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Input, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import feedbackService, { Feedback } from '../../services/feedback.service';
import styles from './Feedback.module.css';

const { TextArea } = Input;

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data);
    } catch (error) {
      message.error('Failed to fetch feedback');
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await feedbackService.updateStatus(id, newStatus);
      message.success('Status updated successfully');
      fetchFeedbacks();
    } catch (error) {
      message.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedFeedback || !comment.trim()) return;

    try {
      await feedbackService.addComment(selectedFeedback.id, comment.trim());
      message.success('Comment added successfully');
      setComment('');
      setSelectedFeedback(null);
      fetchFeedbacks();
    } catch (error) {
      message.error('Failed to add comment');
      console.error('Error adding comment:', error);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'gold',
          under_review: 'blue',
          done: 'green'
        };
        return (
          <Tag 
            color={colors[status as keyof typeof colors]}
            className={styles.statusTag}
          >
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Submitted By',
      dataIndex: 'submitted_by_name',
      key: 'submitted_by_name',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Feedback) => (
        <div className={styles.actionButtons}>
          <Button type="link" onClick={() => setSelectedFeedback(record)}>
            View Details
          </Button>
          {user?.role === 'admin' && (
            <>
              <Button 
                type="link" 
                onClick={() => handleStatusChange(record.id, 'under_review')}
                disabled={record.status === 'under_review'}
              >
                Mark Under Review
              </Button>
              <Button 
                type="link" 
                onClick={() => handleStatusChange(record.id, 'done')}
                disabled={record.status === 'done'}
              >
                Mark Done
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className={styles.feedbackList}>
      <Table 
        dataSource={feedbacks} 
        columns={columns} 
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Feedback Details"
        open={!!selectedFeedback}
        onCancel={() => setSelectedFeedback(null)}
        footer={null}
        width={700}
      >
        {selectedFeedback && (
          <div>
            <h3>{selectedFeedback.title}</h3>
            <p>{selectedFeedback.description}</p>
            
            <div className={styles.commentSection}>
              <h4>Comments</h4>
              {selectedFeedback.comments.map(comment => (
                <div 
                  key={comment.id} 
                  className={styles.comment}
                >
                  <p>{comment.comment}</p>
                  <div className={styles.commentMeta}>
                    By {comment.added_by_name} on {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {user?.role === 'admin' && (
              <div className={styles.commentSection}>
                <TextArea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={4}
                />
                <Button 
                  type="primary" 
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  style={{ marginTop: 10 }}
                >
                  Add Comment
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackList; 