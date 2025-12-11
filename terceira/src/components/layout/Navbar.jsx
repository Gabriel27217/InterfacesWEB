import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Verifica se é admin (para usar na lógica abaixo)
  const isAdmin = isLoggedIn && user && user.role === "admin";

  return (
    <nav>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>🏎️ AutoVital</h1>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={linkStyle}>Início</Link>
        <Link to="/loja" style={linkStyle}>Loja</Link>
        <Link to="/sobre" style={linkStyle}>Sobre Nós</Link>

        {/* --- ALTERADO AQUI --- */}
        {/* Só mostra o Backoffice se for ADMIN */}
        {isAdmin && (
          <Link to="/gerir" style={linkStyle}>
            Backoffice
          </Link>
        )}

        {/* Links para quem NÃO está logado */}
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

        {/* Links para quem ESTÁ logado (Cliente ou Admin) */}
        {isLoggedIn && (
          <>
            {/* Opcional: Link para a área de cliente se NÃO for admin */}
            {!isAdmin && (
              <Link to="/minha-conta" style={linkStyle}>
                Minha Conta
              </Link>
            )}
            
            <span style={{ color: "white", opacity: 0.8 }}>
              Olá, {user.username || user.name || "Utilizador"}!
            </span>
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

const linkStyle = {
  color: "white",
  fontSize: "1rem",
  textDecoration: "none",
  cursor: "pointer",
};

const button = {
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
  color: "white",
  cursor: "pointer",
};
