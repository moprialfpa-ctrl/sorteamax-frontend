import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BANKS = [
  "Banco Pichincha",
  "Banco Guayaquil",
  "Banco Pacifico",
  "Banco Internacional",
  "Banco Bolivariano",
  "Banco del Austro",
  "Produbanco",
  "Cooperativa JEP",
  "Cooperativa 29 de Octubre",
  "Otro",
];

const inp = { width:"100%", padding:"10px 12px", borderRadius:"10px", border:"1.5px solid #d1d5db", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const lbl = { display:"block", fontSize:"12px", fontWeight:"600", color:"#374151", marginBottom:"6px" };
const grp = { marginBottom:"16px" };

export default function BankAccountPage() {
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    id_number: "",
    bank_name: "Banco Pichincha",
    account_number: "",
    account_type: "ahorro",
    phone: "",
    deuna_phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    try {
      const meRes = await api.get("/auth/me");
      setMe(meRes.data);
      try {
        const accRes = await api.get("/bank-accounts/mine");
        setForm({
          full_name: accRes.data.full_name || "",
          id_number: accRes.data.id_number || "",
          bank_name: accRes.data.bank_name || "Banco Pichincha",
          account_number: accRes.data.account_number || "",
          account_type: accRes.data.account_type || "ahorro",
          phone: accRes.data.phone || "",
          deuna_phone: accRes.data.deuna_phone || "",
        });
      } catch (e) {
        if (e.response && e.response.status === 404) {
          setForm(function (prev) {
            return { ...prev, full_name: meRes.data.full_name || "" };
          });
        }
      }
    } catch (e) {
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    setForm(function (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await api.post("/bank-accounts/", form);
      setMessage("Cuenta guardada correctamente.");
    } catch (e) {
      setError(e.response && e.response.data ? e.response.data.detail : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>Sortea<span>Max</span></h1>
          {me ? <p>Mis datos de cobro · {me.full_name}</p> : null}
        </div>
        <div className="topbar-right">
          <button className="btn-topbar" onClick={function () { navigate("/user/dashboard"); }}>
            Volver
          </button>
          <button className="btn-topbar btn-topbar-danger" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="section-card" style={{ maxWidth:"560px", margin:"0 auto" }}>
            <div className="section-header">
              <div className="section-header-icon">🏦</div>
              <h2>Datos de cuenta para cobro de premios</h2>
            </div>
            <div className="section-body">
              <p style={{ fontSize:"13px", color:"#6b7280", marginBottom:"20px" }}>
                Registra tu cuenta bancaria o Deuna para que podamos transferirte tus premios cuando ganes.
              </p>
              <form onSubmit={handleSave}>
                <div style={grp}>
                  <label style={lbl}>Nombre completo del titular</label>
                  <input
                    style={inp}
                    name="full_name"
                    value={form.full_name}
                    onChange={onChange}
                    placeholder="Como aparece en tu cedula"
                    required
                  />
                </div>
                <div style={grp}>
                  <label style={lbl}>Cedula de identidad</label>
                  <input
                    style={inp}
                    name="id_number"
                    value={form.id_number}
                    onChange={onChange}
                    placeholder="0912345678"
                    required
                    maxLength={13}
                  />
                </div>
                <div style={grp}>
                  <label style={lbl}>Banco o cooperativa</label>
                  <select style={inp} name="bank_name" value={form.bank_name} onChange={onChange}>
                    {BANKS.map(function (b) {
                      return <option key={b} value={b}>{b}</option>;
                    })}
                  </select>
                </div>
                <div style={grp}>
                  <label style={lbl}>Tipo de cuenta</label>
                  <select style={inp} name="account_type" value={form.account_type} onChange={onChange}>
                    <option value="ahorro">Ahorro</option>
                    <option value="corriente">Corriente</option>
                  </select>
                </div>
                <div style={grp}>
                  <label style={lbl}>Numero de cuenta</label>
                  <input
                    style={inp}
                    name="account_number"
                    value={form.account_number}
                    onChange={onChange}
                    placeholder="2200123456789"
                    required
                  />
                </div>
                <div style={grp}>
                  <label style={lbl}>Celular para transferencias</label>
                  <input
                    style={inp}
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="0991234567"
                  />
                </div>
                <div style={grp}>
                  <label style={lbl}>Celular registrado en Deuna (opcional)</label>
                  <input
                    style={inp}
                    name="deuna_phone"
                    value={form.deuna_phone}
                    onChange={onChange}
                    placeholder="0991234567"
                  />
                </div>
                {message ? <div className="msg-success">{message}</div> : null}
                {error ? <div className="msg-error">{error}</div> : null}
                <button className="form-btn" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar datos de cobro"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}