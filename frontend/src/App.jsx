import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import VistaGeneral from './pages/VistaGeneral';
import Cronograma from './pages/Cronograma';
import { TramiteProvider } from './context/TramiteContext';

function App() {
  return (
    <Router>
      <TramiteProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<VistaGeneral />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/inspeccion" element={<div className="p-6">Página de Inspección en construcción</div>} />
          </Routes>
        </Layout>
      </TramiteProvider>
    </Router>
  );
}

export default App;
