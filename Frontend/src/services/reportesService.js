import api from './api';

export const getReportes = (estado = 'pendiente') => 
  api.get(`/reportes?estado=${estado}`);

export const resolverReporte = (idReporte, estado) => 
  api.patch('/reportes/resolver', { id_reporte: idReporte, estado });

export const eliminarEmprendimiento = (idEmprendimiento) => 
  api.delete(`/emprendimientos/${idEmprendimiento}`);