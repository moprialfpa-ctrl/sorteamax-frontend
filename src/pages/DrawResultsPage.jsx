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

function TicketCard({ ticket, winningNumbers }) {
  const winSet = new Set(winningNumbers);
  const borderColor =
    ticket.prize_type === "jackpot"
      ? "#b91c1c"
      : ticket.prize_type === "tier10"
      ? "#1d4ed8"
      : ticket.prize_type === "free_ticket"
      ? "#0f766e"
      : "#e5e7eb";

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        borderLeft: `5px solid ${borderColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              marginBottom: "4px",
            }}
          >
            Boleto: {ticket.ticket_id}
          </p>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#0a1628",
            }}
          >
            {ticket.hits} / 11 aciertos
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <PrizeBadge prizeType={ticket.prize_type} />
          {ticket.prize_amount > 0 && (
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#15803d",
              }}
            >
              ${ticket.prize_amount.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {ticket.numbers.map((n) => (
          <NumberBall key={n} number={n} highlight={winSet.has(n)} />
        ))}
      </div>

      {winningNumbers.length > 0 && (
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "12px",
          }}
        >
          Numeros con borde dorado coinciden con los ganadores.
        </p>
      )}
    </div>
  );
}

export default function DrawResultsPage() {
  const { drawId } = useParams();
  const [me, setMe] = useState(null);
  const [draw, setDraw] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
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
      const [meRes, resultsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get(`/draws/${drawId}/results`),
      ]);
      setMe(meRes.data);
      setDraw(resultsRes.data);
      const allTickets = resultsRes.data.results || [];
      setMyTickets(allTickets.filter((t) => t.user_id === meRes.data.id));
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
  const totalGanado = myTickets.reduce(
    (acc, t) => acc + (t.prize_amount || 0),
    0
  );
  const misPremiados = myTickets.filter((t) => t.prize_type);

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>
            Sortea<span>Max</span>
          </h1>
          {me && draw && (
            <p>
              Resultados del sorteo · Estado:{" "}
              <span style={{ color: "#d4af37", fontWeight: "700" }}>
                {draw.status === "drawn" ? "Finalizado" : draw.status}
              </span>
            </p>
          )}
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
        {error && <div className="msg-error">{error}</div>}

        {loading || !draw ? (
          <p>Cargando resultados...</p>
        ) : (
          <>
            <div className="stats" style={{ marginBottom: "20px" }}>
              <div className="stat-card">
                <h3>Mis boletos</h3>
                <p>{myTickets.length}</p>
              </div>
              <div className="stat-card">
                <h3>Mis premiados</h3>
                <p>{misPremiados.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total ganado</h3>
                <p style={{ fontSize: "24px", color: "#15803d" }}>
                  ${totalGanado.toFixed(2)}
                </p>
              </div>
              <div className="stat-card">
                <h3>Total boletos sorteo</h3>
                <p>{draw.results.length}</p>
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
                <div className="section-header-icon">🎟</div>
                <h2>Mis boletos en este sorteo</h2>
              </div>
              <div className="section-body">
                {myTickets.length === 0 ? (
                  <div className="empty-state">
                    <p>No tienes boletos en este sorteo.</p>
                  </div>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "16px",
                      }}
                    >
                      Los numeros con borde dorado son aciertos con los
                      ganadores.
                    </p>
                    {myTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.ticket_id}
                        ticket={ticket}
                        winningNumbers={winningNumbers}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}