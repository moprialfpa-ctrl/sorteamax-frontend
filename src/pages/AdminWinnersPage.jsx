import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadWinners(); }, []);

  const loadWinners = async () => {
    try {
      const res = await api.get("/admin/winners");
      const data = res.data;
      setWinners(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const s = { page: { minHeight: "100vh", background: "#0a1628", color: "white", padding: "24px", fontFamily: "Inter, sans-serif" }, header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, title: { fontSize: "24px", fontWeight: "800", color: "#d4af37" }, btn: { background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }, table: { width: "100%", borderCollapse: "collapse" }, th: { textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }, td: { padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" } };

  const prizeLabel = (type) => { if (type==="jackpot") return { label: "JACKPOT", color: "#f0d060" }; if (type==="tier10") return { label: "2do Premio", color: "#94a3b8" }; if (type==="freeticket") return { label: "Boleto Gratis", color: "#4ade80" }; return { label: type, color: "white" }; };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Ganadores</h1>
        <button style={s.btn} onClick={() => navigate("/admin/dashboard")}>← Volver</button>
      </div>
      {loading ? <p style={{color:"#94a3b8"}}>Cargando...</p> : (
        <>
          <p style={{color:"#94a3b8",marginBottom:"20px"}}>{winners.length} ganador(es) registrado(s)</p>
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Usuario</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Sorteo</th>
              <th style={s.th}>Numeros</th>
              <th style={s.th}>Aciertos</th>
              <th style={s.th}>Premio</th>
              <th style={s.th}>Monto</th>
              <th style={s.th}>Fecha</th>
            </tr></thead>
            <tbody>
              {winners.map(w => {
                const prize = prizeLabel(w.prize_type);
                return (
                  <tr key={w.ticket_id}>
                    <td style={s.td}>{w.username || "-"}</td>
                    <td style={s.td}>{w.user_email || "-"}</td>
                    <td style={s.td}>{w.draw_title || w.draw_id?.slice(0,8)}</td>
                    <td style={s.td}><span style={{fontFamily:"monospace"}}>{Array.isArray(w.numbers) ? w.numbers.join("-") : w.numbers}</span></td>
                    <td style={s.td}>{w.hits}</td>
                    <td style={s.td}><strong style={{color: prize.color}}>{prize.label}</strong></td>
                    <td style={s.td}><strong style={{color:"#4ade80"}}>${(w.prize_amount||0).toFixed(2)}</strong></td>
                    <td style={s.td}>{new Date(w.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {winners.length===0 && <p style={{color:"#94a3b8",textAlign:"center",marginTop:"40px"}}>No hay ganadores aun.</p>}
        </>
      )}
    </div>
  );
}
