import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StatusBadge({ status }) {
  const config = {
    confirmed: { cls: "badge badge-green", text: "Confirmado" },
    pending: { cls: "badge badge-yellow", text: "Pendiente" },
    failed: { cls: "badge badge-red", text: "Fallido" },
  };
  const c = config[status] || { cls: "badge badge-gray", text: status };
  return <span className={c.cls}>{c.text}</span>;
}

function PrizeBadge({ prizeType }) {
  if (!prizeType) return <span className="badge badge-gray">Sin premio</span>;
  const config = {
    jackpot: { cls: "badge badge-red", text: "Jackpot" },
    tier10: { cls: "badge badge-blue", text: "Tier 10" },
    free_ticket: { cls: "badge badge-green", text: "Boleto gratis" },
  };
  const c = config[prizeType] || { cls: "badge badge-gray", text: prizeType };
  return <span className={c.cls}>{c.text}</span>;
}

export default function MyTicketsPage() {
  const [me, setMe] = useState(null);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pagos");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError("");
    setLoading(true);
    try {
      const [meRes, paymentsRes, ticketsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/payments/"),
        api.get("/payments/tickets/mine"),
      ]);
      if (meRes.data.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }
      setMe(meRes.data);
      setPayments(paymentsRes.data);
      setTickets(ticketsRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error al cargar datos");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const totalGastado = payments
    .filter((p) => p.status === "confirmed")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalGanado = tickets.reduce(
    (acc, t) => acc + (t.prize_amount || 0),
    0
  );

  const ticketsPremiados = tickets.filter((t) => t.prize_type);

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>Sortea<span>Max</span></h1>
          {me && <p>Mis pagos y boletos · {me.full_name}</p>}
        </div>
        <div className="topbar-right">
          <button
            className="btn-topbar"
            onClick={() => navigate("/user/dashboard")}
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
        <div className="stats">
          <div className="stat-card">
            <h3>Total pagos</h3>
            <p>{payments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total boletos</h3>
            <p>{tickets.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total gastado</h3>
            <p style={{ fontSize: "22px", color: "#dc2626" }}>
              ${totalGastado.toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total ganado</h3>
            <p style={{ fontSize: "22px", color: "#15803d" }}>
              ${totalGanado.toFixed(2)}
            </p>
          </div>
        </div>

        {error && <div className="msg-error">{error}</div>}

        <div className="section-card">
          <div className="section-header" style={{ gap: "0", padding: "0" }}>
            <button
              onClick={() => setActiveTab("pagos")}
              style={{
                flex: 1,
                padding: "16px 24px",
                border: "none",
                borderBottom:
                  activeTab === "pagos"
                    ? "3px solid #d4af37"
                    : "3px solid transparent",
                background: "transparent",
                fontWeight: activeTab === "pagos" ? "700" : "400",
                color: activeTab === "pagos" ? "#0a1628" : "#6b7280",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Mis pagos ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab("boletos")}
              style={{
                flex: 1,
                padding: "16px 24px",
                border: "none",
                borderBottom:
                  activeTab === "boletos"
                    ? "3px solid #d4af37"
                    : "3px solid transparent",
                background: "transparent",
                fontWeight: activeTab === "boletos" ? "700" : "400",
                color: activeTab === "boletos" ? "#0a1628" : "#6b7280",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Mis boletos ({tickets.length})
            </button>
          </div>

          <div style={{ padding: "0" }}>
            {loading ? (
              <p style={{ padding: "20px" }}>Cargando informacion...</p>
            ) : activeTab === "pagos" ? (
              payments.length === 0 ? (
                <div className="empty-state">
                  <p>No tienes pagos registrados todavia.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID Pago</th>
                      <th>Sorteo</th>
                      <th>Cantidad</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td
                          style={{
                            fontSize: "11px",
                            color: "#9ca3af",
                            maxWidth: "140px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {payment.id}
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
                          {payment.draw_id}
                        </td>
                        <td>{payment.quantity}</td>
                        <td style={{ fontWeight: "600", color: "#0a1628" }}>
                          ${payment.amount}
                        </td>
                        <td>
                          <StatusBadge status={payment.status} />
                        </td>
                        <td style={{ fontSize: "13px" }}>
                          {new Date(payment.created_at).toLocaleString("es-EC")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                <p>No tienes boletos generados todavia.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID Boleto</th>
                    <th>Sorteo</th>
                    <th>Numeros</th>
                    <th>Aciertos</th>
                    <th>Premio</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticket_id}>
                      <td
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          maxWidth: "140px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ticket.ticket_id}
                      </td>
                      <td style={{ fontWeight: "600" }}>
                        {ticket.draw_title}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                          }}
                        >
                          {ticket.numbers.map((n) => (
                            <span
                              key={n}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #1e40af, #3b82f6)",
                                color: "white",
                                fontSize: "11px",
                                fontWeight: "700",
                              }}
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: "600" }}>{ticket.hits}</td>
                      <td>
                        <PrizeBadge prizeType={ticket.prize_type} />
                      </td>
                      <td style={{ fontWeight: "600", color: "#15803d" }}>
                        {ticket.prize_amount
                          ? `$${ticket.prize_amount.toFixed(2)}`
                          : "$0.00"}
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
  );
}