import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import MainLayout from '../Layouts/MainLayout';
import PerfilUsuario from '../Pages/PerfilUsuario';
import MisEmprendimientos from '../Pages/MisEmprendimientos';
import CrearEmprendimiento from '../Pages/CrearEmprendimiento';
import EditarEmprendimiento from '../Pages/EditarEmprendimiento';
import DetalleEmprendimiento from '../Pages/DetalleEmprendimiento';
import AcercaDe from '../Pages/AcercaDe';
import Contacto from '../Pages/Contacto';
import Recursos from '../Pages/Recursos';
import Ayuda from '../Pages/Ayuda';
import PreguntasFrecuentes from '../Pages/PreguntasFrecuentes';
import TerminosUso from '../Pages/TerminosUso';
import Privacidad from '../Pages/Privacidad';
import ReportarProblema from '../Pages/ReportarProblema';
import Emprendimientos from '../Pages/Emprendimientos';
import BuscarEmprendimientos from '../Pages/BuscarEmprendimientos';
import ReportesAdmin from '../Pages/Admin/ReportesAdmin'; // Nueva importación

import ConfiguracionUsuario from '../Pages/ConfiguracionUsuario';

// Componente para rutas privadas
const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.esAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Rutas públicas */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="emprendimientos" element={<Emprendimientos />} />
        <Route path="emprendimiento/:id" element={<DetalleEmprendimiento />} />
        <Route path="buscar-emprendimientos" element={<BuscarEmprendimientos />} />
        <Route path="acerca-de" element={<AcercaDe />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="recursos" element={<Recursos />} />
        <Route path="ayuda" element={<Ayuda />} />
        <Route path="faq" element={<PreguntasFrecuentes />} />
        <Route path="terminos-uso" element={<TerminosUso />} />
        <Route path="privacidad" element={<Privacidad />} />
        <Route path="reportar-problema" element={<ReportarProblema />} />
        <Route path="configuracion" element={<ConfiguracionUsuario />} />

        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="perfil" element={
          <PrivateRoute>
            <PerfilUsuario />
          </PrivateRoute>
        } />
        <Route path="mis-emprendimientos" element={
          <PrivateRoute>
            <MisEmprendimientos />
          </PrivateRoute>
        } />
        <Route path="crear-emprendimiento" element={
          <PrivateRoute>
            <CrearEmprendimiento />
          </PrivateRoute>
        } />
        <Route path="editar-emprendimiento/:id" element={
          <PrivateRoute>
            <EditarEmprendimiento />
          </PrivateRoute>
        } />

        {/* Rutas exclusivas para administradores */}
        <Route path="admin/reportes" element={
          <PrivateRoute adminOnly>
            <ReportesAdmin />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;