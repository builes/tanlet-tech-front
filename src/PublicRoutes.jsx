import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children }) => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? <Navigate to="/servicios" replace /> : children;
};
