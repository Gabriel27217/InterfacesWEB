// Importa React
import React from "react";

// Importa componentes do React Router para navegação interna
import { Link, useNavigate } from "react-router-dom";

// Importa o hook customizado para autenticação
import { useAuth } from "../../hooks/useAuth";

// Importa o hook do carrinho (Context) para mostrar total de itens
import { useCart } from "../../context/CartContext";

// Componente Navbar
export default function Navbar() {
  // Estado de login, função de logout e info do utilizador autenticado
  const { isLoggedIn, logout, user } = useAuth();

  // Total de itens no carrinho (vem do CartContext)
  const { totalItems } = useCart();

  // Hook do React Router para redirecionamento programático [web:192]
  const navigate = useNavigate();

  // Verifica se o utilizador logado é admin
  const isAdmin = isLoggedIn && user && user.role === "admin";

  // =========================
  //           LOGOUT
  // =========================

  // Função chamada quando o utilizador clica em "Sair"
  function handleLogout() {
    logout(); // Limpa o estado de login
    navigate("/"); // Redireciona para a página inicial
  }

  // =========================
  //           ESTILOS
  // =========================

  // Estilo padrão para links
  const linkStyle = {
    color: "white",
    fontSize: "1rem",
    textDecoration: "none",
    cursor: "pointer",
  };

  // Estilo padrão para botões
  const button = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
  };

  // =========================
  //        RENDERIZAÇÃO
  // =========================
  return (
    <nav>
      {/* Logo / Título */}
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>🏎️ AutoVital</h1>

      {/* Menu de links */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap", // Quebra de linha se a tela for pequena
        }}
      >
        {/* Links públicos */}
        <Link to="/" style={linkStyle}>
          Início
        </Link>
        <Link to="/loja" style={linkStyle}>
          Loja
        </Link>
        <Link to="/sobre" style={linkStyle}>
          Sobre Nós
        </Link>

        {/* Link para Admin */}
        {isAdmin && (
          <Link to="/gerir" style={linkStyle}>
            Backoffice
          </Link>
        )}

        {/* Link do carrinho (só aparece depois de login) */}
        {isLoggedIn && (
          <Link to="/carrinho" style={linkStyle}>
            Carrinho ({totalItems})
          </Link>
        )}

        {/* Links para utilizadores não logados */}
        {!isLoggedIn && (
          <>
            <Link to="/registar" style={linkStyle}>
              Criar Conta
            </Link>

            <button
              onClick={() => navigate("/login")}
              style={{ ...button, background: "rgba(255,255,255,0.2)" }}
            >
              Login
            </button>
          </>
        )}

        {/* Links para utilizadores logados (clientes ou admin) */}
        {isLoggedIn && (
          <>
            {/* Link para clientes (não admin) */}
            {!isAdmin && (
              <Link to="/minha-conta" style={linkStyle}>
                Minha Conta
              </Link>
            )}

            {/* Saudação do utilizador (optional chaining para evitar erro se user for null) [web:314] */}
            <span style={{ color: "white", opacity: 0.8 }}>
              Olá, {user?.username || user?.name || "Utilizador"}!
            </span>

            {/* Botão de logout */}
            <button
              onClick={handleLogout}
              style={{ ...button, background: "rgba(255,255,255,0.2)" }}
            >
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
