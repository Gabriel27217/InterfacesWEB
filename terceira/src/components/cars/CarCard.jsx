// Importações do React
import React from "react";

// Componentes reutilizáveis da UI
import Card from "../ui/Card"; // Componente cartão para agrupar conteúdo
import Button from "../ui/Button"; // Botão estilizado
import LikeButton from "../ui/LikeButton"; // Botão de likes

// Hook de autenticação
import { useAuth } from "../../hooks/useAuth";

// Hook do carrinho (Context)
import { useCart } from "../../context/CartContext";

export default function CarCard({ car, onEdit, onDelete }) {
  // Obtemos dados do utilizador que fez login
  const { isLoggedIn, user } = useAuth();

  // Obtemos a função para adicionar itens ao carrinho
  const { addToCart } = useCart();

  // Verifica se o utilizador é admin (para mostrar botões de editar/apagar)
  const isAdmin = isLoggedIn && user && user.role === "admin";

  // =========================
  //     ESTADO DO CARRO
  // =========================

  // Define o status do carro (se vier vazio, assume "disponivel")
  const status = car.status || "disponivel";

  // Flags de estado para simplificar condições no JSX
  const isSold = status === "vendido";
  const isReserved = status === "sob_consulta";

  // Cliente só pode adicionar ao carrinho se estiver "disponivel"
  const canAddToCart = status === "disponivel";

  // Função para mostrar o texto do preço conforme o estado do carro
  function getPriceLabel() {
    if (isSold) return "Vendido";
    if (isReserved) return "Sob consulta";
    return `${car.preco} €`;
  }

  return (
    <Card>
      {/* IMAGEM DO CARRO + BADGE (VENDIDO / SOB CONSULTA) */}
      <div style={{ marginBottom: "1rem", position: "relative" }}>
        {/* Badge aparece apenas se o carro estiver vendido ou sob consulta */}
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
            alt={car.modelo} // Alt é importante para acessibilidade
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid #eee",
              opacity: isSold ? 0.85 : 1, // Se estiver vendido, a imagem fica ligeiramente “apagada”
            }}
          />
        ) : (
          // Caso não haja foto, mostrar um placeholder
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

      {/* CABEÇALHO: Marca + Modelo + LikeButton */}
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

        {/* Botão de like do carro */}
        <LikeButton carId={car.id} initialLikes={car.likes || 0} />
      </div>

      {/* DETALHES DO CARRO */}
      <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "1rem" }}>
        <p style={{ margin: "4px 0" }}>Ano: {car.ano}</p>
        <p style={{ margin: "4px 0" }}>KM: {car.km}</p>

        {/* Preço ou label conforme estado */}
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

      {/* BOTÕES: Carrinho + Admin (Editar/Apagar) */}
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
        {/* Botão de Carrinho */}
        <Button
          type="button"
          onClick={() => addToCart(car)}
          disabled={!canAddToCart} // Botão fica desativado quando não está disponível [web:272]
          style={{
            fontSize: "0.8rem",
            padding: "0.4rem 0.8rem",
            opacity: canAddToCart ? 1 : 0.6,
            cursor: canAddToCart ? "pointer" : "not-allowed",
          }}
        >
          {canAddToCart ? "Adicionar ao Carrinho" : "Indisponível"}
        </Button>

        {/* BOTÕES ADMIN: Editar / Apagar */}
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
