// src/pages/CartPage.jsx
import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <Card>
        <h2>Carrinho</h2>
        <p>O carrinho está vazio.</p>
      </Card>
    );
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
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                style={{ width: "60px" }}
              />
            </label>
          </div>

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

      <h3>Total: {totalPrice.toFixed(2)} €</h3>

      <Button type="button" onClick={clearCart}>
        Limpar Carrinho
      </Button>
    </Card>
  );
}
