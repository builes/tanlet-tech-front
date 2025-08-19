import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Servicios } from "./pages/Servicios";
import { PublicRoutes } from "./PublicRoutes";
import { ServicioDetalle } from "./pages/ServicioDetalle";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />

        <Route path="/servicios" element={<Servicios />} />

        <Route path="/servicios/:id" element={<ServicioDetalle />} />

        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </>
  );
};
