import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ov = { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"16px" };
const cd = { background:"white", borderRadius:"24px", width:"100%", maxWidth:"420px", boxShadow:"0 25px 60px rgba(0,0,0,0.3)", overflow:"hidden" };
const hd = { background:"linear-gradient(135deg,#0a1628,#0f2744)", padding:"24px", display:"flex", justifyContent:"space-between", alignItems:"center" };
const xb = { background:"rgba(255,255,255,0.1)", border:"none", color:"white", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"18px" };
const ht = { color:"white", fontSize:"18px", fontWeight:"800", margin:0 };
const hs = { color:"#94a3b8", fontSize:"12px", margin:0 };
const bd = { padding:"24px" };
const ab = { background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"2px solid #86efac", borderRadius:"16px", padding:"16px 20px", textAlign:"center", marginBottom:"20px" };
const al = { color:"#16a34a", fontSize:"12px", fontWeight:"700", textTransform:"uppercase", marginBottom:"4px" };
const av = { fontSize:"42px", fontWeight:"900", color:"#15803d", margin:0 };
const as2 = { color:"#4ade80", fontSize:"12px", marginTop:"4px" };
const sw = { marginBottom:"20px" };
const sr = { display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"10px" };
const sc = { width:"26px", height:"26px", borderRadius:"50%", background:"linear-gradient(135deg,#d4af37,#f0d060)", color:"#0a1628", fontWeight:"800", fontSize:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 };
const st = { fontSize:"13px", color:"#374151", margin:0, paddingTop:"4px" };
const qc = { display:"flex", justifyContent:"center", marginBottom:"20px" };
const qb = { background:"white", border:"3px solid #e5e7eb", borderRadius:"16px", padding:"12px" };
const qi = { width:"180px", height:"180px", objectFit:"contain", display:"block" };
const qf = { width:"180px", height:"180px", display:"none", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"8px", background:"#f9fafb", borderRadius:"8px" };
const lw = { marginBottom:"16px" };
const ll = { display:"block", fontSize:"12px", fontWeight:"600", color:"#374151", marginBottom:"6px" };
const lt = { width:"100%", padding:"10px 12px", borderRadius:"10px", border:"1.5px solid #d1d5db", fontSize:"13px", resize:"none", fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
const eb = { background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"10px 14px", color:"#dc2626", fontSize:"13px", marginBottom:"12px" };
const sb = { background:"#f0fdf4", border:"1px solid #86efac", borderRadius:"10px", padding:"10px 14px", color:"#16a34a", fontSize:"13px", marginBottom:"12px", fontWeight:"600" };
const bo = { width:"100%", border:"none", padding:"14px", borderRadius:"12px", fontSize:"15px", fontWeight:"800", color:"white", background:"linear-gradient(135deg,#0a4a3a,#0f766e)", cursor:"pointer" };
const bn = { width:"100%", border:"none", padding:"14px", borderRadius:"12px", fontSize:"15px", fontWeight:"800", color:"white", background:"#d1d5db", cursor:"not-allowed" };
const ft = { textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"12px" };

const STEPS = [
  { n:"1", text:"Abre tu app Deuna o Banca Movil Pichincha." },
  { n:"2", text:"Escanea el QR y paga el monto exacto." },
  { n:"3", text:"Vuelve aqui y registra tu pago." },
];

export default function PaymentModal({ amount, drawId, token, quantity, onSuccess, onClose }) {
  const qty = quantity || 1;
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const dollars = amount / 100;

  useEffect(function () {
    setErr("");
    setOk(false);
  }, [amount, drawId]);

  function onNote(e) {
    setNote(e.target.value);
  }

  async function pay() {
    if (!drawId) { setErr("Falta ID sorteo"); return; }
    if (!token) { setErr("Inicia sesion"); return; }
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(API + "/deuna/payments/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          draw_id: drawId,
          amount: dollars,
          quantity: qty,
          reference_note: note || null,
        }),
      });
      if (!r.ok) {
        const e = await r.json().catch(function () { return {}; });
        throw new Error(e.detail || "Error al registrar");
      }
      const d = await r.json();
      setOk(true);
      if (onSuccess) onSuccess(d);
    } catch (e) {
      setErr(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  function imgErr(e) {
    e.target.style.display = "none";
    var f = e.target.parentNode.querySelector(".qrfb");
    if (f) f.style.display = "flex";
  }

  return (
    <div style={ov}>
      <div style={cd}>
        <div style={hd}>
          <div>
            <h2 style={ht}>Pagar con Deuna</h2>
            <p style={hs}>Banca Movil / App Deuna</p>
          </div>
          <button style={xb} onClick={onClose}>x</button>
        </div>
        <div style={bd}>
          <div style={ab}>
            <p style={al}>Total a pagar</p>
            <p style={av}>${dollars.toFixed(2)}</p>
            <p style={as2}>{qty} boleto{qty > 1 ? "s" : ""}</p>
          </div>
          <div style={sw}>
            {STEPS.map(function (s) {
              return (
                <div key={s.n} style={sr}>
                  <div style={sc}>{s.n}</div>
                  <p style={st}>{s.text}</p>
                </div>
              );
            })}
          </div>
          <div style={qc}>
            <div style={qb}>
              <img src="/qr-deuna.png" alt="QR Deuna" style={qi} onError={imgErr} />
              <div className="qrfb" style={qf}>
                <p style={{ fontSize:"11px", color:"#9ca3af", margin:0 }}>
                  Copia qr-deuna.png a public/
                </p>
              </div>
            </div>
          </div>
          <div style={lw}>
            <label style={ll}>Referencia opcional</label>
            <textarea
              value={note}
              onChange={onNote}
              placeholder="Ej: Pague a las 16h05"
              rows={2}
              style={lt}
            />
          </div>
          {err ? <div style={eb}>{err}</div> : null}
          {ok ? <div style={sb}>Pago registrado. Espera confirmacion del admin.</div> : null}
          {ok ? (
            <button style={bo} onClick={onClose}>Cerrar</button>
          ) : (
            <button style={loading ? bn : bo} onClick={pay} disabled={loading}>
              {loading ? "Registrando..." : "Ya pague, registrar pago"}
            </button>
          )}
          <p style={ft}>Pago seguro via Deuna - Banco Pichincha</p>
        </div>
      </div>
    </div>
  );
}