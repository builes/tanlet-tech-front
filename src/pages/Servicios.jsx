import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/servicios");
        if (!res.ok) throw new Error("Error al obtener servicios");

        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Error desconocido");

        // ✅ Ordenar por distancia desde el inicio
        const ordenados = [...data.data].sort(
          (a, b) => a.distancia_metros - b.distancia_metros
        );

        setServicios(ordenados);
        setFilteredServicios(ordenados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  // Filtrar servicios cuando cambie la búsqueda
  useEffect(() => {
    const lower = busqueda.toLowerCase();

    const filtrados = servicios
      .filter(
        (s) =>
          s.nombre_servicio.toLowerCase().includes(lower) ||
          (s.descripcion && s.descripcion.toLowerCase().includes(lower))
      )
      // ✅ Mantener ordenados por distancia al filtrar
      .sort((a, b) => a.distancia_metros - b.distancia_metros);

    setFilteredServicios(filtrados);
  }, [busqueda, servicios]);

  if (loading)
    return <div className="text-center mt-5">Cargando servicios...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Servicios</h1>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar servicio por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredServicios.length > 0 ? (
          filteredServicios.map((servicio) => (
            <div key={servicio.id_servicio} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {servicio.imagen_url && (
                  <img
                    src={servicio.imagen_url}
                    className="card-img-top"
                    alt={servicio.nombre_servicio}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{servicio.nombre_servicio}</h5>
                  <p className="card-text text-muted">
                    {servicio.descripcion || "Sin descripción"}
                  </p>
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
                    <strong>Distancia:</strong> {servicio.distancia_metros}{" "}
                    metros
                  </p>
                </div>
                <div className="card-footer text-end">
                  <Link
                    to={`/servicios/${servicio.id_servicio}`}
                    className="btn btn-primary btn-sm"
                    servicio={servicio}
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No se encontraron servicios.</div>
          </div>
        )}
      </div>
    </div>
  );
};
