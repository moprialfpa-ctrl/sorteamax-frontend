import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STEPS = [
  { n: "1", text: "Abre tu app Deuna o Banca Movil Pichincha." },
  { n: "2", text: "Escanea el QR y paga el monto exacto." },
  { n: "3", text: "Ingresa el numero de transaccion y/o sube el comprobante." },
  { n: "4", text: "Haz clic en registrar pago y espera confirmacion del admin." },
];

export default function PaymentModal({ amount, drawId, token, quantity, onSuccess, onClose }) {
  const qty = quantity || 1;
  const dollars = amount / 100;

  const [transactionNumber, setTransactionNumber] = useState("");
  const [note, setNote] = useState("");
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptBase64, setReceiptBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    setErr("");
    setOk(false);
    setTransactionNumber("");
    setNote("");
    setReceiptPreview(null);
    setReceiptBase64(null);
  }, [amount, drawId]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErr("El archivo no debe superar 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptBase64(reader.result);
      setReceiptPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function pay() {
    if (!drawId) { setErr("Falta ID sorteo"); return; }
    if (!token) { setErr("Inicia sesion"); return; }
    if (!transactionNumber.trim() && !receiptBase64) {
      setErr("Debes ingresar el numero de transaccion o adjuntar el comprobante");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(API + "/deuna/payments/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          draw_id: drawId,
          amount: dollars,
          quantity: qty,
          reference_note: note || null,
          transaction_number: transactionNumber.trim() || null,
          receipt_image: receiptBase64 || null,
        }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
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

  const s = {
    overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"16px", overflowY:"auto" },
    card: { background:"white", borderRadius:"20px", width:"100%", maxWidth:"440px", boxShadow:"0 25px 60px rgba(0,0,0,0.35)", overflow:"hidden", maxHeight:"90vh", overflowY:"auto" },
    header: { background:"linear-gradient(135deg,#0a1628,#0f2744)", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
    xBtn: { background:"rgba(255,255,255,0.15)", border:"none", color:"white", width:"32px", height:"32px", borderRadius:"50%", cursor:"pointer", fontSize:"16px" },
    htitle: { color:"white", fontSize:"17px", fontWeight:"800", margin:0 },
    hsub: { color:"#94a3b8", fontSize:"12px", margin:0 },
    body: { padding:"20px 24px" },
    amountBox: { background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"2px solid #86efac", borderRadius:"14px", padding:"14px 18px", textAlign:"center", marginBottom:"18px" },
    amountLabel: { color:"#16a34a", fontSize:"11px", fontWeight:"700", textTransform:"uppercase", marginBottom:"2px" },
    amountVal: { fontSize:"38px", fontWeight:"900", color:"#15803d", margin:0 },
    amountSub: { color:"#4ade80", fontSize:"12px", marginTop:"2px" },
    stepsBox: { marginBottom:"18px" },
    stepRow: { display:"flex", alignItems:"flex-start", gap:"10px", marginBottom:"8px" },
    stepNum: { width:"24px", height:"24px", borderRadius:"50%", background:"linear-gradient(135deg,#d4af37,#f0d060)", color:"#0a1628", fontWeight:"800", fontSize:"11px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
    stepTxt: { fontSize:"13px", color:"#374151", margin:0, paddingTop:"3px" },
    qrBox: { display:"flex", justifyContent:"center", marginBottom:"18px" },
    qrInner: { background:"white", border:"3px solid #e5e7eb", borderRadius:"14px", padding:"10px" },
    qrImg: { width:"160px", height:"160px", objectFit:"contain", display:"block" },
    label: { display:"block", fontSize:"12px", fontWeight:"700", color:"#374151", marginBottom:"5px" },
    input: { width:"100%", padding:"10px 12px", borderRadius:"10px", border:"1.5px solid #d1d5db", fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box" },
    textarea: { width:"100%", padding:"10px 12px", borderRadius:"10px", border:"1.5px solid #d1d5db", fontSize:"13px", resize:"none", fontFamily:"inherit", outline:"none", boxSizing:"border-box" },
    field: { marginBottom:"14px" },
    uploadBtn: { display:"flex", alignItems:"center", gap:"8px", background:"#f8fafc", border:"2px dashed #d1d5db", borderRadius:"10px", padding:"12px 16px", cursor:"pointer", width:"100%", boxSizing:"border-box", justifyContent:"center", color:"#6b7280", fontSize:"13px", fontWeight:"600" },
    previewImg: { width:"100%", maxHeight:"160px", objectFit:"contain", borderRadius:"8px", marginTop:"8px", border:"1px solid #e5e7eb" },
    errBox: { background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"10px 14px", color:"#dc2626", fontSize:"13px", marginBottom:"12px" },
    okBox: { background:"#f0fdf4", border:"1px solid #86efac", borderRadius:"10px", padding:"10px 14px", color:"#16a34a", fontSize:"13px", marginBottom:"12px", fontWeight:"600" },
    btn: { width:"100%", border:"none", padding:"14px", borderRadius:"12px", fontSize:"15px", fontWeight:"800", color:"white", background:"linear-gradient(135deg,#0a4a3a,#0f766e)", cursor:"pointer" },
    btnDisabled: { width:"100%", border:"none", padding:"14px", borderRadius:"12px", fontSize:"15px", fontWeight:"800", color:"white", background:"#d1d5db", cursor:"not-allowed" },
    footer: { textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"10px" },
    divider: { height:"1px", background:"#f1f5f9", margin:"14px 0" },
    required: { color:"#dc2626", marginLeft:"2px" },
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <div style={s.header}>
          <div>
            <p style={s.htitle}>Pagar con Deuna</p>
            <p style={s.hsub}>Banca Movil / App Deuna</p>
          </div>
          <button style={s.xBtn} onClick={onClose}>x</button>
        </div>
        <div style={s.body}>
          <div style={s.amountBox}>
            <p style={s.amountLabel}>Total a pagar</p>
            <p style={s.amountVal}>${dollars.toFixed(2)}</p>
            <p style={s.amountSub}>{qty} boleto{qty > 1 ? "s" : ""}</p>
          </div>
          <div style={s.stepsBox}>
            {STEPS.map((step) => (
              <div key={step.n} style={s.stepRow}>
                <div style={s.stepNum}>{step.n}</div>
                <p style={s.stepTxt}>{step.text}</p>
              </div>
            ))}
          </div>
          <div style={s.qrBox}>
            <div style={s.qrInner}>
              <img src="/qr-deuna.png" alt="QR Deuna" style={s.qrImg} onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          </div>
          <div style={s.divider} />
          <div style={s.field}>
            <label style={s.label}>Numero de transaccion<span style={s.required}>*</span></label>
            <input style={s.input} type="text" placeholder="Ej: TXN-20240526-001234" value={transactionNumber} onChange={(e) => setTransactionNumber(e.target.value)} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Comprobante de pago (foto/captura)</label>
            <div style={s.uploadBtn} onClick={() => fileRef.current.click()}>
              {receiptPreview ? "Cambiar imagen" : "Adjuntar comprobante"}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            {receiptPreview && <img src={receiptPreview} alt="Comprobante" style={s.previewImg} />}
          </div>
          <div style={s.field}>
            <label style={s.label}>Nota adicional (opcional)</label>
            <textarea style={s.textarea} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej: Pague a las 14:30 desde cuenta Pichincha" rows={2} />
          </div>
          {err && <div style={s.errBox}>{err}</div>}
          {ok && <div style={s.okBox}>Pago registrado. El admin revisara tu comprobante y confirmara en breve.</div>}
          {ok ? (
            <button style={s.btn} onClick={onClose}>Cerrar</button>
          ) : (
            <button style={loading ? s.btnDisabled : s.btn} onClick={pay} disabled={loading}>
              {loading ? "Registrando..." : "Ya pague, registrar pago"}
            </button>
          )}
          <p style={s.footer}>Pago seguro via Deuna - Banco Pichincha</p>
        </div>
      </div>
    </div>
  );
}
