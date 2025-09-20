import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Button, Divider, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);
  const { isConnected, sendMessage } = useWebSocket();
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Handle incoming real-time notifications
  useEffect(() => {
    if (!isConnected) return;

    const handleNewNotification = (data: any) => {
      const newNotification: Notification = {
        id: data.id || Date.now().toString(),
        type: data.type || 'info',
        title: data.title || 'New Notification',
        message: data.message || 'You have a new notification',
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev]);
    };

    // Subscribe to notification events
    const unsubscribe = (window as any).wsContext.subscribe('notification', handleNewNotification);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
        <strong>Notifications</strong>
        <div>
          <Button type="link" size="small" onClick={markAllAsRead} disabled={!hasUnread}>
            Mark all as read
          </Button>
          <Button type="link" size="small" onClick={clearAll} disabled={notifications.length === 0}>
            Clear all
          </Button>
        </div>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Typography.Text type="secondary">No notifications yet</Typography.Text>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={notification => (
              <List.Item
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: notification.read ? '#fff' : '#f6ffed',
                  borderLeft: `3px solid ${
                    notification.type === 'success' ? '#52c41a' :
                    notification.type === 'error' ? '#ff4d4f' :
                    notification.type === 'warning' ? '#faad14' : '#1890ff'
                  }`
                }}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{notification.title}</span>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </Typography.Text>
                    </div>
                  }
                  description={
                    <Typography.Paragraph 
                      ellipsis={{ rows: 2 }} 
                      style={{ marginBottom: 0 }}
                    >
                      {notification.message}
                    </Typography.Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={notificationContent}
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
      overlayStyle={{ padding: 0 }}
    >
      <div style={{ marginRight: 16, cursor: 'pointer' }}>
        <Badge count={unreadCount} size="small" offset={[-5, 5]}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </div>
    </Popover>
  );
};

export default NotificationBell;
