import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import mockTramites from '../data/mockData';

const TramiteContext = createContext(null);

const STORAGE_KEY = 'tramites';
const FASES_KEY = 'tramites_fases';

const normalizeDate = (v) => {
  if (!v) return '';
  const s = String(v);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
};

function buildFases(data) {
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
  return fases;
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data) && data.length > 0) {
        const fasesStored = localStorage.getItem(FASES_KEY);
        return { tramites: data, fasesData: fasesStored ? JSON.parse(fasesStored) : buildFases(data) };
      }
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTramites));
  const initialFases = buildFases(mockTramites);
  localStorage.setItem(FASES_KEY, JSON.stringify(initialFases));
  return { tramites: mockTramites, fasesData: initialFases };
}

function saveTramites(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveFases(data) {
  localStorage.setItem(FASES_KEY, JSON.stringify(data));
}

export function TramiteProvider({ children }) {
  const [tramites, setTramites] = useState([]);
  const [fasesData, setFasesData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { tramites: t, fasesData: f } = loadFromStorage();
    setTramites(t);
    setFasesData(f);
    setLoading(false);
  }, []);

  const refetch = useCallback(() => {
    const { tramites: t, fasesData: f } = loadFromStorage();
    setTramites(t);
    setFasesData(f);
  }, []);

  const updateFase = (id, field, value) => {
    setFasesData(prev => {
      const next = { ...prev, [id]: { ...prev[id], [field]: value } };
      saveFases(next);
      return next;
    });
  };

  const updateFaseBatch = (id, updates) => {
    setFasesData(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...updates } };
      saveFases(next);
      return next;
    });
  };

  const createTramite = useCallback((formData) => {
    const newId = Date.now();
    const newTramite = {
      id: newId,
      cliente: formData.cliente || 'Cliente A',
      producto: formData.producto || '',
      proveedor: formData.proveedor || '',
      tipo: formData.tipo || 'NA',
      riesgo: formData.riesgo || 'I',
      tipo_tramite: formData.tipo_tramite || 'Registro Sanitario',
      nombre_registro_sanitario: formData.nombre_registro_sanitario || '',
      tarifa: formData.tarifa || '',
      valor: formData.valor || '',
      estado_id_reenvio: formData.estado_id_reenvio || 'Intención de trámite enviada',
      fecha_estimada_radicado: '',
      fecha_radicado: '',
      radicado_no: '',
      llave_clave: '',
      fecha_auto: '',
      auto_no: '',
      fecha_limite: '',
      fecha: '',
      radicado_no_2: '',
      fecha_estimada_obtencion_resolucion: '',
      fecha_obtencion_resolucion: '',
      resolucion: '',
      registro_sanitario_obtenido_no: '',
      expediente: '',
      fecha_radicado_2: '',
      radicado_no_3: '',
      llave: '',
      fecha_estimada_resolucion: '',
      fecha_resolucion: '',
      resolucion_obtenida: '',
      nombre_generico: '',
      codigo: '',
      descripcion: '',
      definicion: '',
      udi1: '',
      udi2: '',
      fecha_cargue: '',
      radicado: '',
      observaciones: '',
    };

    setTramites(prev => {
      const next = [...prev, newTramite];
      saveTramites(next);
      return next;
    });

    setFasesData(prev => {
      const next = {
        ...prev,
        [newId]: {
          riesgo: formData.riesgo || 'I',
          programado: '',
          real: '',
          f2_programado: '',
          f2_real: '',
          f3_programado: '',
          f3_real: '',
        },
      };
      saveFases(next);
      return next;
    });

    return newId;
  }, []);

  return (
    <TramiteContext.Provider value={{ tramites, fasesData, loading, refetch, updateFase, updateFaseBatch, createTramite }}>
      {children}
    </TramiteContext.Provider>
  );
}

export function useTramites() {
  const ctx = useContext(TramiteContext);
  if (!ctx) throw new Error('useTramites must be used within TramiteProvider');
  return ctx;
}
