import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asume que tienes un AuthContext

const PrivateRoute = ({ children, isAdmin = false }) => {
  const { user } = useAuth(); // Obtén el usuario del contexto

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && !user.esAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;