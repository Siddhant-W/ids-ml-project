import { useState, useEffect, useCallback } from 'react';
import { generateAlert } from '../utils/dataGenerators';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    // Initial 20 alerts
    const initial = Array.from({ length: 20 }, generateAlert);
    setAlerts(initial);
    setAlertCount(initial.filter(a => a.sev === 'CRITICAL').length);

    const interval = setInterval(() => {
      // 40% chance of new alert
      if (Math.random() < 0.4) {
        const newAlert = generateAlert();
        setAlerts(prev => {
          const next = [newAlert, ...prev].slice(0, 100); // keep max 100
          setAlertCount(next.filter(a => a.sev === 'CRITICAL').length);
          return next;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 100));
  }, []);

  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
  }, []);

  return { alerts, alertCount, addAlert, acknowledgeAlert };
}

export function useLiveStats() {
  const [stats, setStats] = useState({
    threats: 24,
    detectionRate: 98.7,
    falsePositives: 2.1,
    packetsPerSec: '14.2K'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        threats: Math.floor(Math.random() * 15 + 15),
        detectionRate: Number((98.0 + Math.random()).toFixed(1)),
        falsePositives: Number((1.5 + Math.random()).toFixed(1)),
        packetsPerSec: (Math.floor(Math.random() * 5 + 12)) + '.' + Math.floor(Math.random() * 9) + 'K'
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
