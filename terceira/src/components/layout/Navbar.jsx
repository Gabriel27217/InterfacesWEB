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

        {isLoggedIn && (
          <Link to="/gerir" style={linkStyle}>
            Backoffice
          </Link>
        )}

        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login")}
            style={{ ...button, background: "rgba(255,255,255,0.2)" }}
          >
            Login
          </button>
        )}

        {isLoggedIn && (
          <>
            <span style={{ color: "white", opacity: 0.8 }}>
              Olá, {user.username}!
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
