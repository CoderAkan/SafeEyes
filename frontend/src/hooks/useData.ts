import { useState, useEffect, useCallback, useRef } from 'react';
import { incidentService, cameraService } from '../services/data';

export function useIncidents(autoRefresh = false) {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await incidentService.list({ limit: 20 });
      setIncidents(data.incidents || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await incidentService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchIncidents(), fetchStats()]);
    setLoading(false);
  }, [fetchIncidents, fetchStats]);

  useEffect(() => {
    refresh();
    if (autoRefresh) {
      intervalRef.current = setInterval(refresh, 30000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh, autoRefresh]);

  return { incidents, stats, loading, error, refresh };
}

export function useCameras() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCameras = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cameraService.list();
      setCameras(data.cameras || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  return { cameras, loading, error, refresh: fetchCameras };
}
