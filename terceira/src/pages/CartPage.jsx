// Importação do React e hooks necessários
import React, { useState, useContext } from "react";

// Importação de componentes UI reutilizáveis
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Hook do carrinho (Context API)
import { useCart } from "../context/CartContext";

// Hook de autenticação
import { useAuth } from "../hooks/useAuth";

// Funções da API para pedidos e carros
import { createOrder } from "../api/ordersApi";
import { updateCarById } from "../api/carsApi";

// Contexto dos carros (para refrescar a loja após compra)
import { CarsContext } from "../context/CarsContext"; // ← NOVO

// --------------------------------------------------
// PÁGINA DO CARRINHO
// --------------------------------------------------
export default function CartPage() {

  // Dados e funções do carrinho
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  // Dados do utilizador autenticado
  const { user } = useAuth();

  // Função para atualizar lista de carros (status)
  const { refreshCars } = useContext(CarsContext); // ← NOVO

  // Mensagem de feedback (sucesso / erro)
  const [msg, setMsg] = useState(null);

  // Estado para bloquear botões durante submissão
  const [submitting, setSubmitting] = useState(false);

  // --------------------------------------------
  // CASO O CARRINHO ESTEJA VAZIO
  // --------------------------------------------
  if (cart.length === 0) {
    return (
      <Card>
        <h2>Carrinho</h2>
        <p>O carrinho está vazio.</p>
      </Card>
    );
  }

  // --------------------------------------------
  // FINALIZAR COMPRA (CHECKOUT)
  // --------------------------------------------
  async function handleCheckout() {
    try {
      setSubmitting(true); // bloqueia botões
      setMsg(null);        // limpa mensagens anteriores

      // Obtém email do utilizador (com fallback)
      const clienteEmail =
        user?.email || user?.Email || user?.username || "sem-email";

      // Prepara os itens do carrinho para o pedido
      const itens = cart.map((c) => ({
        id: c.id,
        marca: c.marca,
        modelo: c.modelo,
        preco: c.preco,
        quantity: c.quantity,
        foto: c.foto || "",
      }));

      console.log("1. Criando pedido...");
      // 1) Criar pedido na API
      await createOrder({
        clienteEmail,
        estado: "em_curso",
        total: Number(totalPrice) || 0,
        itens: JSON.stringify(itens),
      });

      console.log("2. Marcando carros como sob_consulta...");
      // 2) Atualizar estado dos carros para "sob_consulta"
      await Promise.all(
        cart.map((c) =>
          updateCarById(c.id, { status: "sob_consulta" })
        )
      );

      console.log("3. Refrescando carros...");
      // 3) Atualiza lista de carros (importante para refletir estado na loja)
      await refreshCars(); // ← CRÍTICO

      // Limpa carrinho após sucesso
      clearCart();

      // Mensagem de sucesso
      setMsg(
        "Pedido criado! Estado: Em curso (aguarda validação do administrador)."
      );
    } catch (e) {
      console.error("Erro no checkout:", e);
      setMsg(e?.message || "Erro ao finalizar compra.");
    } finally {
      setSubmitting(false); // desbloqueia botões
    }
  }

  // --------------------------------------------
  // RENDERIZAÇÃO DO CARRINHO
  // --------------------------------------------
  return (
    <Card>
      <h2>Carrinho</h2>

      {/* Lista de itens do carrinho */}
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            borderBottom: "1px solid #eee",
            paddingBottom: "0.5rem",
          }}
        >
          {/* Informação do carro */}
          <div style={{ flex: 1 }}>
            <h3>
              {item.marca} {item.modelo}
            </h3>
            <p>{item.preco} €</p>

            {/* Alteração da quantidade */}
            <label>
              Quantidade:{" "}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                style={{ width: "60px" }}
              />
            </label>
          </div>

          {/* Preço da linha + remover */}
          <div style={{ textAlign: "right" }}>
            <p>
              Linha: {(item.preco * item.quantity).toFixed(2)} €
            </p>
            <Button type="button" onClick={() => removeFromCart(item.id)}>
              Remover
            </Button>
          </div>
        </div>
      ))}

      {/* Total do carrinho */}
      <h3>Total: {totalPrice.toFixed(2)} €</h3>

      {/* Mensagem de feedback */}
      {msg && <p style={{ marginTop: "0.75rem" }}>{msg}</p>}

      {/* Botões de ação */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Button
          type="button"
          onClick={clearCart}
          style={{ backgroundColor: "#6c757d" }}
          disabled={submitting}
        >
          Limpar Carrinho
        </Button>

        <Button
          type="button"
          onClick={handleCheckout}
          disabled={submitting}
        >
          {submitting ? "A processar..." : "Finalizar compra"}
        </Button>
      </div>
    </Card>
  );
}