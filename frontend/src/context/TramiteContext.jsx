import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TramiteContext = createContext(null);

const API = '/api/tramites';

export function TramiteProvider({ children }) {
  const [tramites, setTramites] = useState([]);
  const [fasesData, setFasesData] = useState({});
  const [loading, setLoading] = useState(true);

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
          programado: t.programado || '',
          real: t.real || '',
          f2_programado: t.f2_programado || '',
          f2_real: t.f2_real || '',
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
