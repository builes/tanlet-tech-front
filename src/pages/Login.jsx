import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await fetch(
        "http://ec2-3-85-50-12.compute-1.amazonaws.com:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: data.usuario.id,
          nombre: data.usuario.nombre,
          email: data.usuario.email,
          telefono: data.usuario.telefono,
          rol: data.usuario.rol,
        })
      );

      navigate("/servicios");
    } catch (err) {
      setMensaje(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light px-3">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-body p-4">
            <h2 className="text-center mb-4 fw-bold text-dark">
              Iniciar sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ejemplo@email.com"
                  className="form-control rounded-3"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="form-control rounded-3 pe-5"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                    style={{ border: "none", background: "transparent" }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 rounded-3 fw-semibold"
              >
                Entrar
              </button>
            </form>

            {/* Link a registro */}
            <p className="mt-3 text-center text-muted">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary fw-semibold">
                Regístrate
              </Link>
            </p>

            {/* Mensaje de error */}
            {mensaje && (
              <div className="alert alert-danger text-center mt-3 py-2">
                {mensaje}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
