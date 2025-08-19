import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Puedes mantenerlo si quieres

export const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    rol: "cliente",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al registrar usuario");

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/servicios");
    } catch (err) {
      setMensaje(err.message);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="ejemplo@email.com"
              required
            />
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="number"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="form-control"
              placeholder="+57 300 123 4567"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="********"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Rol */}
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="form-select"
            >
              <option value="cliente">Cliente</option>
              <option value="prestador">Prestador</option>
            </select>
          </div>

          {/* Botón */}
          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center mt-3">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="fw-bold text-decoration-none">
            Inicia sesión
          </Link>
        </p>

        {/* Mensajes de error */}
        {mensaje && <div className="alert alert-danger mt-3">{mensaje}</div>}
      </div>
    </div>
  );
};
