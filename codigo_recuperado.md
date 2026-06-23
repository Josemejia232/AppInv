# Código Recuperado de la Sesión Anterior

A continuación se presentan los fragmentos de código modificados y escritos en la sesión anterior (extraídos del registro de actividad).

## Archivo modificado: `CronogramaView.js`

### Fragmento insertado (Líneas 500-503):
```javascript
    const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    return Math.max(0, Math.min(47, week));
  };

  // Convert date string YYYY-MM-DD to DD/MM
  const formatDateDM = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
  };

  // Add days to YYYY-MM-DD date string
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
```

### Fragmento insertado (Líneas 1362-1479):
```javascript
                                 const semanas = t.semanas || Array.from({ length: 48 }, () => ({ checked: false, color: null }));
                                 // Milestone calculation for this tramite
                                 const fdLocal = fasesData[t.id] || {};
                                 const durLocal = DURACION[fdLocal.riesgo] || 3;

                                 // F1 milestone: Programado
                                 const wb_f1 = getWeekIndex(fdLocal.programado, selectedYear);
                                 const progDateStr = formatDateDM(fdLocal.programado);

                                 // F2 milestone: Programado + dur*7 (always)
                                 const f2BaseStr = fdLocal.programado && wb_f1 >= 0
                                   ? addDays(fdLocal.programado, durLocal * 7)
                                   : '';
                                 const wb_f2 = wb_f1 >= 0 ? wb_f1 + durLocal : -1;
                                 const f2StartStr = formatDateDM(f2BaseStr);

                                 // F3 cierre: Programado + (dur+2)*7 + 6
                                 const cierreBaseStr = f2BaseStr
                                   ? addDays(f2BaseStr, 2 * 7 + 6)
                                   : '';
                                 const cierreDateStr = formatDateDM(cierreBaseStr);
                                 const wb_f3_last = wb_f2 >= 0 ? wb_f2 + 2 : -1;

                                 // Real dates calculations
                                 const realF1DateStr = fdLocal.real || '';
                                 const realF2DateStr = fdLocal.f2_real 
                                   ? fdLocal.f2_real
                                   : realF1DateStr
                                   ? addDays(realF1DateStr, durLocal * 7)
                                   : fdLocal.programado
                                   ? addDays(fdLocal.programado, durLocal * 7)
                                   : '';
                                 const realF3DateStr = realF2DateStr
                                   ? addDays(realF2DateStr, 2 * 7 + 6)
                                   : '';

                                 // Real week indices for bottom half
                                 const wb_r1 = realF1DateStr ? getWeekIndex(realF1DateStr, selectedYear) : -1;
                                 const wb_r2 = realF2DateStr ? getWeekIndex(realF2DateStr, selectedYear) : -1;
                                 const wb_r3 = realF3DateStr ? getWeekIndex(realF3DateStr, selectedYear) : -1;

                                 const realF1Str = formatDateDM(realF1DateStr);
                                 const realF2Str = formatDateDM(realF2DateStr);
                                 const realF3Str = formatDateDM(realF3DateStr);

                                 return Array.from({ length: 48 }).map((_, i) => {
                                   const s = semanas[i] || { checked: false, color: null, color_real: null };
                                   const isPickerOpenTop = activeColorPicker === `TOP-${t.id}-${i}`;
                                   const isPickerOpenBot = activeColorPicker === `BOT-${t.id}-${i}`;
                                   const isPickerOpen = isPickerOpenTop || isPickerOpenBot;
                                   
                                   const isProgMilestone = (i === wb_f1 && progDateStr);
                                   const isF2StartMilestone = (i === wb_f2 && f2StartStr);
                                   const isCierreMilestone = (i === wb_f3_last && cierreDateStr);
                                   const milestoneText = isProgMilestone ? progDateStr : isF2StartMilestone ? f2StartStr : isCierreMilestone ? cierreDateStr : '';

                                   const isRealF1Milestone = (i === wb_r1 && realF1Str);
                                   const isRealF2Milestone = (i === wb_r2 && realF2Str);
                                   const isRealF3Milestone = (i === wb_r3 && realF3Str);
                                   const realMilestoneText = isRealF1Milestone ? realF1Str : isRealF2Milestone ? realF2Str : isRealF3Milestone ? realF3Str : '';

                                   let realColor = null;
                                   if (wb_r1 >= 0 && i >= wb_r1 && i < wb_r1 + durLocal) realColor = '#6c757d';
                                   if (wb_r2 >= 0 && i >= wb_r2 && i < wb_r2 + 2) realColor = '#4785ff';
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
                                           height: '24px',
                                           borderRadius: '3px',
                                           background: 'transparent',
                                           border: (s.color || s.color_real)
                                             ? `1px solid ${s.color || s.color_real}`
                                             : '1px dashed #d1d5db',
                                           display: 'grid',
                                           gridTemplateRows: '1fr 1px 1fr',
                                           overflow: 'visible',
                                           position: 'relative'
                                         }}
                                       >
                                         {/* Top half — Programado */}
                                         <div
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             setActiveColorPicker(isPickerOpenTop ? null : `TOP-${t.id}-${i}`);
                                           }}
                                           title={s.color ? `Prog: Sem ${i + 1} — clic para cambiar` : 'Prog: Clic para elegir color'}
                                           style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPickerOpenTop ? '#f1f5f9' : (s.color || 'transparent'), cursor: 'pointer', position: 'relative' }}
                                         >
                                           {milestoneText && !isPickerOpenTop && (
                                             <span style={{
                                               fontSize: 8,
                                               fontWeight: 700,
                                               color: '#fff',
                                               textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                               lineHeight: 1,
                                               pointerEvents: 'none',
                                               whiteSpace: 'nowrap'
                                             }}>{milestoneText}</span>
                                           )}
                                         </div>
                                         {/* 1px divider */}
                                         <div style={{ background: '#e2e8f0' }} />
                                         {/* Bottom half — Real */}
                                         <div
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             setActiveColorPicker(isPickerOpenBot ? null : `BOT-${t.id}-${i}`);
                                           }}
                                           title={s.color_real ? `Real: Sem ${i + 1} — clic para cambiar` : 'Real: Clic para elegir color'}
                                           style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPickerOpenBot ? '#f1f5f9' : (s.color_real || realColor || 'transparent'), cursor: 'pointer', position: 'relative' }}
                                         >
                                           {realMilestoneText && !isPickerOpenBot && (
                                             <span style={{
                                               fontSize: 8,
                                               fontWeight: 700,
                                               color: '#fff',
                                               textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                               lineHeight: 1,
                                               pointerEvents: 'none',
                                               whiteSpace: 'nowrap'
                                             }}>{realMilestoneText}</span>
                                           )}
                                         </div>
```

