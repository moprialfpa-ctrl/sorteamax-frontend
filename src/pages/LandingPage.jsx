import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LandingPage() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDraws();
  }, []);

  const loadDraws = async () => {
    try {
      const res = await api.get("/draws/");
      const data = res.data;
      if (Array.isArray(data)) {
        setDraws(data);
      } else if (data && Array.isArray(data.items)) {
        setDraws(data.items);
      } else if (data && Array.isArray(data.draws)) {
        setDraws(data.draws);
      } else if (data && Array.isArray(data.results)) {
        setDraws(data.results);
      } else {
        setDraws([]);
      }
    } catch (err) {
      console.error(err);
      setDraws([]);
    } finally {
      setLoading(false);
    }
  };

  const activeDraws = draws.filter(
    (d) => d.status === "selling" || d.status === "ready"
  );

  const biggestJackpot = activeDraws.reduce(
    (max, d) => (d.jackpot_pool > max ? d.jackpot_pool : max),
    0
  );
  const totalJackpot = activeDraws.reduce((acc, d) => acc + d.jackpot_pool, 0);
  const totalTier10 = activeDraws.reduce((acc, d) => acc + d.tier10_pool, 0);
  const totalFree = activeDraws.reduce((acc, d) => acc + d.free_ticket_pool, 0);
  const totalTickets = activeDraws.reduce((acc, d) => acc + d.tickets_sold, 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0d1f3c 100%)", color: "white", fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: "24px", fontWeight: "800", color: "#d4af37" }}>Sortea Max</div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/login")} style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Iniciar sesion</button>
          <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a1628", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "800" }}>Registrarme gratis</button>
        </div>
      </nav>

      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "20px" }}>Gana premios reales desde cualquier lugar</h1>
        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>Participa en sorteos transparentes, compra tus boletos en segundos y gana premios en efectivo.</p>

        {biggestJackpot > 0 && (
          <div style={{ background: "rgba(212,175,55,0.1)", border: "2px solid #d4af37", borderRadius: "16px", padding: "24px", display: "inline-block", marginBottom: "32px" }}>
            <div style={{ fontSize: "13px", color: "#d4af37", fontWeight: "700", letterSpacing: "2px" }}>JACKPOT ACUMULADO</div>
            <div style={{ fontSize: "48px", fontWeight: "900", color: "#f0d060" }}>${biggestJackpot.toFixed(2)}</div>
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>Premio mayor disponible ahora</div>
          </div>
        )}

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a1628", border: "none", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "800" }}>Crear cuenta gratis</button>
          <button onClick={() => navigate("/login")} style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.3)", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>Ya tengo cuenta</button>
        </div>
      </section>

      <section style={{ padding: "60px 40px", background: "rgba(255,255,255,0.03)" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", marginBottom: "40px" }}>Premios acumulados ahora mismo</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", maxWidth: "900px", margin: "0 auto" }}>
          {[{icon:"trophy",label:"Premio Jackpot",value:`$${totalJackpot.toFixed(2)}`,desc:"11 aciertos"},{icon:"medal",label:"Segundo Premio",value:`$${totalTier10.toFixed(2)}`,desc:"10 aciertos"},{icon:"ticket",label:"Boleto Gratis",value:`$${totalFree.toFixed(2)}`,desc:"9 aciertos"},{icon:"users",label:"Boletos vendidos",value:totalTickets,desc:"En todos los sorteos"}].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px" }}>{item.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#d4af37" }}>{item.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 40px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", marginBottom: "40px" }}>Sorteos activos</h2>
        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>Cargando sorteos...</p>
        ) : activeDraws.length === 0 ? (
          <div style={{ textAlign: "center", color: "#94a3b8" }}>
            <p style={{ fontSize: "48px" }}>No hay sorteos activos en este momento.</p>
            <p>Registrate para recibir notificaciones cuando haya nuevos sorteos.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            {activeDraws.map((draw) => (
              <div key={draw.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "16px" }}>{draw.title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div><div style={{ color: "#94a3b8", fontSize: "12px" }}>Precio boleto</div><div style={{ fontWeight: "700" }}>${draw.ticket_price}</div></div>
                  <div><div style={{ color: "#94a3b8", fontSize: "12px" }}>Premio mayor</div><div style={{ fontWeight: "700", color: "#d4af37" }}>${(draw.jackpot_pool || 0).toFixed(2)}</div></div>
                </div>
                <button onClick={() => navigate("/register")} style={{ width: "100%", background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a1628", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "800" }}>Participar</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ color: "#475569", fontSize: "13px" }}>2026 SorteaMax. Todos los derechos reservados.</p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "8px" }}>
          <span onClick={() => navigate("/login")} style={{ color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}>Iniciar sesion</span>
          <span onClick={() => navigate("/register")} style={{ color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}>Registrarme</span>
        </div>
      </footer>
    </div>
  );
}
