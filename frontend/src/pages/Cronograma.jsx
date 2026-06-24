import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Target, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useTramites } from '../context/TramiteContext';

const DURACION = { I: 3, IIa: 5, IIb: 16, III: 16 };
const TOTAL_WEEKS = 48;
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const GRID_SVG = "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNC4xNjY2NiUiIGhlaWdodD0iMTAwJSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0LjE2NjY2IDAgTCA0LjE2NjY2IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjFmNTU5IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]";

const getWeekIndex = (dateStr, year) => {
  if (!dateStr) return -1;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return -1;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  if (d.getFullYear() !== year) return -1;
  const start = new Date(year, 0, 1);
  const week = Math.floor((d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.max(0, Math.min(TOTAL_WEEKS - 1, week));
};

const formatDateDM = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
};

const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const weekCell = (wi) => ({
  position: 'absolute',
  left: `${(wi / TOTAL_WEEKS) * 100}%`,
  width: `${100 / TOTAL_WEEKS}%`,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 5,
});

const ganttBarStyle = {
  width: '90%',
  height: '22px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '2px',
  overflow: 'hidden',
};


export default function Cronograma() {
  const [selectedYear, _setSelectedYear] = useState(2026);
  const [dataCollapsed, setDataCollapsed] = useState(false);
  const [programadoModal, setProgramadoModal] = useState(null);
  const { tramites, fasesData, loading, updateFase, updateFaseBatch } = useTramites();
  const ganttRef = useRef(null);
  const [hoyOffset, setHoyOffset] = useState(null);

  const today = new Date();
  const todayWeekIndex = getWeekIndex(today.toISOString().slice(0, 10), selectedYear);
  const isTodayInRange = todayWeekIndex >= 0 && todayWeekIndex < TOTAL_WEEKS;

  const measureHoy = useCallback(() => {
    if (ganttRef.current) {
      const ganttLeft = ganttRef.current.offsetLeft;
      const ganttWidth = ganttRef.current.offsetWidth;
      setHoyOffset(ganttLeft + (todayWeekIndex / TOTAL_WEEKS) * ganttWidth);
    }
  }, [todayWeekIndex]);

  useEffect(() => {
    if (!loading) measureHoy();
  }, [measureHoy, tramites, dataCollapsed, loading]);

  useEffect(() => {
    window.addEventListener('resize', measureHoy);
    return () => window.removeEventListener('resize', measureHoy);
  }, [measureHoy]);

  const recalc = (id, progDate, riesgoVal) => {
    if (!progDate || !riesgoVal) {
      updateFase(id, 'f2_programado', '');
      updateFase(id, 'f3_programado', '');
      return;
    }
    const wb = getWeekIndex(progDate, selectedYear);
    if (wb < 0) return;
    const dur = DURACION[riesgoVal] || 3;
    const f2 = addDays(progDate, dur * 7);
    updateFase(id, 'f2_programado', f2);
    updateFase(id, 'f3_programado', addDays(f2, 21));
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-t-xl overflow-y-auto p-6 border-t border-x border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-slate-800">Cronograma</span>
        <div className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-500 font-medium whitespace-nowrap">
          {loading ? '...' : `${tramites.length} / ${tramites.length} trámites`}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mt-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            Cronograma de Trámites
          </h1>
          <p className="text-xs text-slate-500 mt-1">Gestión Visual de Dossiers, Radicados y Resoluciones INVIMA</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-4 py-1.5 border border-indigo-600 text-indigo-600 font-semibold text-xs rounded-md shadow-sm">{selectedYear}</button>
          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-slate-50 shadow-sm p-0.5">
            <button className="px-3 sm:px-4 py-1 text-indigo-600 bg-white shadow-sm rounded-md font-semibold text-xs">Semanas</button>
            <button className="px-3 sm:px-4 py-1 text-slate-500 font-medium text-xs bg-transparent">Meses</button>
          </div>
          <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <Target size={14} className="text-slate-600" /> Hoy
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-medium whitespace-nowrap">Agrupar por:</span>
            <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 outline-none font-medium w-[140px] text-slate-700 shadow-sm">
              <option>Tipo de Trámite</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-full sm:max-w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input type="text" placeholder="Buscar trámite, registro o proveedor..." className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none text-slate-600 shadow-sm" />
        </div>
        <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none flex-1 min-w-[140px] shadow-sm"><option>Todos los productos</option></select>
        <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none flex-1 min-w-[140px] shadow-sm"><option>Todos los estados</option></select>
        <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none flex-1 min-w-[140px] shadow-sm"><option>Todos los tipos</option></select>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-4 text-xs">
        <span className="font-bold text-slate-400 tracking-widest text-[10px]">CONVENCIONES:</span>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-[#6c757d] rounded-sm"></div><span className="text-slate-600 font-medium text-[11px]">Fase 1 (Radicado)</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-[#4785ff] rounded-sm"></div><span className="text-slate-600 font-medium text-[11px]">Fase 2 (Resolución)</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-[#36b37e] rounded-sm"></div><span className="text-slate-600 font-medium text-[11px]">Fase 3 (Cierre)</span></div>
      </div>

      <div className="mt-2 border border-slate-200 rounded-md overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-xs text-slate-400">Cargando...</div>
          ) : (
          <div style={{ minWidth: '2400px' }} className="h-full relative">
            <div className="flex border-b border-slate-200">
              <div className="sticky left-0 z-10 w-[120px] shrink-0 p-2 border-r border-slate-600 flex items-center justify-center bg-[#475569] text-white text-[10px] font-bold uppercase">CLIENTE</div>
              <div className="shrink-0 border-r border-slate-600 flex items-center bg-[#475569] text-white text-[10px] font-bold uppercase cursor-pointer select-none hover:bg-[#5a6a7e] transition-colors" style={{ width: dataCollapsed ? '28px' : '1015px' }} onClick={() => setDataCollapsed(!dataCollapsed)}>
                {dataCollapsed ? <ChevronRight size={16} className="mx-auto" /> : <><ChevronLeft size={14} className="mr-1 shrink-0" /><span className="truncate">DATOS DEL TRÁMITE</span></>}
              </div>
              <div className="flex-1 bg-[#475569]" />
            </div>

            <div className="flex border-b border-slate-200 bg-white">
              <div className="sticky left-0 z-10 w-[120px] shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600 bg-white">Cliente</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '120px' }}>Tipo Trámite</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '125px' }}>Producto</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '165px' }}>Nombre del Producto en el Registro Sanitario</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '165px' }}>Proveedor</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '70px' }}>Tipo</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '70px' }}>Riesgo</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '150px' }}>Programado</div>
              <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '150px' }}>Real</div>
              <div ref={ganttRef} className="flex-1 flex relative">
                {MONTHS.map((m) => (
                  <div key={m} className="flex-1 flex flex-col min-w-[120px]" style={{ outline: '1px solid #e2e8f0', outlineOffset: '-1px' }}>
                    <div className={`text-center py-2 text-xs font-bold ${m === 'Junio' ? 'bg-blue-50 text-blue-800' : 'text-slate-700 bg-white'} border-b border-slate-100`}>{m}</div>
                    <div className="flex bg-white">
                      {[1,2,3,4].map(w => (
                        <div key={w} className="flex-1 text-center py-1 text-[9px] text-slate-300 font-medium border-r border-slate-50 last:border-r-0">S{w}</div>
                      ))}
                    </div>
                  </div>
                ))}
                {isTodayInRange && (
                  <div className="absolute top-0 z-20 pointer-events-none" style={{ left: `${(todayWeekIndex / TOTAL_WEEKS) * 100}%` }}>
                    <div className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm border border-red-600">HOY</div>
                  </div>
                )}
              </div>
            </div>

            {tramites.map(t => {
              const fdLocal = fasesData[t.id] || {};
              const riesgo = fdLocal.riesgo ?? (t.riesgo || 'NA');
              const durLocal = DURACION[riesgo] || 3;

              const progDate = fdLocal.programado || '';
              const hasProg = !!progDate;
              const wb_f1 = getWeekIndex(progDate, selectedYear);
              const formattedF1 = formatDateDM(progDate);

              const f2Prog = fdLocal.f2_programado ?? (progDate && wb_f1 >= 0 ? addDays(progDate, durLocal * 7) : '');
              const wb_f2 = fdLocal.f2_programado ? getWeekIndex(fdLocal.f2_programado, selectedYear) : wb_f1 >= 0 ? wb_f1 + durLocal : -1;
              const formattedF2 = formatDateDM(f2Prog);

              const f3Prog = fdLocal.f3_programado ?? (f2Prog ? addDays(f2Prog, 21) : '');
              const wb_f3_last = fdLocal.f3_programado ? getWeekIndex(fdLocal.f3_programado, selectedYear) : wb_f2 >= 0 ? wb_f2 + 3 : -1;
              const formattedF3 = formatDateDM(f3Prog);

              const realDate = fdLocal.real || '';
              const hasReal = !!realDate;
              const f2Real = fdLocal.f2_real ?? (realDate ? addDays(realDate, durLocal * 7) : '');
              const f3Real = fdLocal.f3_real ?? (f2Real ? addDays(f2Real, 21) : '');
              const formattedRealF1 = formatDateDM(realDate);
              const formattedRealF2 = formatDateDM(f2Real);
              const formattedRealF3 = formatDateDM(f3Real);

              const wb_r1 = realDate ? getWeekIndex(realDate, selectedYear) : -1;
              const wb_r2 = f2Real ? getWeekIndex(f2Real, selectedYear) : -1;
              const wb_r3 = f3Real ? getWeekIndex(f3Real, selectedYear) : -1;

              let ganttContent = null;
              if (hasProg || hasReal) {
                const weeks = Array.from({ length: TOTAL_WEEKS }).map((_, wi) => {
                  let progColor = null;
                  if (hasProg) {
                    if (wb_f1 >= 0 && wi >= wb_f1 && wi < wb_f1 + durLocal) progColor = '#6c757d';
                    if (wb_f2 >= 0 && wi >= wb_f2 && wi < wb_f2 + 3) progColor = '#4785ff';
                    if (wb_f3_last >= 0 && wi === wb_f3_last) progColor = '#36b37e';
                  }

                  let realColor = null;
                  if (hasReal) {
                    if (wb_r1 >= 0 && wi >= wb_r1 && wi < wb_r1 + durLocal) realColor = '#6c757d';
                    if (wb_r2 >= 0 && wi >= wb_r2 && wi < wb_r2 + 3) realColor = '#4785ff';
                    if (wb_r3 >= 0 && wi === wb_r3) realColor = '#36b37e';
                  }

                  if (!progColor && !realColor) return null;

                  const progLabel = progColor === '#6c757d' && wi === wb_f1 ? formattedF1 : progColor === '#4785ff' && wi === wb_f2 ? formattedF2 : progColor === '#36b37e' && wi === wb_f3_last ? formattedF3 : '';
                  const realLabel = realColor === '#6c757d' && wi === wb_r1 ? formattedRealF1 : realColor === '#4785ff' && wi === wb_r2 ? formattedRealF2 : realColor === '#36b37e' && wi === wb_r3 ? formattedRealF3 : '';

                  return (
                    <div key={wi} style={weekCell(wi)}>
                      <div style={ganttBarStyle}>
                        {hasProg && (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: progColor || 'transparent', borderBottom: hasReal ? '1px solid rgba(255,255,255,0.25)' : 'none' }}>
                            {progLabel && <span style={{ fontSize: 7, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{progLabel}</span>}
                          </div>
                        )}
                        {hasReal && (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: realColor || 'transparent' }}>
                            {realLabel && <span style={{ fontSize: 7, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{realLabel}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });

                ganttContent = <>{weeks}</>;
              }

              return (
                <div key={t.id} className="flex border-b border-slate-100 bg-white">
                  <div className="sticky left-0 z-10 w-[120px] shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600 bg-white">{t.cliente || 'Cliente A'}</div>
                  <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '120px' }}>{t.tipo_tramite || 'Registro Sanitario'}</div>
                  <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center gap-2 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '125px' }}><span className="font-bold text-slate-700 text-xs">{t.producto}</span></div>
                  <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '165px' }}>{t.nombre_registro_sanitario || ''}</div>
                  <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '165px' }}>{t.proveedor || ''}</div>
                  <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-xs text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '70px' }}>{t.tipo || 'NA'}</div>
                  <div className={`shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-xs text-slate-600 ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '70px' }}>{riesgo}</div>
                  <div className={`shrink-0 p-1 border-r border-slate-200 flex items-center gap-1 relative ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '150px' }}>
                    <input type="date" value={progDate} onChange={(e) => { updateFase(t.id, 'programado', e.target.value); recalc(t.id, e.target.value, riesgo); }} className="flex-1 min-w-0 text-xs px-1 py-1 border border-slate-300 rounded font-medium text-slate-700 bg-white cursor-pointer hover:border-slate-500 transition-colors" />
                    <Pencil size={14} onClick={() => setProgramadoModal(programadoModal === t.id ? null : t.id)} className="shrink-0 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors" />
                    {programadoModal === t.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProgramadoModal(null)} />
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-xl p-3 min-w-[320px]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fechas del Trámite</div>
                            <select value={riesgo} onChange={(e) => { updateFase(t.id, 'riesgo', e.target.value); recalc(t.id, progDate, e.target.value); }} className="text-[9px] px-1 py-0.5 border border-slate-200 rounded bg-white text-slate-600 cursor-pointer outline-none">
                              <option value="">Duración por Riesgo</option>
                              <option value="I">RIESGO I — 3 sem</option>
                              <option value="IIa">RIESGO IIa — 5 sem</option>
                              <option value="IIb">RIESGO IIb — 16 sem</option>
                              <option value="III">RIESGO III — 16 sem</option>
                            </select>
                          </div>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-slate-200">
                                <th className="text-left py-1.5 pr-2 text-slate-500 font-semibold">Fase</th>
                                <th className="text-left py-1.5 px-2 text-slate-500 font-semibold">Programado</th>
                                <th className="text-left py-1.5 pl-2 text-slate-500 font-semibold">Real</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 pr-2 font-medium text-slate-700">FASE 1</td>
                                <td className="py-1.5 px-1">
                                  <input type="date" value={progDate} onChange={(e) => { updateFase(t.id, 'programado', e.target.value); recalc(t.id, e.target.value, riesgo); }} className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded text-slate-700 cursor-pointer" />
                                </td>
                                <td className="py-1.5 pl-1">
                                  <input type="date" value={realDate} onChange={(e) => { const val = e.target.value; if (!val || !riesgo) { updateFaseBatch(t.id, { real: val, f2_real: '', f3_real: '' }); return; } const dur = DURACION[riesgo] || 3; const f2 = addDays(val, dur * 7); updateFaseBatch(t.id, { real: val, f2_real: f2, f3_real: addDays(f2, 21) }); }} className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded text-slate-700 cursor-pointer" />
                                </td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 pr-2 font-medium text-slate-700">FASE 2</td>
                                <td className="py-1.5 px-1">
                                  <input type="date" value={f2Prog} onChange={(e) => { const val = e.target.value; updateFaseBatch(t.id, { f2_programado: val, f3_programado: addDays(val, 21) }); }} className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded text-slate-700 cursor-pointer" />
                                </td>
                                <td className="py-1.5 pl-1">
                                  <input type="date" value={f2Real} onChange={(e) => { const val = e.target.value; updateFaseBatch(t.id, { f2_real: val, f3_real: addDays(val, 21) }); }} className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded text-slate-700 cursor-pointer" />
                                </td>
                              </tr>
                              <tr>
                                <td className="py-1.5 pr-2 font-medium text-slate-700">FASE 3</td>
                                <td className="py-1.5 px-1">
                                  <input type="date" value={f3Prog} onChange={(e) => updateFase(t.id, 'f3_programado', e.target.value)} className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded text-slate-700 cursor-pointer" />
                                </td>
                                <td className="py-1.5 pl-1">
                                  <input type="date" value={f3Real} onChange={(e) => updateFase(t.id, 'f3_real', e.target.value)} className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded text-slate-700 cursor-pointer" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={`shrink-0 p-1 border-r border-slate-200 flex items-center justify-center ${dataCollapsed ? 'hidden' : ''}`} style={{ width: '150px' }}>
                    <input type="date" value={realDate} onChange={(e) => { const val = e.target.value; if (!val || !riesgo) { updateFaseBatch(t.id, { real: val, f2_real: '', f3_real: '' }); return; } const dur = DURACION[riesgo] || 3; const f2 = addDays(val, dur * 7); updateFaseBatch(t.id, { real: val, f2_real: f2, f3_real: addDays(f2, 21) }); }} className="w-full text-xs px-1 py-1 border border-slate-300 rounded font-medium text-slate-700 bg-white cursor-pointer hover:border-slate-500 transition-colors" />
                  </div>
                  <div className={`flex-1 relative border-t border-slate-50 ${(hasProg || hasReal) ? GRID_SVG : ''}`}>
                    {ganttContent}
                  </div>
                </div>
              );
            })}
            {isTodayInRange && hoyOffset !== null && (
              <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${hoyOffset}px`, width: '1px' }}>
                <div className="h-full bg-red-400 border-r border-dashed border-red-200"></div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
