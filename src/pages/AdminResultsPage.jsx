import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function NumberBall({ number, highlight = false, order = null }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "4px",
      }}
    >
      {order !== null && (
        <span
          style={{
            fontSize: "10px",
            color: "#9ca3af",
            marginBottom: "2px",
            fontWeight: "600",
          }}
        >
          #{order}
        </span>
      )}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: highlight
            ? "linear-gradient(135deg, #0a4a3a, #0f766e)"
            : "linear-gradient(135deg, #1e40af, #3b82f6)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "800",
          fontSize: "16px",
          boxShadow: highlight
            ? "0 0 16px rgba(15,118,110,0.5)"
            : "0 4px 12px rgba(30,64,175,0.3)",
          border: highlight ? "2px solid #d4af37" : "none",
        }}
      >
        {number}
      </div>
    </div>
  );
}

function PrizeBadge({ prizeType }) {
  if (!prizeType) {
    return <span className="badge badge-gray">Sin premio</span>;
  }
  const config = {
    jackpot: { cls: "badge badge-red", text: "Jackpot" },
    tier10: { cls: "badge badge-blue", text: "Tier 10" },
    free_ticket: { cls: "badge badge-green", text: "Boleto gratis" },
  };
  const c = config[prizeType] || { cls: "badge badge-gray", text: prizeType };
  return <span className={c.cls}>{c.text}</span>;
}

export default function AdminResultsPage() {
  const { drawId } = useParams();
  const [me, setMe] = useState(null);
  const [draw, setDraw] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [drawId]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [meRes, drawRes] = await Promise.all([
        api.get("/auth/me"),
        api.get(`/draws/${drawId}/results`),
      ]);
      if (meRes.data.role !== "admin") {
        navigate("/user/dashboard");
        return;
      }
      setMe(meRes.data);
      setDraw(drawRes.data);
      setResults(drawRes.data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error al cargar resultados");
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

  const winningNumbers = draw?.winning_numbers || [];
  const extractionOrder = draw?.extraction_order || [];
  const jackpotCount = results.filter((r) => r.prize_type === "jackpot").length;
  const tier10Count = results.filter((r) => r.prize_type === "tier10").length;
  const freeCount = results.filter((r) => r.prize_type === "free_ticket").length;

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>Sortea<span>Max</span></h1>
          {me && draw && (
            <p>
              Resultados del sorteo · Admin: {me.full_name}
            </p>
          )}
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

        {loading || !draw ? (
          <p>Cargando resultados...</p>
        ) : (
          <>
            <div className="stats" style={{ marginBottom: "20px" }}>
              <div className="stat-card">
                <h3>Estado sorteo</h3>
                <p style={{ fontSize: "18px" }}>
                  {draw.status === "drawn" ? "Finalizado" : draw.status}
                </p>
              </div>
              <div className="stat-card">
                <h3>Jackpots (11 aciertos)</h3>
                <p>{jackpotCount}</p>
              </div>
              <div className="stat-card">
                <h3>Ganadores Tier 10</h3>
                <p>{tier10Count}</p>
              </div>
              <div className="stat-card">
                <h3>Boletos gratis (9)</h3>
                <p>{freeCount}</p>
              </div>
            </div>

            <div className="section-card" style={{ marginBottom: "20px" }}>
              <div className="section-header">
                <div className="section-header-icon">🎱</div>
                <h2>Numeros ganadores</h2>
              </div>
              <div className="section-body">
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Los 11 numeros ganadores ordenados:
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginBottom: "28px",
                  }}
                >
                  {winningNumbers.length > 0 ? (
                    winningNumbers.map((n) => (
                      <NumberBall key={n} number={n} highlight={true} />
                    ))
                  ) : (
                    <p style={{ color: "#9ca3af" }}>
                      Sin numeros registrados.
                    </p>
                  )}
                </div>

                {extractionOrder.length > 0 && (
                  <>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "12px",
                      }}
                    >
                      Orden de extraccion del bolillero:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {extractionOrder.map((n, index) => (
                        <NumberBall
                          key={`ext-${index}`}
                          number={n}
                          highlight={false}
                          order={index + 1}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <div className="section-header-icon">☰</div>
                <h2>Todos los boletos y premios</h2>
              </div>
              <div style={{ padding: "0" }}>
                {results.length === 0 ? (
                  <div className="empty-state">
                    <p>No hay boletos registrados para este sorteo.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID Boleto</th>
                        <th>Usuario</th>
                        <th>Numeros</th>
                        <th>Aciertos</th>
                        <th>Premio</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((ticket) => (
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
                          <td
                            style={{
                              fontSize: "11px",
                              color: "#9ca3af",
                              maxWidth: "140px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ticket.user_id}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "3px",
                              }}
                            >
                              {ticket.numbers.map((n) => (
                                <span
                                  key={n}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "50%",
                                    background: new Set(
                                      winningNumbers
                                    ).has(n)
                                      ? "linear-gradient(135deg, #0a4a3a, #0f766e)"
                                      : "linear-gradient(135deg, #1e40af, #3b82f6)",
                                    color: "white",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    border: new Set(winningNumbers).has(n)
                                      ? "1.5px solid #d4af37"
                                      : "none",
                                  }}
                                >
                                  {n}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ fontWeight: "700" }}>
                            {ticket.hits}
                          </td>
                          <td>
                            <PrizeBadge prizeType={ticket.prize_type} />
                          </td>
                          <td
                            style={{
                              fontWeight: "700",
                              color:
                                ticket.prize_amount > 0
                                  ? "#15803d"
                                  : "#9ca3af",
                            }}
                          >
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
          </>
        )}
      </div>
    </div>
  );
}