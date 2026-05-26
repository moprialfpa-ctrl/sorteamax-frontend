// src/pages/AdminDeunaPaymentsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDeunaPaymentsPage() {
  const [me, setMe] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const [meRes, paymentsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/admin/payments/pending-manual"),
      ]);
      if (meRes.data.role !== "admin") {
        navigate("/user/dashboard");
        return;
      }
      setMe(meRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Error al cargar pagos pendientes"
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const confirmPayment = async (id) => {
    setError("");
    setMessage("");
    try {
      await api.post(`/admin/payments/${id}/confirm`);
      setMessage(`Pago ${id} confirmado y boletos generados.`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al confirmar pago");
    }
  };

  const rejectPayment = async (id) => {
    setError("");
    setMessage("");
    try {
      await api.post(`/admin/payments/${id}/reject`);
      setMessage(`Pago ${id} rechazado.`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al rechazar pago");
    }
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>
            Sortea<span>Max</span>
          </h1>
          {me && <p>Pagos Deuna pendientes · {me.full_name}</p>}
        </div>
        <div className="topbar-right">
          <button
            className="btn-topbar"
            onClick={() => navigate("/admin/dashboard")}
          >
            Volver
          </button>
          <button
            className="btn-topbar btn-topbar-danger"
            onClick={logout}
          >
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="msg-error">{error}</div>}
        {message && <div className="msg-success">{message}</div>}

        {loading ? (
          <p>Cargando pagos...</p>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <p>No hay pagos pendientes.</p>
          </div>
        ) : (
          <div className="section-card">
            <div className="section-header">
              <div className="section-header-icon">💳</div>
              <h2>Pagos Deuna pendientes</h2>
            </div>
            <div style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>ID Pago</th>
                    <th>Usuario</th>
                    <th>Sorteo</th>
                    <th>Cantidad</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          maxWidth: "140px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.id}
                      </td>
                      <td
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          maxWidth: "140px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.user_id}
                      </td>
                      <td
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          maxWidth: "140px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.draw_id}
                      </td>
                      <td>{p.quantity}</td>
                      <td style={{ fontWeight: 600 }}>
                        ${p.amount.toFixed ? p.amount.toFixed(2) : p.amount}
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {new Date(p.created_at).toLocaleString("es-EC")}
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-small"
                          onClick={() => confirmPayment(p.id)}
                        >
                          Confirmar
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          style={{ marginLeft: 8 }}
                          onClick={() => rejectPayment(p.id)}
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}