import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminBankAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    try {
      const res = await api.get("/admin/bank-accounts");
      const data = res.data;
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = accounts.filter(a =>
    a.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    a.username?.toLowerCase().includes(search.toLowerCase()) ||
    a.bank_name?.toLowerCase().includes(search.toLowerCase())
  );

  const s = { page: { minHeight: "100vh", background: "#0a1628", color: "white", padding: "24px", fontFamily: "Inter, sans-serif" }, header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, title: { fontSize: "24px", fontWeight: "800", color: "#d4af37" }, btn: { background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }, input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "14px", width: "300px", marginBottom: "20px" }, table: { width: "100%", borderCollapse: "collapse" }, th: { textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }, td: { padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" } };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Cuentas bancarias</h1>
        <button style={s.btn} onClick={() => navigate("/admin/dashboard")}>← Volver</button>
      </div>
      <input style={s.input} placeholder="Buscar por nombre o banco..." value={search} onChange={e => setSearch(e.target.value)} />
      {loading ? <p style={{color:"#94a3b8"}}>Cargando...</p> : (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Usuario</th>
            <th style={s.th}>Titular</th>
            <th style={s.th}>Cedula</th>
            <th style={s.th}>Banco</th>
            <th style={s.th}>No. Cuenta</th>
            <th style={s.th}>Tipo</th>
            <th style={s.th}>Telefono</th>
            <th style={s.th}>Deuna</th>
            <th style={s.th}>Registro</th>
          </tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={s.td}>{a.username || a.user_id?.slice(0,8)}</td>
                <td style={s.td}>{a.fullname}</td>
                <td style={s.td}>{a.id_number}</td>
                <td style={s.td}><strong>{a.bank_name}</strong></td>
                <td style={s.td}><span style={{fontFamily:"monospace"}}>{a.account_number}</span></td>
                <td style={s.td}>{a.account_type}</td>
                <td style={s.td}>{a.phone || "-"}</td>
                <td style={s.td}>{a.deuna_phone || "-"}</td>
                <td style={s.td}>{new Date(a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && filtered.length===0 && <p style={{color:"#94a3b8",textAlign:"center",marginTop:"40px"}}>No hay cuentas bancarias registradas.</p>}
    </div>
  );
}
