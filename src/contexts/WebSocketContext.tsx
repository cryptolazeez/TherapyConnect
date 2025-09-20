import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  error?: string;
  event?: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (eventType: string, callback: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const eventHandlers = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    let wsUrl: string;
    
    if (process.env.NODE_ENV === 'development') {
      // In development, connect directly to the backend
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.hostname}:8000/ws`;
    } else {
      // In production, use the same host as the frontend
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/ws`;
    }
    
    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      wsUrl += `?token=${encodeURIComponent(token)}`;
    }
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Resubscribe to all events
      eventHandlers.current.forEach((_, eventType) => {
        sendMessage({ type: 'subscribe', event: eventType });
      });
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'pong') {
          return; // Ignore pong messages
        }
        
        const handlers = eventHandlers.current.get(message.type) || [];
        handlers.forEach(handler => {
          try {
            handler(message.data || message);
          } catch (error) {
            console.error(`Error in handler for ${message.type}:`, error);
          }
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      
      // Exponential backoff for reconnection
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current++;
      
      console.log(`WebSocket disconnected. Reconnecting in ${delay}ms...`);
      
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, delay);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    // Add the callback to the handlers map
    if (!eventHandlers.current.has(eventType)) {
      eventHandlers.current.set(eventType, new Set());
    }
    eventHandlers.current.get(eventType)?.add(callback);
    
    // Send subscribe message if connected
    if (isConnected) {
      sendMessage({ type: 'subscribe', event: eventType });
    }
    
    // Return unsubscribe function
    return () => {
      const handlers = eventHandlers.current.get(eventType);
      if (handlers) {
        handlers.delete(callback);
        if (handlers.size === 0) {
          eventHandlers.current.delete(eventType);
        }
      }
    };
  }, [isConnected, sendMessage]);

  // Send ping every 30 seconds to keep connection alive
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      sendMessage({ type: 'ping' });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, sendMessage]);

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
