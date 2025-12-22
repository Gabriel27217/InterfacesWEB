import React, { createContext, useEffect, useState } from "react";
import { createOrder, getOrders, updateOrderById } from "../api/ordersApi";
import { updateCarById } from "../api/carsApi";

export const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  async function refreshOrders() {
    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      setOrdersError(e?.message || "Erro ao carregar pedidos");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    refreshOrders();
  }, []);

  // Cliente finaliza compra -> cria pedido + põe carros "sob_consulta"
  async function checkout({ cart, userEmail, total }) {
    if (!cart?.length) return { ok: false, message: "Carrinho vazio" };

    try {
      setOrdersError(null);

      const order = {
        clienteEmail: userEmail,
        estado: "em_curso",
        total: Number(total) || 0,
        itens: JSON.stringify(
          cart.map((c) => ({
            id: c.id,
            marca: c.marca,
            modelo: c.modelo,
            preco: c.preco,
            quantity: c.quantity,
            foto: c.foto || "",
          }))
        ),
      };

      await createOrder(order);

      // Atualiza carros para "sob_consulta"
      await Promise.all(
        cart.map((c) => updateCarById(c.id, { status: "sob_consulta" }))
      );

      await refreshOrders();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro no checkout" };
    }
  }

  // Admin marca como pago -> pedido concluído + carros vendidos
  async function markAsPaid(order) {
    try {
      setOrdersError(null);

      await updateOrderById(order.id, { ...order, estado: "concluido" });

      const itens = JSON.parse(order.itens || "[]");
      await Promise.all(itens.map((c) => updateCarById(c.id, { status: "vendido" })));

      await refreshOrders();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao concluir pedido" };
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loadingOrders,
        ordersError,
        refreshOrders,
        checkout,
        markAsPaid,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
