import { useWebSocket } from '../contexts/WebSocketContext';
import { useCallback } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationData {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export const useNotificationService = () => {
  const { sendMessage, isConnected } = useWebSocket();

  const sendNotification = useCallback((data: NotificationData) => {
    if (!isConnected) {
      console.warn('WebSocket not connected. Notification not sent:', data);
      return;
    }
    
    const notification = {
      id: data.id || `notif_${Date.now()}`,
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: new Date().toISOString(),
      metadata: data.metadata || {},
    };

    // Send notification to the server
    sendMessage({
      type: 'send_notification',
      data: {
        ...notification,
        userId: data.userId, // If specified, send to specific user
      },
    });
  }, [sendMessage, isConnected]);

  // Subscribe to notifications for the current user
  const subscribeToNotifications = useCallback((callback: (data: any) => void) => {
    if (!isConnected) return () => {};
    
    // Subscribe to all notifications
    const unsubscribe = (window as any).wsContext.subscribe('notification', callback);
    
    // Return cleanup function
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected]);

  // Send a test notification (for development)
  const sendTestNotification = useCallback(() => {
    sendNotification({
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test notification from the server.',
    });
  }, [sendNotification]);

  return {
    sendNotification,
    subscribeToNotifications,
    sendTestNotification,
    isConnected,
  };
};

// Server-side notification types
type ServerNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
};

// This would be used on the backend to send notifications
export const createServerNotification = (data: Omit<ServerNotification, 'id' | 'timestamp'>): ServerNotification => ({
  id: `notif_${Date.now()}`,
  timestamp: new Date().toISOString(),
  ...data,
});
