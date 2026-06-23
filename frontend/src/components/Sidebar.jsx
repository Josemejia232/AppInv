import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, FileText, X, Menu } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ open, onToggle }) {
  const links = [
    { name: 'Vista General', icon: LayoutDashboard, path: '/' },
    { name: 'Cronograma', icon: CalendarDays, path: '/cronograma' },
    { name: 'Inspección Producto', icon: FileText, path: '/inspeccion' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Toggle button (always visible when sidebar is closed on desktop, or on mobile) */}
      <button
        onClick={onToggle}
        className={clsx(
          "fixed top-4 z-50 bg-[#110c2e] text-white rounded-lg p-2 shadow-lg transition-all duration-300 hover:bg-indigo-800",
          open ? "left-[268px] max-lg:left-4" : "left-4"
        )}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={clsx(
          "h-screen bg-[#110c2e] text-slate-300 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300",
          open ? "w-[260px]" : "w-0 -translate-x-full lg:w-[68px] lg:translate-x-0"
        )}
      >
        <div className={clsx(
          "flex items-center p-6 overflow-hidden",
          !open && "lg:justify-center lg:px-0"
        )}>
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              I
            </div>
            <span className={clsx(
              "text-white font-bold text-xl tracking-wide transition-opacity duration-200",
              !open && "lg:opacity-0 lg:sr-only"
            )}>INVIMA</span>
          </div>
        </div>

        <div className={clsx("px-6 pb-6 overflow-hidden", !open && "lg:opacity-0 lg:sr-only")}>
          <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider whitespace-nowrap">Gestión de Trámites</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className={clsx(!open && "lg:opacity-0 lg:sr-only")}>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3 px-2">FORMATOS</p>
          </div>
          <div className="flex flex-col gap-1 items-stretch">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "hover:bg-white/5 hover:text-white border border-transparent",
                  !open && "lg:justify-center lg:px-2"
                )}
                title={!open ? link.name : undefined}
              >
                <link.icon size={18} className="opacity-80 shrink-0" />
                <span className={clsx(!open && "lg:sr-only")}>{link.name}</span>
                {link.name === 'Vista General' && (
                  <span className={clsx(
                    "w-5 h-5 flex items-center justify-center rounded-full bg-indigo-600/40 text-[10px] text-indigo-200",
                    !open && "lg:sr-only",
                    "ml-auto"
                  )}>1</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
