import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const data = res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u =>
    u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const s = { page: { minHeight: "100vh", background: "#0a1628", color: "white", padding: "24px", fontFamily: "Inter, sans-serif" }, header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, title: { fontSize: "24px", fontWeight: "800", color: "#d4af37" }, btn: { background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }, input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", width: "300px", marginBottom: "20px" }, table: { width: "100%", borderCollapse: "collapse" }, th: { textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }, td: { padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "14px" } };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Usuarios registrados</h1>
        <button style={s.btn} onClick={() => navigate("/admin/dashboard")}>← Volver</button>
      </div>
      <input style={s.input} placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} />
      {loading ? <p style={{color:"#94a3b8"}}>Cargando...</p> : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Rol</th>
              <th style={s.th}>Pagos</th>
              <th style={s.th}>Boletos</th>
              <th style={s.th}>Ganadores</th>
              <th style={s.th}>Cuenta bancaria</th>
              <th style={s.th}>Registro</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td style={s.td}>{u.fullname}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}><span style={{background: u.role==="admin"?"#d4af37":"rgba(255,255,255,0.1)", color: u.role==="admin"?"#0a1628":"white", padding:"2px 8px", borderRadius:"4px", fontSize:"12px"}}>{u.role}</span></td>
                <td style={s.td}>{u.payments_count}</td>
                <td style={s.td}>{u.tickets_count}</td>
                <td style={s.td}>{u.winning_tickets_count}</td>
                <td style={s.td}>{u.has_bank_account ? <span style={{color:"#4ade80"}}>Si</span> : <span style={{color:"#f87171"}}>No</span>}</td>
                <td style={s.td}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && filtered.length === 0 && <p style={{color:"#94a3b8",textAlign:"center",marginTop:"40px"}}>No se encontraron usuarios.</p>}
    </div>
  );
}
