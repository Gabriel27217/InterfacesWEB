// src/context/CartContext.jsx

// Importa funções necessárias do React
import React, { createContext, useContext, useState } from "react";

// Criação do contexto do carrinho
const CartContext = createContext();

// Provider que vai envolver os componentes que precisam do carrinho
export function CartProvider({ children }) {

  // Estado que guarda os itens do carrinho
  // Cada item terá: dados do carro + quantity
  const [cart, setCart] = useState([]);

  // -----------------------------
  // ADICIONAR CARRO AO CARRINHO
  // -----------------------------
  function addToCart(car) {
    setCart((prev) => {
      // Verifica se o carro já existe no carrinho
      const existing = prev.find((item) => item.id === car.id);

      // Se já existir, aumenta a quantidade
      if (existing) {
        return prev.map((item) =>
          item.id === car.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Se não existir, adiciona com quantidade inicial 1
      return [...prev, { ...car, quantity: 1 }];
    });
  }

  // -----------------------------
  // REMOVER CARRO DO CARRINHO
  // -----------------------------
  function removeFromCart(id) {
    // Remove o item cujo id corresponde
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // -----------------------------
  // LIMPAR TODO O CARRINHO
  // -----------------------------
  function clearCart() {
    setCart([]);
  }

  // -----------------------------
  // ATUALIZAR QUANTIDADE DE UM ITEM
  // -----------------------------
  function updateQuantity(id, quantity) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          // Garante que a quantidade nunca é menor que 1
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }

  // -----------------------------
  // TOTAL DE ITENS NO CARRINHO
  // -----------------------------
  // Soma todas as quantidades
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // -----------------------------
  // PREÇO TOTAL DO CARRINHO
  // -----------------------------
  // Soma (quantidade * preço) de cada item
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + item.quantity * (Number(item.preco) || 0),
    0
  );

  // -----------------------------
  // PROVIDER DO CONTEXTO
  // -----------------------------
  return (
    <CartContext.Provider
      value={{
        cart,           // lista de itens no carrinho
        addToCart,      // adicionar item
        removeFromCart, // remover item
        clearCart,      // limpar carrinho
        updateQuantity, // alterar quantidade
        totalItems,     // total de itens
        totalPrice,     // preço total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// -----------------------------
// HOOK PERSONALIZADO useCart
// -----------------------------
// Facilita o acesso ao contexto em qualquer componente
export function useCart() {
  return useContext(CartContext);
}