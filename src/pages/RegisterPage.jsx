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
      setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión.");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleRegister}>
        <h1>Crear cuenta</h1>
        <p>Regístrate para comprar boletos y ver tus resultados</p>

        <input
          type="text"
          name="full_name"
          placeholder="Nombre completo"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <span className="error">{error}</span>}
        {success && <span className="success">{success}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="helper-text">
          ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}