import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

export function useRealtimeData<T>(
  eventType: string,
  initialData: T,
  transform: (data: any) => T = (data) => data as T
): [T, (data: T) => void] {
  const [data, setData] = useState<T>(initialData);
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;
    
    const unsubscribe = subscribe(eventType, (eventData: any) => {
      setData(prevData => {
        const newData = transform(eventData);
        return typeof newData === 'object' && !Array.isArray(newData) && newData !== null
          ? { ...prevData, ...newData }
          : newData;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [eventType, subscribe, isConnected, transform]);

  return [data, setData];
}