## Archivo modificado: `CronogramaView.js`

**Código introducido:**
```javascript
                                          {milestoneText && !isPickerOpenTop && (
                                            <span style={{
                                              fontSize: 8,
                                              fontWeight: 700,
                                              color: '#fff',
                                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                              lineHeight: 1,
                                              pointerEvents: 'none',
                                              whiteSpace: 'nowrap'
                                            }}>{milestoneText}</span>
                                          )}
                                        </div>
                                        {/* 1px divider */}
                                        <div style={{ background: '#e2e8f0' }} />
                                        {/* Bottom half — Real */}
                                        <div
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveColorPicker(isPickerOpenBot ? null : `BOT-${t.id}-${i}`);
                                          }}
                                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: isPickerOpenBot ? '#f1f5f9' : (s.color_real || realColor || 'transparent'), cursor: 'pointer', position: 'relative' }}
                                        >
                                          {realMilestoneText && !isPickerOpenBot && (
                                            <span style={{
                                              fontSize: 8,
                                              fontWeight: 700,
                                              color: '#fff',
                                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                              lineHeight: 1,
                                              pointerEvents: 'none',
                                              whiteSpace: 'nowrap'
                                            }}>{realMilestoneText}</span>
                                          )}
```

## Archivo modificado: `CronogramaView.js`

### Fragmento insertado (Líneas 526-550):
```javascript
  // Apply auto-coloring for F1/F2/F3 based on fasesData
  // F1 = Programado, F2 empieza justo después de F1 (or custom f2_programado), F3 = cierre (F2 start + 3 weeks)
  const applyFases = (semanas, data, year) => {
    if (!data || !data.programado) return semanas;
    const dur = DURACION[data.riesgo] || 3;

    const wb_f1 = getWeekIndex(data.programado, year);
    if (wb_f1 < 0 || wb_f1 >= 48) return semanas;

    const wb_f2 = data.f2_programado
      ? getWeekIndex(data.f2_programado, year)
      : wb_f1 + dur;

    const result = [];
    for (let i = 0; i < 48; i++) {
      const orig = semanas[i] || {};
      if (wb_f1 >= 0 && i >= wb_f1 && i < wb_f1 + dur) {
        result[i] = { checked: true, color: '#6c757d', color_real: orig.color_real || null };
      } else if (wb_f2 >= 0 && i >= wb_f2 && i < wb_f2 + 3) {
        result[i] = { checked: true, color: '#4785ff', color_real: orig.color_real || null };
      } else if (wb_f2 >= 0 && i === wb_f2 + 3) {
        result[i] = { checked: true, color: '#36b37e', color_real: orig.color_real || null };
      } else {
        result[i] = { checked: false, color: null, color_real: orig.color_real || null };
      }
    }
    return result;
  };
```

