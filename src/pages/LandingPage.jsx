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
      setDraws(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeDraws = draws.filter(
    (d) => d.status === "selling" || d.status === "ready"
  );
  const biggestJackpot = activeDraws.reduce(
    (max, d) => (d.jackpot_pool > max ? d.jackpot_pool : max), 0
  );
  const totalJackpot = activeDraws.reduce((acc, d) => acc + d.jackpot_pool, 0);
  const totalTier10 = activeDraws.reduce((acc, d) => acc + d.tier10_pool, 0);
  const totalFree = activeDraws.reduce((acc, d) => acc + d.free_ticket_pool, 0);
  const totalTickets = activeDraws.reduce((acc, d) => acc + d.tickets_sold, 0);

  return (
    <div style={{ background: "#0a1628", minHeight: "100vh", color: "white" }}>

      <nav style={{
        background: "rgba(10,22,40,0.95)", backdropFilter: "blur(10px)",
        padding: "16px 40px", display: "flex", justifyContent: "space-between",
        alignItems: "center", position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(212,175,55,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🎰</span>
          <span style={{ fontSize: "22px", fontWeight: "800", color: "white" }}>
            Sortea<span style={{ color: "#d4af37" }}>Max</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/login")} style={{
            background: "transparent", color: "white",
            border: "1px solid rgba(255,255,255,0.3)", padding: "10px 20px",
            borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
          }}>
            Iniciar sesion
          </button>
          <button onClick={() => navigate("/register")} style={{
            background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a1628",
            border: "none", padding: "10px 20px", borderRadius: "8px",
            cursor: "pointer", fontSize: "14px", fontWeight: "800",
          }}>
            Registrarme gratis
          </button>
        </div>
      </nav>

      <section style={{
        padding: "80px 40px", textAlign: "center",
        background: "linear-gradient(135deg, #0a1628 0%, #0f2744 50%, #0a1628 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          top: "-100px", right: "-100px", borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(15,118,110,0.1) 0%, transparent 70%)",
          bottom: "-100px", left: "-100px", borderRadius: "50%",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block", background: "rgba(212,175,55,0.15)",
            border: "1px solid rgba(212,175,55,0.4)", padding: "6px 16px",
            borderRadius: "999px", fontSize: "13px", color: "#d4af37",
            fontWeight: "600", marginBottom: "20px",
          }}>
            Plataforma oficial de sorteos en linea
          </div>
          <h1 style={{ fontSize: "56px", fontWeight: "900", lineHeight: "1.1", marginBottom: "20px", color: "white" }}>
            Gana premios reales
            <br />
            <span style={{ color: "#d4af37" }}>desde cualquier lugar</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#94a3b8", maxWidth: "560px", margin: "0 auto 32px", lineHeight: "1.6" }}>
            Participa en sorteos transparentes, compra tus boletos en segundos
            y gana premios en efectivo. 100% en linea, seguro y confiable.
          </p>
          {biggestJackpot > 0 && (
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg, rgba(185,28,28,0.3), rgba(185,28,28,0.1))",
              border: "2px solid rgba(185,28,28,0.5)",
              borderRadius: "16px", padding: "20px 40px", marginBottom: "32px",
            }}>
              <p style={{ color: "#fca5a5", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                JACKPOT ACUMULADO
              </p>
              <p style={{ color: "white", fontSize: "48px", fontWeight: "900" }}>
                ${biggestJackpot.toFixed(2)}
              </p>
              <p style={{ color: "#fca5a5", fontSize: "13px" }}>Premio mayor disponible ahora</p>
            </div>
          )}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{
              background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a1628",
              border: "none", padding: "16px 32px", borderRadius: "12px",
              cursor: "pointer", fontSize: "16px", fontWeight: "800",
            }}>
              Crear cuenta gratis
            </button>
            <button onClick={() => navigate("/login")} style={{
              background: "transparent", color: "white",
              border: "2px solid rgba(255,255,255,0.3)", padding: "16px 32px",
              borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "600",
            }}>
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </section>
            <section style={{
        padding: "50px 40px",
        background: "linear-gradient(135deg, #0f2744, #0a1628)",
        borderTop: "1px solid rgba(212,175,55,0.2)",
        borderBottom: "1px solid rgba(212,175,55,0.2)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "800", marginBottom: "8px" }}>
              Premios acumulados ahora mismo
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>
              Estos son los premios que puedes ganar hoy participando en nuestros sorteos activos
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>

            <div style={{
              background: "linear-gradient(135deg, rgba(185,28,28,0.2), rgba(185,28,28,0.05))",
              border: "2px solid rgba(185,28,28,0.4)",
              borderRadius: "16px", padding: "24px", textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
              <p style={{ fontSize: "12px", color: "#fca5a5", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Premio Jackpot
              </p>
              <p style={{ fontSize: "36px", fontWeight: "900", color: "white", marginBottom: "4px" }}>
                ${totalJackpot.toFixed(2)}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>Para quien acierte 11 numeros</p>
              <div style={{ marginTop: "12px", background: "rgba(185,28,28,0.2)", borderRadius: "8px", padding: "6px 10px" }}>
                <p style={{ fontSize: "11px", color: "#fca5a5" }}>Premio mayor acumulado</p>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(29,78,216,0.2), rgba(29,78,216,0.05))",
              border: "2px solid rgba(29,78,216,0.4)",
              borderRadius: "16px", padding: "24px", textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🥈</div>
              <p style={{ fontSize: "12px", color: "#93c5fd", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Segundo Premio
              </p>
              <p style={{ fontSize: "36px", fontWeight: "900", color: "white", marginBottom: "4px" }}>
                ${totalTier10.toFixed(2)}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>Para quien acierte 10 numeros</p>
              <div style={{ marginTop: "12px", background: "rgba(29,78,216,0.2)", borderRadius: "8px", padding: "6px 10px" }}>
                <p style={{ fontSize: "11px", color: "#93c5fd" }}>Premio acumulado</p>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(15,118,110,0.2), rgba(15,118,110,0.05))",
              border: "2px solid rgba(15,118,110,0.4)",
              borderRadius: "16px", padding: "24px", textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎟</div>
              <p style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Boleto Gratis
              </p>
              <p style={{ fontSize: "36px", fontWeight: "900", color: "white", marginBottom: "4px" }}>
                ${totalFree.toFixed(2)}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>Para quien acierte 9 numeros</p>
              <div style={{ marginTop: "12px", background: "rgba(15,118,110,0.2)", borderRadius: "8px", padding: "6px 10px" }}>
                <p style={{ fontSize: "11px", color: "#6ee7b7" }}>Participa en el siguiente sorteo gratis</p>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))",
              border: "2px solid rgba(212,175,55,0.4)",
              borderRadius: "16px", padding: "24px", textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎫</div>
              <p style={{ fontSize: "12px", color: "#d4af37", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Boletos vendidos
              </p>
              <p style={{ fontSize: "36px", fontWeight: "900", color: "white", marginBottom: "4px" }}>
                {totalTickets}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>En todos los sorteos activos</p>
              <div style={{ marginTop: "12px", background: "rgba(212,175,55,0.15)", borderRadius: "8px", padding: "6px 10px" }}>
                <p style={{ fontSize: "11px", color: "#d4af37" }}>Unete a los participantes</p>
              </div>
            </div>

          </div>

          <div style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: "16px", padding: "24px 32px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: "16px",
          }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "6px" }}>
                Premios en efectivo garantizados
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", maxWidth: "500px", lineHeight: "1.6" }}>
                Cada sorteo tiene premios reales en efectivo para los ganadores.
                El proceso es completamente automatico, justo y transparente.
                Los premios se acreditan directamente a tu cuenta.
              </p>
            </div>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "linear-gradient(135deg, #d4af37, #f0d060)",
                color: "#0a1628", border: "none", padding: "14px 28px",
                borderRadius: "10px", cursor: "pointer", fontSize: "15px",
                fontWeight: "800", whiteSpace: "nowrap",
              }}
            >
              Quiero participar
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 40px", background: "#0f2744" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "8px" }}>
            Como funciona
          </h2>
          <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "40px", fontSize: "15px" }}>
            Participar es muy sencillo, solo sigue estos 4 pasos
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { icon: "👤", step: "1", title: "Crea tu cuenta", desc: "Registrate gratis en segundos. Solo necesitas tu correo y una contrasena." },
              { icon: "🎟", step: "2", title: "Elige tu sorteo", desc: "Revisa los sorteos activos, los premios acumulados y elige el que mas te guste." },
              { icon: "💳", step: "3", title: "Compra tu boleto", desc: "Selecciona la cantidad de boletos y paga de forma segura con tu metodo favorito." },
              { icon: "🏆", step: "4", title: "Gana premios", desc: "Si tus numeros coinciden con los ganadores, el premio se acredita directamente a tu cuenta." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "16px", padding: "28px 20px", textAlign: "center",
              }}>
                <div style={{
                  width: "48px", height: "48px",
                  background: "linear-gradient(135deg, #d4af37, #f0d060)",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px", fontWeight: "900",
                  color: "#0a1628", margin: "0 auto 12px",
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
            <section style={{ padding: "60px 40px", background: "#0a1628" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "8px" }}>
            Sorteos activos
          </h2>
          <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "40px", fontSize: "15px" }}>
            Estos son los sorteos disponibles ahora mismo
          </p>

          {loading ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>Cargando sorteos...</p>
          ) : activeDraws.length === 0 ? (
            <div style={{
              textAlign: "center", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "40px",
            }}>
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>🎰</p>
              <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                No hay sorteos activos en este momento.
              </p>
              <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "8px" }}>
                Registrate para recibir notificaciones cuando haya nuevos sorteos.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {activeDraws.map((draw) => (
                <div key={draw.id} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  borderRadius: "16px", overflow: "hidden",
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, #0f2744, #1a3a5c)",
                    padding: "20px",
                    borderBottom: "1px solid rgba(212,175,55,0.2)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "white", marginBottom: "6px" }}>
                          {draw.title}
                        </h3>
                        <span style={{
                          background: "rgba(212,175,55,0.2)", color: "#d4af37",
                          padding: "3px 10px", borderRadius: "999px",
                          fontSize: "12px", fontWeight: "600",
                        }}>
                          {draw.status === "selling" ? "En venta" : "Listo para sortear"}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#94a3b8", fontSize: "11px" }}>Precio boleto</p>
                        <p style={{ color: "#d4af37", fontSize: "22px", fontWeight: "800" }}>
                          ${draw.ticket_price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1px", background: "rgba(255,255,255,0.1)",
                  }}>
                    <div style={{ background: "rgba(10,22,40,0.8)", padding: "14px", textAlign: "center" }}>
                      <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600",
                        textTransform: "uppercase", marginBottom: "4px" }}>
                        Premio mayor
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "800", color: "#fca5a5" }}>
                        ${draw.jackpot_pool.toFixed(2)}
                      </p>
                      <p style={{ fontSize: "10px", color: "#6b7280" }}>11 aciertos</p>
                    </div>
                    <div style={{ background: "rgba(10,22,40,0.8)", padding: "14px", textAlign: "center" }}>
                      <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600",
                        textTransform: "uppercase", marginBottom: "4px" }}>
                        Segundo premio
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "800", color: "#93c5fd" }}>
                        ${draw.tier10_pool.toFixed(2)}
                      </p>
                      <p style={{ fontSize: "10px", color: "#6b7280" }}>10 aciertos</p>
                    </div>
                    <div style={{ background: "rgba(10,22,40,0.8)", padding: "14px", textAlign: "center" }}>
                      <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600",
                        textTransform: "uppercase", marginBottom: "4px" }}>
                        Boleto gratis
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "800", color: "#6ee7b7" }}>
                        ${draw.free_ticket_pool.toFixed(2)}
                      </p>
                      <p style={{ fontSize: "10px", color: "#6b7280" }}>9 aciertos</p>
                    </div>
                  </div>

                  <div style={{
                    padding: "16px 20px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {draw.tickets_sold} boletos vendidos
                      </p>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                        Ventas acumuladas: ${draw.sales_amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/register")}
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #f0d060)",
                        color: "#0a1628", border: "none", padding: "10px 20px",
                        borderRadius: "8px", cursor: "pointer",
                        fontSize: "13px", fontWeight: "800",
                      }}
                    >
                      Participar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "60px 40px", background: "#0f2744" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", textAlign: "center" }}>
            {[
              { icon: "🔒", title: "100% Seguro", desc: "Tus datos y pagos estan protegidos con la mas alta seguridad." },
              { icon: "✅", title: "Sorteos transparentes", desc: "El proceso de seleccion de numeros es aleatorio, verificable y justo." },
              { icon: "⚡", title: "Resultados inmediatos", desc: "Conoce los resultados al instante y recibe tu premio sin demoras." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px", padding: "32px 24px",
              }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px", color: "white" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
            <section style={{ padding: "60px 40px", background: "#0a1628", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "16px" }}>
            Listo para ganar?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "28px", lineHeight: "1.6" }}>
            Unete a miles de participantes que ya confian en SorteaMax.
            Crea tu cuenta gratis y compra tu primer boleto hoy.
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "linear-gradient(135deg, #d4af37, #f0d060)",
              color: "#0a1628", border: "none",
              padding: "18px 40px", borderRadius: "12px",
              cursor: "pointer", fontSize: "18px", fontWeight: "800",
            }}
          >
            Crear cuenta gratis ahora
          </button>
        </div>
      </section>

      <footer style={{
        background: "#060e1a", padding: "24px 40px",
        borderTop: "1px solid rgba(212,175,55,0.2)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🎰</span>
          <span style={{ fontSize: "16px", fontWeight: "800", color: "white" }}>
            Sortea<span style={{ color: "#d4af37" }}>Max</span>
          </span>
        </div>
        <p style={{ color: "#475569", fontSize: "13px" }}>
          2026 SorteaMax. Todos los derechos reservados.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}
          >
            Iniciar sesion
          </span>
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}
          >
            Registrarme
          </span>
        </div>
      </footer>

    </div>
  );
}