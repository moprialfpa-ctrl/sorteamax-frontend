import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PaymentModal from "../components/PaymentModal";

const WHATSAPP_NUMBER = "593995236670";
const WHATSAPP_MSG = "Hola, necesito soporte en SorteoMax";

function StatusBadge({ status }) {
  const config = {
    selling: { cls: "badge badge-blue", text: "En venta" },
    ready: { cls: "badge badge-gold", text: "Listo" },
    closed: { cls: "badge badge-yellow", text: "Cerrado" },
    drawn: { cls: "badge badge-green", text: "Finalizado" },
  };
  const c = config[status] || { cls: "badge badge-gray", text: status };
  return <span className={c.cls}>{c.text}</span>;
}

function DrawCard({ draw, quantity, onQuantityChange, onBuyClick, buying }) {
  const total = (draw.ticket_price * quantity).toFixed(2);
  return (
    <div style={{ background:"white", borderRadius:"16px", overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", marginBottom:"20px", border:"1px solid #e5e7eb" }}>
      <div style={{ background:"linear-gradient(135deg,#0a1628,#0f2744)", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h3 style={{ color:"white", fontSize:"18px", fontWeight:"800", marginBottom:"4px" }}>{draw.title}</h3>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <StatusBadge status={draw.status} />
            <span style={{ color:"#94a3b8", fontSize:"13px" }}>{draw.tickets_sold} boletos vendidos</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ color:"#94a3b8", fontSize:"12px" }}>Precio boleto</p>
          <p style={{ color:"#d4af37", fontSize:"24px", fontWeight:"800" }}>${draw.ticket_price}</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:"#e5e7eb" }}>
        <div style={{ background:"white", padding:"16px", textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#6b7280", fontWeight:"600", textTransform:"uppercase", marginBottom:"6px" }}>Premio mayor</p>
          <p style={{ fontSize:"22px", fontWeight:"800", color:"#b91c1c" }}>${draw.jackpot_pool.toFixed(2)}</p>
          <p style={{ fontSize:"11px", color:"#9ca3af" }}>11 aciertos</p>
        </div>
        <div style={{ background:"white", padding:"16px", textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#6b7280", fontWeight:"600", textTransform:"uppercase", marginBottom:"6px" }}>Segundo premio</p>
          <p style={{ fontSize:"22px", fontWeight:"800", color:"#1d4ed8" }}>${draw.tier10_pool.toFixed(2)}</p>
          <p style={{ fontSize:"11px", color:"#9ca3af" }}>10 aciertos</p>
        </div>
        <div style={{ background:"white", padding:"16px", textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#6b7280", fontWeight:"600", textTransform:"uppercase", marginBottom:"6px" }}>Boleto gratis</p>
          <p style={{ fontSize:"22px", fontWeight:"800", color:"#0f766e" }}>${draw.free_ticket_pool.toFixed(2)}</p>
          <p style={{ fontSize:"11px", color:"#9ca3af" }}>9 aciertos</p>
        </div>
      </div>
      <div style={{ padding:"16px 24px", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"13px", color:"#374151", fontWeight:"600" }}>Ventas acumuladas:</span>
          <span style={{ fontSize:"15px", fontWeight:"700", color:"#0a1628" }}>${draw.sales_amount.toFixed(2)}</span>
          <span style={{ fontSize:"12px", color:"#9ca3af" }}>/ umbral ${draw.sales_threshold_amount}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"13px", color:"#374151", fontWeight:"600" }}>Cantidad:</span>
          <input
            type="number" min="1" max="50" value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            style={{ width:"70px", padding:"8px 10px", borderRadius:"8px", border:"1.5px solid #d1d5db", fontSize:"14px", fontWeight:"600", textAlign:"center", outline:"none" }}
          />
          <span style={{ fontSize:"15px", fontWeight:"700", color:"#0a1628", minWidth:"70px" }}>Total: ${total}</span>
          <button className="btn btn-success" onClick={onBuyClick} disabled={buying} style={{ padding:"10px 20px" }}>
            {buying ? "Abriendo..." : "Comprar con Deuna"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  const [me, setMe] = useState(null);
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [meRes, drawsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/draws/"),
      ]);
      if (meRes.data.role === "admin") { navigate("/admin/dashboard"); return; }
      setMe(meRes.data);
      setDraws(drawsRes.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (drawId, value) => {
    setQuantities((prev) => ({ ...prev, [drawId]: Math.min(50, Math.max(1, Number(value) || 1)) }));
  };

  const handleBuyClick = (draw) => {
    setMessage(""); setError("");
    if (draw.status !== "selling") { setError("Solo puedes comprar en sorteos en venta."); return; }
    setBuyingId(draw.id);
    setSelectedDraw(draw);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setBuyingId(null);
    setMessage("Pago registrado. Espera confirmacion para ver tus boletos.");
    loadData();
  };

  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  const availableDraws = draws.filter((d) => d.status === "selling" || d.status === "ready");
  const drawnDraws = draws.filter((d) => d.status === "drawn");
  const currentQuantity = selectedDraw ? quantities[selectedDraw.id] || 1 : 1;
  const totalAmountCents = selectedDraw && selectedDraw.ticket_price
    ? Math.round(selectedDraw.ticket_price * currentQuantity * 100) : 0;

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-left">
          <h1>Sortea<span>Max</span></h1>
          {me && <p>Panel de usuario · {me.full_name}</p>}
        </div>
        <div className="topbar-right">
          <button className="btn-topbar" onClick={() => navigate("/user/bank-account")}>
            Mi cuenta
          </button>
          <button className="btn-topbar" onClick={() => navigate("/user/tickets")}>
            Mis boletos
          </button>
          <a
            href={"https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MSG)}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration:"none" }}
          >
            <button className="btn-topbar" style={{ background:"#25d366", color:"white" }}>
              Soporte
            </button>
          </a>
          <button className="btn-topbar btn-topbar-danger" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-card"><h3>Sorteos disponibles</h3><p>{availableDraws.length}</p></div>
          <div className="stat-card"><h3>Total sorteos</h3><p>{draws.length}</p></div>
          <div className="stat-card"><h3>Finalizados</h3><p>{drawnDraws.length}</p></div>
          <div className="stat-card"><h3>Listos</h3><p>{draws.filter((d) => d.status === "ready").length}</p></div>
        </div>

        {message && <div className="msg-success" style={{ marginBottom:"16px" }}>{message}</div>}
        {error && <div className="msg-error" style={{ marginBottom:"16px" }}>{error}</div>}

        <div style={{ marginBottom:"8px" }}>
          <h2 style={{ fontSize:"18px", fontWeight:"700", color:"#0a1628", marginBottom:"16px" }}>
            Sorteos disponibles
          </h2>
          {loading ? (
            <p>Cargando sorteos...</p>
          ) : availableDraws.length === 0 ? (
            <div className="section-card">
              <div className="empty-state"><p>No hay sorteos disponibles en este momento.</p></div>
            </div>
          ) : (
            availableDraws.map((draw) => (
              <DrawCard
                key={draw.id}
                draw={draw}
                quantity={quantities[draw.id] || 1}
                onQuantityChange={(val) => handleQuantityChange(draw.id, val)}
                onBuyClick={() => handleBuyClick(draw)}
                buying={buyingId === draw.id && showPayment}
              />
            ))
          )}
        </div>

        {drawnDraws.length > 0 && (
          <div>
            <h2 style={{ fontSize:"18px", fontWeight:"700", color:"#0a1628", marginBottom:"16px" }}>
              Sorteos finalizados
            </h2>
            <div className="section-card">
              <div style={{ padding:"0" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Titulo</th><th>Precio boleto</th><th>Boletos vendidos</th><th>Estado</th><th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drawnDraws.map((draw) => (
                      <tr key={draw.id}>
                        <td style={{ fontWeight:"600" }}>{draw.title}</td>
                        <td>${draw.ticket_price}</td>
                        <td>{draw.tickets_sold}</td>
                        <td><StatusBadge status={draw.status} /></td>
                        <td>
                          <button className="btn btn-primary btn-small" onClick={() => navigate("/user/draws/" + draw.id + "/results")}>
                            Ver resultados
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPayment && selectedDraw && (
        <PaymentModal
          amount={totalAmountCents}
          drawId={selectedDraw.id}
          token={token}
          quantity={currentQuantity}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowPayment(false); setBuyingId(null); }}
        />
      )}
    </div>
  );
}