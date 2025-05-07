
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast as sonnerToast } from "sonner";

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type: NotificationType) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Track recently shown notifications to prevent duplicates
  const [recentNotifications, setRecentNotifications] = useState<Map<string, number>>(new Map());

  // Add a new notification
  const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
    // Create a key to identify this notification
    const notificationKey = `${title}:${message}:${type}`;
    const now = Date.now();
    
    // Check if we've shown this notification recently (within 3 seconds)
    if (recentNotifications.has(notificationKey)) {
      const lastShown = recentNotifications.get(notificationKey) || 0;
      if (now - lastShown < 3000) {
        // Skip showing this notification again
        return;
      }
    }
    
    // Update our record of recently shown notifications
    const updatedRecentNotifications = new Map(recentNotifications);
    updatedRecentNotifications.set(notificationKey, now);
    setRecentNotifications(updatedRecentNotifications);
    
    // Create and add the notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);

    // Use sonner toast for all notifications
    sonnerToast[type](title, {
      description: message,
    });
  }, [recentNotifications]);

  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
