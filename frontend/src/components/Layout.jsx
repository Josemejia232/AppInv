import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-[260px] max-lg:ml-0' : 'ml-0 lg:ml-[68px]'}`}>
        <main className="flex-1 p-3 sm:p-6 min-h-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
