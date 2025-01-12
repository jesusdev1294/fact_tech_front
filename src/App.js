import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Facturas from './Facturas';
import Clientes from './Clientes';
import Productos from './Productos';
import Sidebar from './Sidebar'; // El menú lateral lo movemos a un componente aparte

function App() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/facturas" element={<Facturas />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="*" element={<h1>Página no encontrada</h1>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
