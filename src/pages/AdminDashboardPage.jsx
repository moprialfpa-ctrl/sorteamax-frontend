import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboardPage() {
  const [draws, setDraws] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", ticket_price: 1, sales_threshold_amount: 100 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [meRes, drawsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/draws/"),
      ]);
      if (meRes.data.role !== "admin") { navigate("/user/dashboard"); return; }
      setMe(meRes.data);
      const data = drawsRes.data;
      setDraws(Array.isArray(data) ? data : (data?.items || data?.draws || data?.results || []));
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const createDraw = async (e) => {
    e.preventDefault();
    setActionLoading(true); setError(""); setMessage("");
    try {
      await api.post("/draws/", form);
      setMessage("Sorteo creado exitosamente.");
      setForm({ title: "", ticket_price: 1, sales_threshold_amount: 100 });
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear sorteo.");
    } finally { setActionLoading(false); }
  };

  const closeDraw = async (id) => {
    if (!window.confirm("Cerrar ventas de este sorteo?")) return;
    try {
      await api.post(`/draws/${id}/close`);
      setMessage("Ventas cerradas."); loadData();
    } catch (err) { setError(err.response?.data?.detail || "Error."); }
  };

  const runDraw = async (id) => {
    if (!window.confirm("Ejecutar el sorteo ahora? Esta accion no se puede deshacer.")) return;
    try {
      await api.post(`/draws/${id}/run`);
      setMessage("Sorteo ejecutado correctamente."); loadData();
    } catch (err) { setError(err.response?.data?.detail || "Error."); }
  };

  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const s = {
    page: { minHeight: "100vh", background: "#0a1628", color: "white", fontFamily: "Inter, sans-serif", padding: "24px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
    title: { fontSize: "28px", fontWeight: "900", color: "#d4af37" },
    btn: { background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px" },
    btnRed: { background: "#ef4444", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    btnBlue: { background: "#3b82f6", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    btnGray: { background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "24px", marginBottom: "24px" },
    input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", width: "100%", boxSizing: "border-box" },
    label: { display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" },
    td: { padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "14px" },
  };

  const statusColor = { selling: "#4ade80", ready: "#facc15", closed: "#f97316", drawn: "#94a3b8" };

  if (loading) return <div style={{...s.page, display:"flex", alignItems:"center", justifyContent:"center"}}><p style={{color:"#94a3b8"}}>Cargando...</p></div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Panel Admin</h1>
          <p style={{color:"#94a3b8",fontSize:"14px"}}>Bienvenido, {me?.fullname}</p>
        </div>
        <button style={s.btnRed} onClick={logout}>Cerrar sesion</button>
      </div>

      <div style={{display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"24px"}}>
        <button style={s.btnGray} onClick={() => navigate("/admin/users")}>Usuarios</button>
        <button style={s.btnGray} onClick={() => navigate("/admin/tickets")}>Boletos</button>
        <button style={s.btnGray} onClick={() => navigate("/admin/payments")}>Pagos</button>
        <button style={s.btnGray} onClick={() => navigate("/admin/winners")}>Ganadores</button>
        <button style={s.btnGray} onClick={() => navigate("/admin/bank-accounts")}>Cuentas bancarias</button>
      </div>

      {message && <div style={{background:"rgba(74,222,128,0.1)",border:"1px solid #4ade80",borderRadius:"8px",padding:"12px 16px",marginBottom:"16px",color:"#4ade80"}}>{message}</div>}
      {error && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid #ef4444",borderRadius:"8px",padding:"12px 16px",marginBottom:"16px",color:"#ef4444"}}>{error}</div>}

      <div style={s.card}>
        <h2 style={{fontSize:"18px",fontWeight:"700",color:"#d4af37",marginBottom:"20px"}}>Crear nuevo sorteo</h2>
        <form onSubmit={createDraw}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px",marginBottom:"16px"}}>
            <div>
              <label style={s.label}>Titulo del sorteo</label>
              <input style={s.input} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Ej: Sorteo Junio 2026" />
            </div>
            <div>
              <label style={s.label}>Precio por boleto ($)</label>
              <input style={s.input} type="number" step="0.01" min="0.1" value={form.ticket_price} onChange={e => setForm({...form, ticket_price: parseFloat(e.target.value)})} required />
            </div>
            <div>
              <label style={s.label}>Umbral minimo de ventas ($)</label>
              <input style={s.input} type="number" step="0.01" min="1" value={form.sales_threshold_amount} onChange={e => setForm({...form, sales_threshold_amount: parseFloat(e.target.value)})} required />
            </div>
          </div>
          <button type="submit" style={s.btn} disabled={actionLoading}>{actionLoading ? "Creando..." : "Crear sorteo"}</button>
        </form>
      </div>

      <div style={s.card}>
        <h2 style={{fontSize:"18px",fontWeight:"700",color:"#d4af37",marginBottom:"20px"}}>Sorteos ({draws.length})</h2>
        {draws.length === 0 ? (
          <p style={{color:"#94a3b8",textAlign:"center",padding:"20px"}}>No hay sorteos creados aun.</p>
        ) : (
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Titulo</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}>Precio</th>
              <th style={s.th}>Umbral</th>
              <th style={s.th}>Boletos</th>
              <th style={s.th}>Ventas</th>
              <th style={s.th}>Jackpot</th>
              <th style={s.th}>Acciones</th>
            </tr></thead>
            <tbody>
              {draws.map(draw => (
                <tr key={draw.id}>
                  <td style={s.td}><strong>{draw.title}</strong></td>
                  <td style={s.td}><span style={{color: statusColor[draw.status]||"white", fontWeight:"700"}}>{draw.status}</span></td>
                  <td style={s.td}>${draw.ticket_price}</td>
                  <td style={s.td}>${draw.sales_threshold_amount}</td>
                  <td style={s.td}>{draw.tickets_sold}</td>
                  <td style={s.td}>${(draw.sales_amount||0).toFixed(2)}</td>
                  <td style={s.td}>${(draw.jackpot_pool||0).toFixed(2)}</td>
                  <td style={s.td}>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                      {(draw.status==="selling"||draw.status==="ready") && <button style={s.btnRed} onClick={() => closeDraw(draw.id)}>Cerrar ventas</button>}
                      {draw.status==="closed" && <button style={s.btn} onClick={() => runDraw(draw.id)}>Ejecutar sorteo</button>}
                      {draw.status==="drawn" && <button style={s.btnBlue} onClick={() => navigate(`/admin/draws/${draw.id}/results`)}>Ver resultados</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
