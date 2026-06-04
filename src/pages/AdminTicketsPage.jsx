import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyWinners, setOnlyWinners] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadTickets(); }, [onlyWinners]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/tickets${onlyWinners ? "?only_winners=true" : ""}`);
      const data = res.data;
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const s = { page: { minHeight: "100vh", background: "#0a1628", color: "white", padding: "24px", fontFamily: "Inter, sans-serif" }, header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, title: { fontSize: "24px", fontWeight: "800", color: "#d4af37" }, btn: { background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }, btnOutline: { background: "transparent", color: "#d4af37", border: "1px solid #d4af37", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }, table: { width: "100%", borderCollapse: "collapse" }, th: { textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }, td: { padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" } };

  const prizeColor = (type) => { if (type==="jackpot") return "#f0d060"; if (type==="tier10") return "#94a3b8"; if (type==="freeticket") return "#4ade80"; return "white"; };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Boletos {onlyWinners ? "ganadores" : "todos"}</h1>
        <div style={{display:"flex",gap:"12px"}}>
          <button style={s.btnOutline} onClick={() => setOnlyWinners(!onlyWinners)}>{onlyWinners ? "Ver todos" : "Solo ganadores"}</button>
          <button style={s.btn} onClick={() => navigate("/admin/dashboard")}>← Volver</button>
        </div>
      </div>
      {loading ? <p style={{color:"#94a3b8"}}>Cargando...</p> : (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>ID Boleto</th>
            <th style={s.th}>Usuario</th>
            <th style={s.th}>Sorteo</th>
            <th style={s.th}>Numeros</th>
            <th style={s.th}>Aciertos</th>
            <th style={s.th}>Premio</th>
            <th style={s.th}>Monto</th>
            <th style={s.th}>Gratis</th>
            <th style={s.th}>Fecha</th>
          </tr></thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td style={s.td}><span style={{fontFamily:"monospace",fontSize:"11px"}}>{t.id?.slice(0,8)}...</span></td>
                <td style={s.td}>{t.user_id?.slice(0,8)}...</td>
                <td style={s.td}>{t.draw_title || t.draw_id?.slice(0,8)}</td>
                <td style={s.td}><span style={{fontFamily:"monospace"}}>{Array.isArray(t.numbers) ? t.numbers.join("-") : t.numbers}</span></td>
                <td style={s.td}>{t.hits}</td>
                <td style={s.td}><span style={{color: prizeColor(t.prize_type), fontWeight:"700"}}>{t.prize_type || "-"}</span></td>
                <td style={s.td}>{t.prize_amount > 0 ? `$${t.prize_amount.toFixed(2)}` : "-"}</td>
                <td style={s.td}>{t.is_free_ticket ? <span style={{color:"#4ade80"}}>Si</span> : "No"}</td>
                <td style={s.td}>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && tickets.length === 0 && <p style={{color:"#94a3b8",textAlign:"center",marginTop:"40px"}}>No hay boletos.</p>}
    </div>
  );
}
