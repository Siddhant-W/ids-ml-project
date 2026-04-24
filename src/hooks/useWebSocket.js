import { useEffect, useRef } from 'react';
import { createWebSocket } from '../services/websocket';

export function useWebSocket(path, onMessage) {
  const wsRef = useRef(null);
  useEffect(() => {
    wsRef.current = createWebSocket(path, onMessage, console.error);
    return () => wsRef.current?.close();
  }, [path]);
}
