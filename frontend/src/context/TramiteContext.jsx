import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TramiteContext = createContext(null);

const API = '/api/tramites';

export function TramiteProvider({ children }) {
  const [tramites, setTramites] = useState([]);
  const [fasesData, setFasesData] = useState({});
  const [loading, setLoading] = useState(true);

  const normalizeDate = (v) => {
    if (!v) return '';
    const s = String(v);
    const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : '';
  };

  const fetchTramites = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('API response is not an array');
      setTramites(data);

      const fases = {};
      data.forEach(t => {
        fases[t.id] = {
          riesgo: t.riesgo || '',
          programado: normalizeDate(t.programado),
          real: normalizeDate(t.real),
          f2_programado: normalizeDate(t.f2_programado),
          f2_real: normalizeDate(t.f2_real),
          f3_programado: normalizeDate(t.f3_programado),
          f3_real: normalizeDate(t.f3_real),
        };
      });
      setFasesData(fases);
    } catch (err) {
      console.error('Error fetching tramites:', err);
      setTramites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTramites(); }, [fetchTramites]);

  const updateFase = (id, field, value) => {
    setFasesData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  return (
    <TramiteContext.Provider value={{ tramites, fasesData, loading, refetch: fetchTramites, updateFase }}>
      {children}
    </TramiteContext.Provider>
  );
}

export function useTramites() {
  const ctx = useContext(TramiteContext);
  if (!ctx) throw new Error('useTramites must be used within TramiteProvider');
  return ctx;
}
