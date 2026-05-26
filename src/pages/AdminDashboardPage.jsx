import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StatusBadge({ status }) {
  const config = {
    selling: { cls: "badge badge-blue", text: "En venta" },
    ready: { cls: "badge badge-gold", text: "Listo" },
    closed: { cls: "badge badge-yellow", text: "Cerrado" },
    drawn: { cls: "badge badge-green", text: "Finalizado" },
  };
  const c = config[status] || { cls: "badge badge-gray", text: status };
  return <span className={c.cls}>{c.text}</span>;
}

export default function AdminDashboardPage() {
  const [draws, setDraws] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    ticket_price: 1,
    sales_threshold_amount: 100,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meRes, drawsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/draws/"),
      ]);
      if (meRes.data.role !== "admin") {
        navigate("/user/dashboard");
        return;
      }
      setMe(meRes.data);
      setDraws(drawsRes.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "title" ? e.target.value : Number(e.target.value),
    });
  };

  const handleCreateDraw = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setActionLoading(true);
    try {
      await api.post("/draws/", form);
      setMessage("Sorteo creado correctamente");
      setForm({ title: "", ticket_price: 1, sales_threshold_amount: 100 });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear el sorteo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseDraw = async (drawId) => {
    setError("");
    setMessage("");
    setActionLoading(true);
    try {
      const res = await api.post(`/draws/${drawId}/close`);
      setMessage(res.data.message || "Sorteo cerrado correctamente");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al cerrar el sorteo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunDraw = async (drawId) => {
    setError("");
    setMessage("");
    setActionLoading(true);
    try {
      const res = await api.post(`/draws/${drawId}/run`);
      setMessage(res.data.message || "Sorteo ejecutado correctamente");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al ejecutar el sorteo");
    } finally {
      setActionLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>
            Sortea<span>Max</span>
          </h1>
          {me && <p>Panel de administrador · {me.full_name}</p>}
        </div>
        <div className="topbar-right">
          {/* Botón nuevo para ir al panel de pagos Deuna */}
          <button
            className="btn-topbar"
            onClick={() => navigate("/admin/deuna-payments")}
          >
            Pagos Deuna
          </button>

          <button className="btn-topbar" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-card">
            <h3>Total sorteos</h3>
            <p>{draws.length}</p>
          </div>
          <div className="stat-card">
            <h3>En venta</h3>
            <p>{draws.filter((d) => d.status === "selling").length}</p>
          </div>
          <div className="stat-card">
            <h3>Listos</h3>
            <p>{draws.filter((d) => d.status === "ready").length}</p>
          </div>
          <div className="stat-card">
            <h3>Finalizados</h3>
            <p>{draws.filter((d) => d.status === "drawn").length}</p>
          </div>
        </div>

        <div className="admin-grid">
          <div className="section-card">
            <div className="section-header">
              <div className="section-header-icon">+</div>
              <h2>Crear sorteo</h2>
            </div>
            <div className="section-body">
              <form onSubmit={handleCreateDraw}>
                <div className="form-group">
                  <span className="form-label">Titulo del sorteo</span>
                  <input
                    className="form-input"
                    type="text"
                    name="title"
                    placeholder="Ej: Sorteo de verano 2026"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <span className="form-label">Precio del boleto ($)</span>
                  <input
                    className="form-input"
                    type="number"
                    name="ticket_price"
                    placeholder="1.00"
                    value={form.ticket_price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <span className="form-label">
                    Umbral minimo de ventas ($)
                  </span>
                  <input
                    className="form-input"
                    type="number"
                    name="sales_threshold_amount"
                    placeholder="100.00"
                    value={form.sales_threshold_amount}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <button
                  className="form-btn"
                  type="submit"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Guardando..." : "Crear sorteo"}
                </button>
              </form>

              {message && <div className="msg-success">{message}</div>}
              {error && <div className="msg-error">{error}</div>}
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <div className="section-header-icon">☰</div>
              <h2>Sorteos registrados</h2>
            </div>
            <div className="section-body" style={{ padding: "0" }}>
              {loading ? (
                <p style={{ padding: "20px" }}>Cargando sorteos...</p>
              ) : draws.length === 0 ? (
                <div className="empty-state">
                  <p>No hay sorteos registrados todavia.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Precio</th>
                      <th>Ventas</th>
                      <th>Boletos</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draws.map((draw) => (
                      <tr key={draw.id}>
                        <td style={{ fontWeight: "600" }}>{draw.title}</td>
                        <td>${draw.ticket_price}</td>
                        <td>${draw.sales_amount}</td>
                        <td>{draw.tickets_sold}</td>
                        <td>
                          <StatusBadge status={draw.status} />
                        </td>
                        <td>
                          <div className="actions">
                            {(draw.status === "selling" ||
                              draw.status === "ready") && (
                              <button
                                className="btn btn-warning btn-small"
                                onClick={() => handleCloseDraw(draw.id)}
                                disabled={actionLoading}
                              >
                                Cerrar
                              </button>
                            )}
                            {draw.status === "closed" && (
                              <button
                                className="btn btn-primary btn-small"
                                onClick={() => handleRunDraw(draw.id)}
                                disabled={actionLoading}
                              >
                                Ejecutar
                              </button>
                            )}
                            {draw.status === "drawn" && (
                              <button
                                className="btn btn-success btn-small"
                                onClick={() =>
                                  navigate(`/admin/draws/${draw.id}/results`)
                                }
                              >
                                Ver resultados
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}