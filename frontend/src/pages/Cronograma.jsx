import React, { useState } from 'react';
import { Search, Pencil, Target } from 'lucide-react';
import { useTramites } from '../context/TramiteContext';

const DURACION = {
  'I': 3,
  'IIa': 5,
  'IIb': 16,
  'III': 16
};

// Utils
const getWeekIndex = (dateStr, year) => {
  if (!dateStr) return -1;
  const d = new Date(dateStr);
  if (d.getFullYear() !== year) return -1;
  const start = new Date(year, 0, 1);
  const diff = d.getTime() - start.getTime();
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  return Math.max(0, Math.min(47, week));
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

export default function Cronograma() {
  const [selectedYear, _setSelectedYear] = useState(2026);
  const [programadoModal, setProgramadoModal] = useState(null);
  const { tramites, fasesData, loading } = useTramites();

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayWeekIndex = getWeekIndex(todayStr, selectedYear);
  const isTodayInRange = todayWeekIndex >= 0 && todayWeekIndex < 48;

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="flex flex-col gap-4 bg-white rounded-t-xl overflow-y-auto p-6 border-t border-x border-slate-200">
      
      {/* Top Breadcrumb / Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-slate-800">Cronograma</span>
        <div className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-500 font-medium whitespace-nowrap">
          {loading ? '...' : `${tramites.length} / ${tramites.length} trámites`}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mt-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            Cronograma de Trámites
          </h1>
          <p className="text-xs text-slate-500 mt-1">Gestión Visual de Dossiers, Radicados y Resoluciones INVIMA</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-4 py-1.5 border border-indigo-600 text-indigo-600 font-semibold text-xs rounded-md shadow-sm">
            {selectedYear}
          </button>
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

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-full sm:max-w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input 
            type="text" 
            placeholder="Buscar trámite, registro o proveedor..." 
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none text-slate-600 shadow-sm"
          />
        </div>

        <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none flex-1 min-w-[140px] shadow-sm">
          <option>Todos los productos</option>
        </select>
        
        <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none flex-1 min-w-[140px] shadow-sm">
          <option>Todos los estados</option>
        </select>

        <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none flex-1 min-w-[140px] shadow-sm">
          <option>Todos los tipos</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-4 text-xs">
        <span className="font-bold text-slate-400 tracking-widest text-[10px]">CONVENCIONES:</span>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#6c757d] rounded-sm"></div>
          <span className="text-slate-600 font-medium text-[11px]">Fase 1 (Radicado)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#4785ff] rounded-sm"></div>
          <span className="text-slate-600 font-medium text-[11px]">Fase 2 (Resolución)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-[#36b37e] rounded-sm"></div>
          <span className="text-slate-600 font-medium text-[11px]">Fase 3 (Cierre)</span>
        </div>
      </div>

      {/* Gantt Table */}
      <div className="mt-2 border border-slate-200 rounded-md overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-xs text-slate-400">Cargando...</div>
          ) : (
          <div style={{ minWidth: '2400px' }} className="h-full">
            
            {/* Header Row 1: Section headers */}
            <div className="flex border-b border-slate-200">
              <div className="sticky left-0 z-10 w-[120px] shrink-0 p-2 border-r border-slate-600 flex items-center justify-center bg-[#475569] text-white text-[10px] font-bold uppercase">CLIENTE</div>
              <div className="w-[120px] shrink-0 p-2 border-r border-slate-600 flex items-center justify-center bg-[#475569] text-white text-[10px] font-bold uppercase">TIPO DE TRÁMITE</div>
              <div className="flex shrink-0 border-r border-slate-600" style={{ width: '610px' }}>
                <div className="flex-1 flex items-center justify-center bg-[#475569] text-white text-[10px] font-bold uppercase">INFORMACIÓN DEL PRODUCTO</div>
              </div>
              <div className="w-[150px] shrink-0 p-2 border-r border-slate-600 flex items-center justify-center bg-[#475569] text-white text-[10px] font-bold uppercase">Programado</div>
              <div className="w-[150px] shrink-0 p-2 border-r border-slate-600 flex items-center justify-center bg-[#475569] text-white text-[10px] font-bold uppercase">Real</div>
              <div className="flex-1 bg-[#475569]" />
            </div>

            {/* Header Row 2: Column subheaders */}
            <div className="flex border-b border-slate-200 bg-white">
              <div className="sticky left-0 z-10 w-[120px] shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600 bg-white">Cliente</div>
              <div className="w-[120px] shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600">Tipo Trámite</div>
              <div className="w-[125px] shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600">Producto</div>
              <div className="w-[165px] shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600">Nombre del Producto en el Registro Sanitario</div>
              <div className="w-[165px] shrink-0 p-2 border-r border-slate-200 flex items-center text-[11px] font-semibold text-slate-600">Proveedor</div>
              <div className="w-[70px] shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600">Tipo</div>
              <div className="w-[70px] shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600">Riesgo</div>
              <div className="w-[150px] shrink-0 p-2 border-r border-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm">Programado</div>
              <div className="w-[150px] shrink-0 p-2 border-r border-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm">Real</div>
              <div className="flex-1 flex relative">
                {months.map((m) => (
                  <div key={m} className="flex-1 flex flex-col border-r border-slate-200 last:border-r-0 min-w-[120px]">
                    <div className={`text-center py-2 text-xs font-bold ${m === 'Junio' ? 'bg-blue-50 text-blue-800' : 'text-slate-700 bg-white'} border-b border-slate-100`}>
                      {m}
                    </div>
                    <div className="flex bg-white">
                      {[1,2,3,4].map(w => (
                        <div key={w} className="flex-1 text-center py-1 text-[9px] text-slate-300 font-medium border-r border-slate-50 last:border-r-0">
                          S{w}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {isTodayInRange && (
                  <div className="absolute top-0 bottom-0 z-20 flex flex-col items-center pointer-events-none" style={{ left: `${(todayWeekIndex / 48) * 100}%` }}>
                    <div className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm border border-red-600 z-20" style={{ marginTop: '-1px' }}>HOY</div>
                    <div className="w-px flex-1 bg-red-400 border-r border-dashed border-red-200"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Body Rows */}
            {tramites.map(t => {
              const fdLocal = fasesData[t.id] || {};
              const riesgo = fdLocal.riesgo || t.riesgo || 'NA';
              const durLocal = DURACION[riesgo] || 3;
              const wb_f1 = getWeekIndex(fdLocal.programado || t.programado, selectedYear);
              const progDateStr = formatDateDM(fdLocal.programado || t.programado);

              const f2BaseStr = fdLocal.f2_programado ? fdLocal.f2_programado : (fdLocal.programado || t.programado) && wb_f1 >= 0 ? addDays(fdLocal.programado || t.programado, durLocal * 7) : '';
              const wb_f2 = fdLocal.f2_programado ? getWeekIndex(fdLocal.f2_programado, selectedYear) : wb_f1 >= 0 ? wb_f1 + durLocal : -1;
              const f2StartStr = formatDateDM(f2BaseStr);

              const cierreBaseStr = f2BaseStr ? addDays(f2BaseStr, 3 * 7) : '';
              const cierreDateStr = formatDateDM(cierreBaseStr);
              const wb_f3_last = wb_f2 >= 0 ? wb_f2 + 3 : -1;

              const realF1DateStr = fdLocal.real || t.real || '';
              const realF2DateStr = fdLocal.f2_real ? fdLocal.f2_real : realF1DateStr ? addDays(realF1DateStr, durLocal * 7) : (fdLocal.programado || t.programado) ? addDays(fdLocal.programado || t.programado, durLocal * 7) : '';
              const realF3DateStr = realF2DateStr ? addDays(realF2DateStr, 3 * 7) : '';

              const wb_r1 = realF1DateStr ? getWeekIndex(realF1DateStr, selectedYear) : -1;
              const wb_r2 = realF2DateStr ? getWeekIndex(realF2DateStr, selectedYear) : -1;
              const wb_r3 = realF3DateStr ? getWeekIndex(realF3DateStr, selectedYear) : -1;

              const realF1Str = formatDateDM(realF1DateStr);
              const realF2Str = formatDateDM(realF2DateStr);
              const realF3Str = formatDateDM(realF3DateStr);

              return (
                <div key={t.id} className="flex border-b border-slate-100 bg-white">
                  <div className="sticky left-0 z-10 w-[120px] shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600 bg-white">{t.cliente || 'Cliente A'}</div>
                  <div className="w-[120px] shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600">{t.tipo_tramite || 'Registro Sanitario'}</div>
                  <div className="w-[125px] shrink-0 p-2 border-r border-slate-200 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-[3px] border-orange-400 border-t-transparent animate-spin shrink-0"></div>
                    <span className="font-bold text-slate-700 text-xs">{t.producto}</span>
                  </div>
                  <div className="w-[165px] shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600">{t.nombre_registro_sanitario || ''}</div>
                  <div className="w-[165px] shrink-0 p-2 border-r border-slate-200 flex items-center text-xs text-slate-600">{t.proveedor || ''}</div>
                  <div className="w-[70px] shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-xs text-slate-600">{t.tipo || 'NA'}</div>
                  <div className="w-[70px] shrink-0 p-2 border-r border-slate-200 flex items-center justify-center text-xs text-slate-600">{riesgo}</div>
                  <div className="w-[150px] shrink-0 p-2.5 border-r border-slate-200 flex items-center justify-center relative">
                    <button
                      onClick={() => setProgramadoModal(programadoModal === t.id ? null : t.id)}
                      className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded font-medium text-slate-600 bg-white flex items-center justify-between gap-1 hover:border-slate-400 transition-colors cursor-pointer"
                    >
                      <span>{fdLocal.programado || t.programado ? formatDateDM(fdLocal.programado || t.programado) : '--'}</span>
                      <Pencil size={12} className="text-slate-400 shrink-0" />
                    </button>
                    {programadoModal === t.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProgramadoModal(null)} />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-xl p-3 min-w-[220px]">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fechas</div>
                          <div className="flex flex-col gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">Programado</label>
                              <input type="text" value={fdLocal.programado || t.programado ? formatDateDM(fdLocal.programado || t.programado) : '--'} readOnly className="w-full text-xs px-2 py-1 border border-slate-200 rounded bg-slate-50 text-slate-600 outline-none" />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">Real</label>
                              <input type="text" value={fdLocal.real || t.real ? formatDateDM(fdLocal.real || t.real) : '--'} readOnly className="w-full text-xs px-2 py-1 border border-indigo-300 rounded bg-indigo-50 text-indigo-700 font-semibold outline-none" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-[150px] shrink-0 p-2.5 border-r border-slate-200 flex items-center justify-center">
                    <div className="w-full text-xs px-2 py-1.5 border-2 border-indigo-500 rounded bg-white text-slate-800 font-bold text-center">
                      {fdLocal.real || t.real ? formatDateDM(fdLocal.real || t.real) : '--'}
                    </div>
                  </div>
                  <div className="flex-1 relative border-t border-slate-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNC4xNjY2NiUiIGhlaWdodD0iMTAwJSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0LjE2NjY2IDAgTCA0LjE2NjY2IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjFmNTU5IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]">
                    
                    {/* Render weeks 0 to 47 */}
                    {Array.from({ length: 48 }).map((_, i) => {
                      const isProgMilestone = (i === wb_f1 && progDateStr);
                      const isF2StartMilestone = (i === wb_f2 && f2StartStr);
                      const isCierreMilestone = (i === wb_f3_last && cierreDateStr);
                      const milestoneText = isProgMilestone ? progDateStr : isF2StartMilestone ? f2StartStr : isCierreMilestone ? cierreDateStr : '';

                      const isRealF1Milestone = (i === wb_r1 && realF1Str);
                      const isRealF2Milestone = (i === wb_r2 && realF2Str);
                      const isRealF3Milestone = (i === wb_r3 && realF3Str);
                      const realMilestoneText = isRealF1Milestone ? realF1Str : isRealF2Milestone ? realF2Str : isRealF3Milestone ? realF3Str : '';

                      let progColor = null;
                      if (wb_f1 >= 0 && i >= wb_f1 && i < wb_f1 + durLocal) progColor = '#6c757d';
                      if (wb_f2 >= 0 && i >= wb_f2 && i < wb_f2 + 3) progColor = '#4785ff';
                      if (wb_f2 >= 0 && i === wb_f2 + 3) progColor = '#36b37e';

                      let realColor = null;
                      if (wb_r1 >= 0 && i >= wb_r1 && i < wb_r1 + durLocal) realColor = '#6c757d';
                      if (wb_r2 >= 0 && i >= wb_r2 && i < wb_r2 + 3) realColor = '#4785ff';
                      if (wb_r3 >= 0 && i === wb_r3) realColor = '#36b37e';

                      return (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: `${(i / 48) * 100}%`,
                            width: `${100 / 48}%`,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5
                          }}
                        >
                          <div
                            style={{
                              width: '90%',
                              height: '22px',
                              background: 'transparent',
                              border: (progColor || realColor) ? 'none' : '1px dashed #e2e8f0',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}
                          >
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: progColor || 'transparent' }}>
                               {milestoneText && (
                                <span style={{ fontSize: 7, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{milestoneText}</span>
                               )}
                            </div>
                            <div style={{ height: '1px', background: '#fff' }} />
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: realColor || 'transparent' }}>
                               {realMilestoneText && (
                                <span style={{ fontSize: 7, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{realMilestoneText}</span>
                               )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Today Line Indicator */}
                    {isTodayInRange && (
                      <div className="absolute top-0 bottom-0 z-20 flex flex-col items-center pointer-events-none" style={{ left: `${(todayWeekIndex / 48) * 100}%` }}>
                        <div className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm border border-red-600" style={{ marginTop: '-1px' }}>HOY</div>
                        <div className="w-px flex-1 bg-red-400 border-r border-dashed border-red-200"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
