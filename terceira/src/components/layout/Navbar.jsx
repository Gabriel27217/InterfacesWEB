import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = isLoggedIn && user && user.role === "admin";

  function handleLogout() {
    logout();
    navigate("/");
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

  return (
    <nav>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>🏎️ AutoVital</h1>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link to="/" style={linkStyle}>Início</Link>
        <Link to="/loja" style={linkStyle}>Loja</Link>
        <Link to="/sobre" style={linkStyle}>Sobre Nós</Link>

        {isAdmin && (
          <Link to="/gerir" style={linkStyle}>Backoffice</Link>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/registar" style={linkStyle}>Criar Conta</Link>
            <button
              onClick={() => navigate("/login")}
              style={{ ...button, background: "rgba(255,255,255,0.2)" }}
            >
              Login
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            {!isAdmin && (
              <Link to="/minha-conta" style={linkStyle}>Minha Conta</Link>
            )}

            <span style={{ color: "white", opacity: 0.8 }}>
              Olá, {user?.username || user?.name || "Utilizador"}!
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
