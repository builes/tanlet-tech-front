import { useEffect, useState } from "react";

export const CalendarioReservas = ({ idPrestador, idServicio, fecha }) => {
  const [franjas, setFranjas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const idUsuarioLogueado = 1; // ⚡ reemplazar con el id del usuario autenticado

  useEffect(() => {
    // Generar franjas de 8:00 a 18:00 en pasos de 30 minutos
    const generarFranjas = () => {
      const inicio = 8;
      const fin = 18;
      const intervalos = [];
      for (let h = inicio; h < fin; h++) {
        intervalos.push(`${h.toString().padStart(2, "0")}:00`);
        intervalos.push(`${h.toString().padStart(2, "0")}:30`);
      }
      setFranjas(intervalos);
    };

    generarFranjas();
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/reservas/${idPrestador}?fecha=${fecha}`
        );
        const data = await res.json();
        if (data.ok) {
          // Guardamos todas las reservas (con id_usuario_cliente) para saber de quién son
          setReservas(data.data);
        }
      } catch (err) {
        console.error("Error al obtener reservas:", err);
      }
    };

    if (fecha) fetchReservas();
  }, [idPrestador, fecha]);

  const handleReservar = async (hora) => {
    try {
      const res = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_prestador: idPrestador,
          id_usuario_cliente: idUsuarioLogueado,
          id_servicio: idServicio,
          fecha_reserva: fecha,
          hora_inicio: hora,
          hora_fin: sumarMediaHora(hora),
        }),
      });

      const data = await res.json();

      if (data.ok) {
        alert(`✅ Reserva confirmada a las ${hora} para el ${fecha}`);
        setReservas((prev) => [
          ...prev,
          {
            id_reserva: data.id_reserva, // 👈 ahora usamos el id real
            id_usuario_cliente: idUsuarioLogueado,
            hora_inicio: hora,
          },
        ]);
      } else {
        alert("❌ " + (data.error || "No se pudo realizar la reserva"));
      }
    } catch (error) {
      console.error("Error al reservar:", error);
      alert("❌ Error en el servidor");
    }
  };

  const handleCancelar = async (idReserva, hora) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/reservas/${idReserva}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario_cliente: idUsuarioLogueado }),
        }
      );

      const data = await res.json();

      if (data.ok) {
        alert("✅ Reserva cancelada");
        // eliminar solo la reserva cancelada
        setReservas((prev) => prev.filter((r) => r.id_reserva !== idReserva));
      } else {
        alert("❌ " + (data.error || "No se pudo cancelar la reserva"));
      }
    } catch (err) {
      console.error("Error al cancelar:", err);
      alert("❌ Error en el servidor");
    }
  };

  // Auxiliar: sumar 30 minutos a la hora seleccionada
  const sumarMediaHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + 30);
    return date.toTimeString().substring(0, 5);
  };

  return (
    <div className="container mt-3">
      <h4>Selecciona una franja horaria</h4>
      <p>
        <strong>Fecha:</strong> {fecha}
      </p>
      <div className="row row-cols-2 row-cols-md-3 g-2">
        {franjas.map((hora) => {
          const reserva = reservas.find(
            (r) => r.hora_inicio.substring(0, 5) === hora
          );
          const estaOcupada = Boolean(reserva);
          const esPropia =
            reserva && reserva.id_usuario_cliente === idUsuarioLogueado;

          return (
            <div key={hora} className="col">
              {estaOcupada ? (
                esPropia ? (
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => handleCancelar(reserva.id_reserva, hora)}
                  >
                    ❌ Cancelar {hora}
                  </button>
                ) : (
                  <button className="btn btn-danger w-100" disabled>
                    {hora} ⛔ Ocupado
                  </button>
                )
              ) : (
                <button
                  className="btn btn-success w-100"
                  onClick={() => handleReservar(hora)}
                >
                  {hora} ✅ Libre
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