### Fragmento insertado (Líneas 1283-1301):
```javascript
                                    setFasesData(prev => ({
                                      ...prev,
                                      [t.id]: {
                                        ...prev[t.id],
                                        programado: val
                                      }
                                    }));
                                    // Apply auto-color immediately
                                    const tramiteActual = tramites.find(x => x.id === t.id);
                                    if (tramiteActual) {
                                      const data = { 
                                        programado: val, 
                                        real: fd.real || '', 
                                        riesgo: fd.riesgo || 'I', 
                                        f2_programado: fd.f2_programado || '',
                                        f2_real: fd.f2_real || '' 
                                      };
                                      const semanas = tramiteActual.semanas || Array.from({ length: 48 }, () => ({ checked: false, color: null }));
                                      const newSemanas = applyFases(semanas, data, selectedYear);
                                      if (newSemanas !== semanas) {
                                        updateTramite(t.id, { ...tramiteActual, semanas: newSemanas });
                                      }
                                    }
```

### Fragmento insertado (Líneas 1345-1363):
```javascript
                                    setFasesData(prev => ({
                                      ...prev,
                                      [t.id]: {
                                        ...prev[t.id],
                                        real: val
                                      }
                                    }));
                                    // Apply auto-color immediately
                                    const tramiteActual = tramites.find(x => x.id === t.id);
                                    if (tramiteActual) {
                                      const data = { 
                                        programado: fd.programado || '', 
                                        real: val, 
                                        riesgo: fd.riesgo || 'I', 
                                        f2_programado: fd.f2_programado || '',
                                        f2_real: fd.f2_real || '' 
                                      };
                                      const semanas = tramiteActual.semanas || Array.from({ length: 48 }, () => ({ checked: false, color: null }));
                                      const newSemanas = applyFases(semanas, data, selectedYear);
                                      if (newSemanas !== semanas) {
                                        updateTramite(t.id, { ...tramiteActual, semanas: newSemanas });
                                      }
                                    }
```

### Fragmento insertado (Líneas 1378-1445):
```javascript
                                 // F2 milestone: Programado + dur*7 (or custom f2_programado)
                                 const f2BaseStr = fdLocal.f2_programado
                                   ? fdLocal.f2_programado
                                   : fdLocal.programado && wb_f1 >= 0
                                   ? addDays(fdLocal.programado, durLocal * 7)
                                   : '';
                                 const wb_f2 = fdLocal.f2_programado
                                   ? getWeekIndex(fdLocal.f2_programado, selectedYear)
                                   : wb_f1 >= 0 ? wb_f1 + durLocal : -1;
                                 const f2StartStr = formatDateDM(f2BaseStr);

                                 // F3 cierre: Programado + 3 weeks
                                 const cierreBaseStr = f2BaseStr
                                   ? addDays(f2BaseStr, 3 * 7)
                                   : '';
                                 const cierreDateStr = formatDateDM(cierreBaseStr);
                                 const wb_f3_last = wb_f2 >= 0 ? wb_f2 + 3 : -1;

                                 // Real dates calculations
                                 const realF1DateStr = fdLocal.real || '';
                                 const realF2DateStr = fdLocal.f2_real 
                                   ? fdLocal.f2_real
                                   : realF1DateStr
                                   ? addDays(realF1DateStr, durLocal * 7)
                                   : fdLocal.programado
                                   ? addDays(fdLocal.programado, durLocal * 7)
                                   : '';
                                 const realF3DateStr = realF2DateStr
                                   ? addDays(realF2DateStr, 3 * 7)
                                   : '';

                                 // Real week indices
                                 const wb_r1 = realF1DateStr ? getWeekIndex(realF1DateStr, selectedYear) : -1;
                                 const wb_r2 = realF2DateStr ? getWeekIndex(realF2DateStr, selectedYear) : -1;
                                 const wb_r3 = realF3DateStr ? getWeekIndex(realF3DateStr, selectedYear) : -1;

                                 const realF1Str = formatDateDM(realF1DateStr);
                                 const realF2Str = formatDateDM(realF2DateStr);
                                 const realF3Str = formatDateDM(realF3DateStr);

                                 return Array.from({ length: 48 }).map((_, i) => {
                                   const s = semanas[i] || { checked: false, color: null, color_real: null };
                                   const isPickerOpenTop = activeColorPicker === `TOP-${t.id}-${i}`;
                                   const isPickerOpenBot = activeColorPicker === `BOT-${t.id}-${i}`;
                                   const isPickerOpen = isPickerOpenTop || isPickerOpenBot;
                                   
                                   const isProgMilestone = (i === wb_f1 && progDateStr);
                                   const isF2StartMilestone = (i === wb_f2 && f2StartStr);
                                   const isCierreMilestone = (i === wb_f3_last && cierreDateStr);
                                   const milestoneText = isProgMilestone ? progDateStr : isF2StartMilestone ? f2StartStr : isCierreMilestone ? cierreDateStr : '';

                                   const isRealF1Milestone = (i === wb_r1 && realF1Str);
                                   const isRealF2Milestone = (i === wb_r2 && realF2Str);
                                   const isRealF3Milestone = (i === wb_r3 && realF3Str);
                                   const realMilestoneText = isRealF1Milestone ? realF1Str : isRealF2Milestone ? realF2Str : isRealF3Milestone ? realF3Str : '';

                                   let realColor = null;
                                   if (wb_r1 >= 0 && i >= wb_r1 && i < wb_r1 + durLocal) realColor = '#6c757d';
                                   if (wb_r2 >= 0 && i >= wb_r2 && i < wb_r2 + 3) realColor = '#4785ff';
                                   if (wb_r3 >= 0 && i === wb_r3) realColor = '#36b37e';
```

