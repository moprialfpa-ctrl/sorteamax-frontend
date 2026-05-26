import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/users/", form);
      setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesion.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎰</div>
          <h1 className="auth-logo-title">
            Sortea<span className="auth-logo-max">Max</span>
          </h1>
          <p className="auth-logo-sub">Crea tu cuenta gratis</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Nombre completo</label>
            <input
              className="auth-input"
              type="text"
              name="full_name"
              placeholder="Tu nombre completo"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Correo</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Contrasena</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Minimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link">
              Iniciar sesion
            </Link>
          </p>
          <Link to="/" className="auth-link">
            Volver al inicio
          </Link>
        </div>

        <p className="auth-copy">2026 SorteaMax. Todos los derechos reservados</p>
      </div>
    </div>
  );
}
