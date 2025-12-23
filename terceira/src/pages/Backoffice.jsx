import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CarForm from "../components/cars/CarForm";
import CarList from "../components/cars/CarList";
import ClientList from "../components/clients/ClientList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { getOrders, updateOrderById } from "../api/ordersApi";
import { updateCarById } from "../api/carsApi";
import { CarsContext } from "../context/CarsContext"; // ← NOVO

export default function Backoffice() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { refreshCars } = useContext(CarsContext); // ← NOVO

  const [editingCar, setEditingCar] = useState(null);

  // pedidos
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [tab, setTab] = useState("em_curso");

  const isAdmin = isLoggedIn && user && user.role === "admin";
  const hasAccess = isAdmin;

  async function refreshOrders() {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      setOrdersError(e?.message || "Erro ao carregar pedidos");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    if (hasAccess) refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => (o.estado || "em_curso") === tab);
  }, [orders, tab]);

  function parseItens(order) {
    try {
      return JSON.parse(order.itens || "[]");
    } catch {
      return [];
    }
  }

  async function handleMarkPaid(order) {
    if (!window.confirm(`Confirmar pagamento do Pedido #${order.id}?`)) return;

    try {
      console.log("1. Atualizando pedido para concluido...");
      await updateOrderById(order.id, { ...order, estado: "concluido" });

      const itens = parseItens(order);
      console.log("2. Itens do pedido:", itens);

      if (itens.length > 0) {
        console.log("3. Marcando carros como vendidos...");
        await Promise.all(
          itens.map((c) => {
            console.log(`   - Atualizando carro ${c.id} para vendido`);
            return updateCarById(c.id, { status: "vendido" });
          })
        );
      }

      console.log("4. Refrescando pedidos...");
      await refreshOrders();

      console.log("5. Refrescando carros..."); // ← NOVO
      await refreshCars(); // ← CRÍTICO: atualiza o status na loja

      alert(
        `Pedido #${order.id} marcado como pago e carros marcados como vendidos.`
      );
    } catch (e) {
      console.error("Erro ao concluir pedido:", e);
      alert(e?.message || "Erro ao concluir pedido");
    }
  }

  const handleEditCar = (car) => {
    setEditingCar(car);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hasAccess) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#dc2626" }}>
        <h2>Acesso Negado</h2>
        <p>Esta página é exclusiva para administradores.</p>
        <p>Maloto!! Assin:Cebolinha</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Voltar à Loja
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Backoffice — Gestão</h1>

      {/* GESTÃO DE CARROS */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Carros</h2>
        <CarForm editingCar={editingCar} onFinish={() => setEditingCar(null)} />
        <CarList onEdit={handleEditCar} />
      </section>

      {/* GESTÃO DE CLIENTES */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Clientes</h2>
        <ClientList />
      </section>

      {/* PEDIDOS */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Pedidos</h2>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <Button
            type="button"
            onClick={() => setTab("em_curso")}
            style={{
              backgroundColor: tab === "em_curso" ? "#2563eb" : "#6c757d",
            }}
          >
            Em curso
          </Button>

          <Button
            type="button"
            onClick={() => setTab("concluido")}
            style={{
              backgroundColor: tab === "concluido" ? "#2563eb" : "#6c757d",
            }}
          >
            Concluídos
          </Button>

          <Button
            type="button"
            onClick={refreshOrders}
            style={{ marginLeft: "auto" }}
          >
            Atualizar
          </Button>
        </div>

        {ordersLoading && <p>A carregar pedidos...</p>}
        {ordersError && <p style={{ color: "red" }}>{ordersError}</p>}

        {!ordersLoading && filteredOrders.length === 0 && (
          <p>Sem pedidos nesta categoria.</p>
        )}

        {filteredOrders.map((order) => {
          const itens = parseItens(order);
          const first = itens[0];

          return (
            <Card key={order.id} style={{ padding: "1rem" }}>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <div
                  style={{
                    width: 80,
                    height: 60,
                    background: "#eee",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  {first?.foto ? (
                    <img
                      src={first.foto}
                      alt={first.modelo || "carro"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <strong>Pedido #{order.id}</strong>
                    <span style={{ opacity: 0.8 }}>{order.estado}</span>
                  </div>

                  <div style={{ opacity: 0.85, marginTop: 4 }}>
                    Cliente: {order.clienteEmail}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    {itens.length === 0 ? (
                      <div style={{ fontSize: "0.95rem", opacity: 0.75 }}>
                        (Sem itens gravados — confirma a coluna "itens" na
                        sheet)
                      </div>
                    ) : (
                      itens.map((i) => (
                        <div key={i.id} style={{ fontSize: "0.95rem" }}>
                          {i.marca} {i.modelo} × {i.quantity}
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ marginTop: 6, fontWeight: 600 }}>
                    Total: {Number(order.total || 0).toFixed(2)} €
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {order.estado !== "concluido" && (
                    <Button type="button" onClick={() => handleMarkPaid(order)}>
                      Marcar como pago
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