### Fragmento insertado (Líneas 1645-1760):
```javascript
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Riesgo</label>
            <select
              value={fasesData[riesgoModalTramite]?.riesgo || 'I'}
              onChange={(e) => {
                const newRiesgo = e.target.value;
                setFasesData(prev => ({
                  ...prev,
                  [riesgoModalTramite]: {
                    ...prev[riesgoModalTramite],
                    riesgo: newRiesgo
                  }
                }));
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 14,
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                boxSizing: 'border-box',
                marginBottom: 16
              }}
            >
              <option value="I">Riesgo I — 3 semanas</option>
              <option value="IIa">Riesgo IIa — 5 semanas</option>
              <option value="IIb">Riesgo IIb — 16 semanas</option>
              <option value="III">Riesgo III — 16 semanas</option>
            </select>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>F2 Programado (opcional)</label>
            <input
              type="date"
              value={fasesData[riesgoModalTramite]?.f2_programado || ''}
              onChange={(e) => {
                const val = e.target.value;
                setFasesData(prev => ({
                  ...prev,
                  [riesgoModalTramite]: {
                    ...prev[riesgoModalTramite],
                    f2_programado: val
                  }
                }));
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 14,
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                background: '#fff',
                boxSizing: 'border-box',
                marginBottom: 16
              }}
            />
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>F2 Real (opcional)</label>
            <input
              type="date"
              value={fasesData[riesgoModalTramite]?.f2_real || ''}
              onChange={(e) => {
                const val = e.target.value;
                setFasesData(prev => ({
                  ...prev,
                  [riesgoModalTramite]: {
                    ...prev[riesgoModalTramite],
                    f2_real: val
                  }
                }));
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 14,
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                background: '#fff',
                boxSizing: 'border-box',
                marginBottom: 16
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setRiesgoModalTramite(null)}
                style={{
                  padding: '8px 20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#475569'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const fd = fasesData[riesgoModalTramite] || {};
                  setRiesgoModalTramite(null);
                  // Re-apply colors with current config
                  const tramiteActual = tramites.find(x => x.id === riesgoModalTramite);
                  if (tramiteActual) {
                    const data = {
                      programado: fd.programado || '',
                      real: fd.real || '',
                      f2_programado: fd.f2_programado || '',
                      f2_real: fd.f2_real || '',
                      riesgo: fd.riesgo || 'I'
                    };
                    if (data.programado) {
                      const semanas = tramiteActual.semanas || Array.from({ length: 48 }, () => ({ checked: false, color: null }));
                      const newSemanas = applyFases(semanas, data, selectedYear);
                      if (newSemanas !== semanas) {
                        updateTramite(tramiteActual.id, { ...tramiteActual, semanas: newSemanas });
                      }
                    }
                  }
                }}
```

## Archivo modificado: `CronogramaView.js`

**Código introducido:**
```javascript
                                 // F2 milestone: Programado + dur*7 (or custom f2_programado)
                                 const f2BaseStr = fdLocal.f2_programado
                                   ? fdLocal.f2_programado
                                   : fdLocal.programado && wb_f1 >= 0
                                   ? addDays(fdLocal.programado, durLocal * 7)
                                   : '';
                                 const wb_f2 = fdLocal.f2_programado
                                   ? getWeekIndex(fdLocal.f2_programado, selectedYear)
                                   : wb_f1 >= 0 ? wb_f1 + durLocal : -1;
                                 const f2StartStr = formatDateDM(f2BaseStr);
```
