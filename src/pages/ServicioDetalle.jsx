import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Importamos el calendario
import { CalendarioReservas } from "../components/CalendarioReservas";

export const ServicioDetalle = () => {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/servicios/${id}`);
        if (!res.ok) throw new Error("Error al obtener servicio");

        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Error desconocido");

        setServicio(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!servicio)
    return <div className="alert alert-warning">Servicio no encontrado</div>;

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">
        ⬅ Volver
      </Link>

      <div className="card shadow mb-4">
        {servicio.imagen_url && (
          <img
            src={servicio.imagen_url}
            className="card-img-top"
            alt={servicio.nombre_servicio}
            style={{ height: "300px", objectFit: "cover" }}
          />
        )}
        <div className="card-body">
          <h2>{servicio.nombre_servicio}</h2>
          <p className="text-muted">{servicio.descripcion}</p>
          <p>
            <strong>Precio:</strong> ${servicio.precio}
          </p>
          <p>
            <strong>Duración:</strong> {servicio.duracion_minutos} min
          </p>
          <p>
            <strong>Empresa:</strong> {servicio.nombre_empresa}
          </p>
          <p>
            <strong>Distancia:</strong> {servicio.distancia_metros} metros
          </p>
        </div>
      </div>

      {/* Selección de fecha */}
      <div className="mb-3">
        <label className="form-label">Selecciona una fecha</label>
        <input
          type="date"
          className="form-control"
          value={fechaSeleccionada}
          min={new Date().toISOString().split("T")[0]} // 🚀 evita fechas anteriores a hoy
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      {/* Calendario de reservas */}
      {fechaSeleccionada && (
        <CalendarioReservas
          idPrestador={servicio.id_usuario} // prestador dueño del servicio
          idServicio={servicio.id_servicio}
          fecha={fechaSeleccionada}
        />
      )}
    </div>
  );
};
