// Importa funcionalidades essenciais do React
// - createContext: cria um contexto global
// - useState: gere estados
// - useEffect: executa efeitos ao carregar o componente
import React, { createContext, useEffect, useState } from "react";

// Importa funções da API de pedidos
import { createOrder, getOrders, updateOrderById } from "../api/ordersApi";

// Importa função da API de carros (para atualizar o estado dos carros)
import { updateCarById } from "../api/carsApi";

// Criação do contexto de pedidos
export const OrdersContext = createContext();

// --------------------------------------
// PROVIDER DO CONTEXTO DE PEDIDOS
// --------------------------------------
export function OrdersProvider({ children }) {

  // Estado que guarda todos os pedidos
  const [orders, setOrders] = useState([]);

  // Estado que indica se os pedidos estão a ser carregados
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Estado para guardar erros relacionados com pedidos
  const [ordersError, setOrdersError] = useState(null);

  // --------------------------------------
  // CARREGAR / ATUALIZAR PEDIDOS DA API
  // --------------------------------------
  async function refreshOrders() {
    try {
      setLoadingOrders(true);   // ativa loading
      setOrdersError(null);     // limpa erros anteriores

      // Obtém pedidos da API
      const data = await getOrders();

      // Guarda pedidos no estado
      setOrders(data);
    } catch (e) {
      // Em caso de erro
      setOrdersError(e?.message || "Erro ao carregar pedidos");
      setOrders([]);
    } finally {
      setLoadingOrders(false); // desativa loading
    }
  }

  // Executa ao montar o componente (primeira renderização)
  useEffect(() => {
    refreshOrders();
  }, []);

  // --------------------------------------
  // CHECKOUT (CLIENTE FINALIZA COMPRA)
  // - Cria pedido
  // - Atualiza carros para "sob_consulta"
  // --------------------------------------
  async function checkout({ cart, userEmail, total }) {

    // Se o carrinho estiver vazio, bloqueia
    if (!cart?.length) {
      return { ok: false, message: "Carrinho vazio" };
    }

    try {
      setOrdersError(null);

      // Estrutura do pedido a enviar para a API
      const order = {
        clienteEmail: userEmail,
        estado: "em_curso",
        total: Number(total) || 0,

        // Itens do carrinho são guardados como JSON (string)
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

      // Cria o pedido na API
      await createOrder(order);

      // Atualiza todos os carros comprados para "sob_consulta"
      await Promise.all(
        cart.map((c) =>
          updateCarById(c.id, { status: "sob_consulta" })
        )
      );

      // Recarrega lista de pedidos
      await refreshOrders();

      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro no checkout" };
    }
  }

  // --------------------------------------
  // ADMIN MARCA PEDIDO COMO PAGO
  // - Pedido passa para "concluido"
  // - Carros passam para "vendido"
  // --------------------------------------
  async function markAsPaid(order) {
    try {
      setOrdersError(null);

      // Atualiza estado do pedido
      await updateOrderById(order.id, {
        ...order,
        estado: "concluido",
      });

      // Converte os itens de string para array
      const itens = JSON.parse(order.itens || "[]");

      // Atualiza cada carro para "vendido"
      await Promise.all(
        itens.map((c) =>
          updateCarById(c.id, { status: "vendido" })
        )
      );

      // Recarrega pedidos
      await refreshOrders();

      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao concluir pedido" };
    }
  }

  // --------------------------------------
  // PROVIDER DO CONTEXTO
  // --------------------------------------
  return (
    <OrdersContext.Provider
      value={{
        orders,          // lista de pedidos
        loadingOrders,   // loading dos pedidos
        ordersError,     // erros
        refreshOrders,   // recarregar pedidos
        checkout,        // finalizar compra
        markAsPaid,      // admin conclui pedido
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}