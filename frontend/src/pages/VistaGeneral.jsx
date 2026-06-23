import React, { useState } from 'react';
import { Download, Search, Pencil, Plus, X } from 'lucide-react';
import { useTramites } from '../context/TramiteContext';

const valueOr = (v) => v ?? '';

const emptyTramite = {
  cliente: 'Cliente A',
  producto: '',
  proveedor: '',
  tipo: 'NA',
  riesgo: 'I',
  tipo_tramite: 'Registro Sanitario',
  nombre_registro_sanitario: '',
  tarifa: '',
  valor: '',
  estado_id_reenvio: 'Intención de trámite enviada',
};

export default function VistaGeneral() {
  const { tramites, loading, refetch } = useTramites();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyTramite });

  const total = tramites.length;
  const enProceso = tramites.filter(t => t.estado_id_reenvio && !t.estado_id_reenvio.toLowerCase().includes('completado')).length;
  const completados = tramites.filter(t => t.estado_id_reenvio && t.estado_id_reenvio.toLowerCase().includes('completado')).length;
  const conRS = tramites.filter(t => t.registro_sanitario_obtenido_no).length;
  const pendientes = total - completados;

  const cards = [
    { title: 'TOTAL TRÁMITES', value: total, gradient: 'from-[#7e6ddb] to-[#998be8]' },
    { title: 'EN PROCESO', value: enProceso, gradient: 'from-[#ff75b8] to-[#ff8fce]' },
    { title: 'COMPLETADOS', value: completados, gradient: 'from-[#22c55e] to-[#4ade80]' },
    { title: 'CON RS OBTENIDO', value: conRS, gradient: 'from-[#06b6d4] to-[#22d3ee]' },
    { title: 'PENDIENTES', value: pendientes, gradient: 'from-[#ff5b5b] to-[#ff8066]' },
  ];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tramites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear');
      setShowForm(false);
      setForm({ ...emptyTramite });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <h1 className="text-[16px] font-bold text-slate-800">Vista General</h1>
        <div className="flex items-center gap-3">
          <div className="bg-slate-200 px-3 py-1 rounded-full text-xs text-slate-600 font-medium whitespace-nowrap">
            {total} / {total} trámites
          </div>
          <button className="bg-[#10b981] hover:bg-[#059669] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap">
            <Download size={14} />
            Exportar CSV
          </button>
          <button onClick={() => { setForm({ ...emptyTramite }); setShowForm(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap">
            <Plus size={14} />
            Nuevo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 shrink-0 max-w-3xl">
        {cards.map((card, i) => (
          <div key={i} className={`rounded-xl p-3 text-white shadow-sm bg-gradient-to-r ${card.gradient} relative overflow-hidden flex flex-col justify-between h-[45px]`}>
            <div className="absolute -right-2 -top-4 w-16 h-16 bg-white/20 rounded-full"></div>
            <div className="absolute right-6 -bottom-6 w-16 h-16 bg-white/10 rounded-full"></div>
            <h3 className="text-[8px] font-bold uppercase tracking-wider relative z-10 leading-tight">{card.title}</h3>
            <div className="text-xl font-bold text-right relative z-10 -mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-2.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border border-slate-100 shrink-0">
        <div className="relative flex-1 max-w-full sm:max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
          <input type="text" placeholder="Buscar producto, radicado..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-xs focus:ring-1 focus:ring-indigo-100 outline-none text-slate-600" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
          {['producto', 'estado', 'tipo'].map((filter, i) => (
            <div key={i} className="flex-1 flex items-center relative">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none cursor-pointer appearance-none">
                <option>Todos los {filter === 'producto' ? 'productos' : filter === 'estado' ? 'estados' : 'tipos'}</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <Pencil size={12} className="text-slate-400 absolute -right-4 top-1/2 -translate-y-1/2" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-1 flex-1 min-h-0 flex flex-col">
        <div className="overflow-x-auto pb-2 flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-xs text-slate-400">Cargando...</div>
          ) : (
            <table className="w-full text-left whitespace-nowrap min-w-[4000px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th rowSpan="2" className="bg-[#4b5563] text-white py-1.5 px-2 text-center text-[10px] uppercase font-bold border border-slate-600 w-8">#</th>
                  <th colSpan="4" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">INFORMACIÓN DEL PRODUCTO</th>
                  <th colSpan="4" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">OBTENCIÓN DE REGISTRO SANITARIO / CERTIFICADO</th>
                  <th colSpan="5" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">SOLICITUD DE RADICADO</th>
                  <th colSpan="5" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">AUTO REQUERIMIENTO</th>
                  <th colSpan="5" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">RESPUESTA INVIMA / RESOLUCIÓN / CERTIFICACIÓN / AUTORIZACIÓN</th>
                  <th colSpan="6" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">CAMBIO DE IMPORTADOR A CGL</th>
                  <th colSpan="4" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">CODIGOS GMDN</th>
                  <th colSpan="2" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">CODIGOS UDI-DI</th>
                  <th colSpan="2" className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">ESTANDAR SEMANTICO</th>
                  <th className="bg-[#4b5563] text-white py-1.5 px-3 text-center text-[10px] uppercase font-bold border border-slate-600">OBSERVACIONES</th>
                </tr>
                <tr className="bg-white border-b border-slate-200 text-slate-700">
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[130px] border-r border-slate-200">Producto</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[170px] border-r border-slate-200">Proveedor</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[70px] border-r border-slate-200">Tipo</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[70px] border-r border-slate-200">Riesgo</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[120px] border-r border-slate-200">Tipo de Trámite</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[160px] border-r border-slate-200">Nombre del Producto en el Registro Sanitario</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[70px] border-r border-slate-200">Tarifa</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[80px] border-r border-slate-200">Valor</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[120px] border-r border-slate-200">Estado / ID Reenvío</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[100px] border-r border-slate-200">Fecha Estimada de Radicado</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Fecha de Radicado</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Radicado No.</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Llave / Clave</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Fecha del Auto</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[85px] border-r border-slate-200">Auto No.</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Fecha Límite</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[85px] border-r border-slate-200">Fecha</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Radicado No.</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[120px] border-r border-slate-200">Fecha Estimada de Obtención de Resolución</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[110px] border-r border-slate-200">Fecha de Obtención de Resolución</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[85px] border-r border-slate-200">Resolución</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[120px] border-r border-slate-200">Registro Sanitario Obtenido No.</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Expediente</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Fecha de Radicado</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Radicado No.</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[85px] border-r border-slate-200">Llave</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[110px] border-r border-slate-200">Fecha Estimada de Resolución</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[100px] border-r border-slate-200">Fecha de Resolución</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[110px] border-r border-slate-200">Resolución Obtenida</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[110px] border-r border-slate-200">Nombre Genérico</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[70px] border-r border-slate-200">Código</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[130px] border-r border-slate-200">Descripción</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[130px] border-r border-slate-200">Definición</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[85px] border-r border-slate-200">UDI1</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[85px] border-r border-slate-200">UDI2</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Fecha de Cargue</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[95px] border-r border-slate-200">Radicado</th>
                  <th className="py-2 px-3 text-[11px] font-semibold min-w-[150px]">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {tramites.map((t, i) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 text-[11px] text-slate-600 text-center border-r border-slate-200">{i + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200">
                      <select className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] outline-none text-slate-700">
                        <option>{valueOr(t.producto)}</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.proveedor)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.tipo)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.riesgo)}</td>
                    <td className="py-2 px-3 border-r border-slate-200">
                      <select className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] outline-none text-slate-700">
                        <option>{valueOr(t.tipo_tramite)}</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.nombre_registro_sanitario)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.tarifa)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.valor)}</td>
                    <td className="py-2 px-3 border-r border-slate-200">
                      <select className="w-full bg-white border border-slate-300 rounded p-1 text-[11px] outline-none text-slate-700">
                        <option>{valueOr(t.estado_id_reenvio)}</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_estimada_radicado)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_radicado)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.radicado_no)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.llave_clave)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_auto)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.auto_no)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_limite)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.radicado_no_2)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_estimada_obtencion_resolucion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_obtencion_resolucion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.resolucion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.registro_sanitario_obtenido_no)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.expediente)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_radicado_2)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.radicado_no_3)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.llave)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_estimada_resolucion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_resolucion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.resolucion_obtenida)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.nombre_generico)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.codigo)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.descripcion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.definicion)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.udi1)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.udi2)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.fecha_cargue)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 border-r border-slate-200">{valueOr(t.radicado)}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-600">{valueOr(t.observaciones)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Tramite Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800">Nuevo Trámite</h2>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-slate-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'producto', label: 'Producto' },
                    { name: 'proveedor', label: 'Proveedor' },
                    { name: 'tipo', label: 'Tipo' },
                    { name: 'riesgo', label: 'Riesgo' },
                    { name: 'tipo_tramite', label: 'Tipo de Trámite' },
                    { name: 'nombre_registro_sanitario', label: 'Nombre en RS' },
                    { name: 'tarifa', label: 'Tarifa' },
                    { name: 'valor', label: 'Valor' },
                    { name: 'cliente', label: 'Cliente' },
                  ].map(f => (
                    <div key={f.name} className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">{f.label}</label>
                      <input name={f.name} value={form[f.name]} onChange={handleChange} className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-200" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Estado</label>
                    <select name="estado_id_reenvio" value={form.estado_id_reenvio} onChange={handleChange} className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs outline-none">
                      <option>Intención de trámite enviada</option>
                      <option>En proceso</option>
                      <option>Completado</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-md">Cancelar</button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Crear Trámite</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
