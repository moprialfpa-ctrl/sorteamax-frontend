import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      const loginResponse = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      localStorage.setItem("token", loginResponse.data.access_token);
      const meResponse = await api.get("/auth/me");
      if (meResponse.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Datos incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎰</div>
          <h1>Sortea<span>Max</span></h1>
          <p>Plataforma oficial de sorteos en linea</p>
        </div>

        <div className="auth-divider" />

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div>
            <span className="auth-label">Correo</span>
            <input
              className="auth-input"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <span className="auth-label">Contrasena</span>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Iniciar sesion"}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-link-text">
          No tienes cuenta?{" "}
          <Link to="/register">Crear cuenta gratis</Link>
        </p>

        <p className="auth-link-text" style={{ marginTop: "4px" }}>
          <Link to="/">Volver al inicio</Link>
        </p>

        <p style={{ fontSize: "11px", textAlign: "center", color: "#9ca3af", marginTop: "4px" }}>
          2026 SorteaMax. Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}