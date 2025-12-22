import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../api/ordersApi";
import { updateCarById } from "../api/carsApi";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <Card>
        <h2>Carrinho</h2>
        <p>O carrinho está vazio.</p>
      </Card>
    );
  }

  async function handleCheckout() {
    try {
      setSubmitting(true);
      setMsg(null);

      const clienteEmail =
        user?.email || user?.Email || user?.username || "sem-email";

      const itens = cart.map((c) => ({
        id: c.id,
        marca: c.marca,
        modelo: c.modelo,
        preco: c.preco,
        quantity: c.quantity,
        foto: c.foto || "",
      }));

      // 1) cria pedido
      await createOrder({
        clienteEmail,
        estado: "em_curso",
        total: Number(totalPrice) || 0,
        itens: JSON.stringify(itens),
      });

      // 2) marca carros como "sob_consulta"
      await Promise.all(
        cart.map((c) => updateCarById(c.id, { status: "sob_consulta" }))
      );

      clearCart();
      setMsg("Pedido criado! Estado: Em curso (aguarda validação do administrador).");
    } catch (e) {
      setMsg(e?.message || "Erro ao finalizar compra.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2>Carrinho</h2>

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
          <div style={{ flex: 1 }}>
            <h3>
              {item.marca} {item.modelo}
            </h3>
            <p>{item.preco} €</p>
            <label>
              Quantidade:{" "}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                style={{ width: "60px" }}
              />
            </label>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>Linha: {(item.preco * item.quantity).toFixed(2)} €</p>
            <Button type="button" onClick={() => removeFromCart(item.id)}>
              Remover
            </Button>
          </div>
        </div>
      ))}

      <h3>Total: {totalPrice.toFixed(2)} €</h3>

      {msg && <p style={{ marginTop: "0.75rem" }}>{msg}</p>}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Button
          type="button"
          onClick={clearCart}
          style={{ backgroundColor: "#6c757d" }}
          disabled={submitting}
        >
          Limpar Carrinho
        </Button>

        <Button type="button" onClick={handleCheckout} disabled={submitting}>
          {submitting ? "A processar..." : "Finalizar compra"}
        </Button>
      </div>
    </Card>
  );
}
