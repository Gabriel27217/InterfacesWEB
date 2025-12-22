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

  const status = car.status || "disponivel";
  const isSold = status === "vendido";
  const isReserved = status === "sob_consulta";

  // cliente só pode adicionar se estiver "disponivel"
  const canAddToCart = status === "disponivel";

  function getPriceLabel() {
    if (isSold) return "Vendido";
    if (isReserved) return "Sob consulta";
    return `${car.preco} €`;
  }

  return (
    <Card>
      <div style={{ marginBottom: "1rem", position: "relative" }}>
        {/* Badge (tipo o print) */}
        {(isSold || isReserved) && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: isSold ? "#111827" : "#0f766e",
              color: "white",
              padding: "0.25rem 0.6rem",
              borderRadius: 6,
              fontSize: "0.75rem",
              fontWeight: 700,
              zIndex: 2,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {isSold ? "VENDIDO" : "SOB CONSULTA"}
          </div>
        )}

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
              opacity: isSold ? 0.85 : 1,
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
              borderRadius: "4px",
            }}
          >
            Sem foto
          </div>
        )}
      </div>

      {/* CABEÇALHO */}
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

      <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "1rem" }}>
        <p style={{ margin: "4px 0" }}>Ano: {car.ano}</p>
        <p style={{ margin: "4px 0" }}>KM: {car.km}</p>

        <p
          style={{
            margin: "8px 0",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: isSold ? "#6b7280" : "#333",
          }}
        >
          {getPriceLabel()}
        </p>
      </div>

      {/* Botões */}
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
        {/* Carrinho */}
        <Button
          type="button"
          onClick={() => addToCart(car)}
          disabled={!canAddToCart}
          style={{
            fontSize: "0.8rem",
            padding: "0.4rem 0.8rem",
            opacity: canAddToCart ? 1 : 0.6,
            cursor: canAddToCart ? "pointer" : "not-allowed",
          }}
        >
          {canAddToCart ? "Adicionar ao Carrinho" : "Indisponível"}
        </Button>

        {/* Admin */}
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
