import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import LikeButton from "../ui/LikeButton";
import { useCart } from "../../context/CartContext";

export default function CarCard({ car, onEdit, onDelete }) {
  const { isLoggedIn, user } = useAuth();
  const { addToCart } = useCart();

  const isAdmin = isLoggedIn && user && user.role === "admin";

  return (
    <Card>
      <div style={{ marginBottom: "1rem" }}>
        {car.foto ? (
          <img
            src={car.foto}
            alt={car.modelo}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid #eee",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            Sem foto
          </div>
        )}
      </div>

      {/* CABEÇALHO: Título + Like Button lado a lado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
          {car.marca} {car.modelo}
        </h3>

        <LikeButton carId={car.id} initialLikes={car.likes || 0} />
      </div>

      <div
        style={{
          fontSize: "0.9rem",
          color: "#555",
          marginBottom: "1rem",
        }}
      >
        <p style={{ margin: "4px 0" }}>Ano: {car.ano}</p>
        <p style={{ margin: "4px 0" }}>KM: {car.km}</p>
        <p
          style={{
            margin: "8px 0",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {car.preco} €
        </p>
      </div>

      {/* Botões de ação (Cliente/Admin) */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "0.5rem",
          borderTop: "1px solid #eee",
          paddingTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Botão de Carrinho – sempre visível no frontoffice */}
        <Button
          type="button"
          onClick={() => addToCart(car)}
          style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
        >
          Adicionar ao Carrinho
        </Button>

        {/* Botões de Admin (Editar/Apagar) */}
        {isAdmin && (
          <>
            {onEdit && (
              <Button
                onClick={() => onEdit(car)}
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(car.id)}
                style={{
                  backgroundColor: "red",
                  fontSize: "0.8rem",
                  padding: "0.4rem 0.8rem",
                }}
              >
                Apagar
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
