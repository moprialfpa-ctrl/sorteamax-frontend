// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PaymentModal from "../components/PaymentModal";

export default function DashboardPage() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDraw, setSelectedDraw] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await api.get("/draws/");
      setDraws(response.data);
    } catch (error) {
      console.error("Error cargando sorteos", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleOpenPayment = (draw) => {
    if (draw.status !== "selling") {
      alert("Solo puedes comprar en sorteos que están en venta.");
      return;
    }
    setSelectedDraw(draw);
    setQuantity(1);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (payment) => {
    console.log("Pago registrado:", payment);
    setShowPayment(false);
    // tras registrar pago puedes recargar sorteos si quieres ver ventas actualizadas
    fetchDraws();
    alert("Pago registrado. Espera confirmación para ver tus boletos.");
  };

  const totalAmountCents =
    selectedDraw ? Math.round(selectedDraw.ticket_price * quantity * 100) : 0;

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>Dashboard SorteaMax</h1>
        <button onClick={logout}>Salir</button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <h3>Total sorteos</h3>
          <p>{draws.length}</p>
        </div>

        <div className="stat-card">
          <h3>En venta</h3>
          <p>{draws.filter((d) => d.status === "selling").length}</p>
        </div>

        <div className="stat-card">
          <h3>Listos</h3>
          <p>{draws.filter((d) => d.status === "ready").length}</p>
        </div>

        <div className="stat-card">
          <h3>Ejecutados</h3>
          <p>{draws.filter((d) => d.status === "drawn").length}</p>
        </div>
      </section>

      <section className="table-section">
        <h2>Sorteos</h2>

        {loading ? (
          <p>Cargando sorteos...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Precio</th>
                <th>Ventas</th>
                <th>Boletos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw.id}>
                  <td>{draw.title}</td>
                  <td>${draw.ticket_price}</td>
                  <td>${draw.sales_amount}</td>
                  <td>{draw.tickets_sold}</td>
                  <td>{draw.status}</td>
                  <td>
                    {draw.status === "selling" ? (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          defaultValue={1}
                          style={{ width: "60px" }}
                          onChange={(e) => {
                            const val = parseInt(e.target.value || "1", 10);
                            // cuando selecciones este sorteo y abras modal, usamos este valor
                            if (selectedDraw && selectedDraw.id === draw.id) {
                              setQuantity(val);
                            }
                          }}
                          onClick={() => {
                            // si el usuario ajusta cantidad en esta fila, marcamos este sorteo como seleccionado
                            setSelectedDraw(draw);
                          }}
                        />
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleOpenPayment(draw)}
                        >
                          Comprar con Deuna
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        No disponible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showPayment && selectedDraw && (
        <PaymentModal
          amount={totalAmountCents}
          drawId={selectedDraw.id}
          token={token}
          quantity={quantity}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}