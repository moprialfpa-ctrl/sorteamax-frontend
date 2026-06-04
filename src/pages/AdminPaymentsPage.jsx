import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadPayments(); }, [filter]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const url = filter ? `/admin/payments?status=${filter}` : "/admin/payments";
      const res = await api.get(url);
      const data = res.data;
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (id) => {
    try {
      await api.post(`/admin/payments/${id}/confirm`);
      loadPayments();
    } catch (err) { alert("Error al confirmar"); }
  };

  const s = { page: { minHeight: "100vh", background: "#0a1628", color: "white", padding: "24px", fontFamily: "Inter, sans-serif" }, header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, title: { fontSize: "24px", fontWeight: "800", color: "#d4af37" }, btn: { background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }, select: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px", color: "white", marginBottom: "20px" }, table: { width: "100%", borderCollapse: "collapse" }, th: { textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }, td: { padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" } };

  const statusColor = (st) => { if (st==="confirmed") return "#4ade80"; if (st==="pending_manual") return "#fbbf24"; return "#94a3b8"; };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Pagos</h1>
        <button style={s.btn} onClick={() => navigate("/admin/dashboard")}>← Volver</button>
      </div>
      <select style={s.select} value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">Todos los estados</option>
        <option value="pending_manual">Pendientes</option>
        <option value="confirmed">Confirmados</option>
      </select>
      {loading ? <p style={{color:"#94a3b8"}}>Cargando...</p> : (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Usuario</th>
            <th style={s.th}>Sorteo</th>
            <th style={s.th}>Cantidad</th>
            <th style={s.th}>Monto</th>
            <th style={s.th}>Estado</th>
            <th style={s.th}>Proveedor</th>
            <th style={s.th}>Referencia</th>
            <th style={s.th}>Fecha</th>
            <th style={s.th}>Accion</th>
          </tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={s.td}><span style={{fontFamily:"monospace",fontSize:"11px"}}>{p.id?.slice(0,8)}...</span></td>
                <td style={s.td}>{p.username || p.user_id?.slice(0,8)}</td>
                <td style={s.td}>{p.draw_title || p.draw_id?.slice(0,8) || "-"}</td>
                <td style={s.td}>{p.quantity}</td>
                <td style={s.td}><strong>${p.amount?.toFixed(2)}</strong></td>
                <td style={s.td}><span style={{color: statusColor(p.status), fontWeight:"700"}}>{p.status}</span></td>
                <td style={s.td}>{p.provider || "-"}</td>
                <td style={s.td}>{p.reference_note || "-"}</td>
                <td style={s.td}>{new Date(p.created_at).toLocaleDateString()}</td>
                <td style={s.td}>{p.status==="pending_manual" && <button onClick={() => confirmPayment(p.id)} style={{...s.btn, padding:"6px 12px", fontSize:"12px"}}>Confirmar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && payments.length===0 && <p style={{color:"#94a3b8",textAlign:"center",marginTop:"40px"}}>No hay pagos.</p>}
    </div>
  );
}
