// Importação do React e hooks
import React, { useState } from "react";

// Importação do hook personalizado de autenticação
import { useAuth } from "../../hooks/useAuth";

// Importação de hooks/componentes do React Router para navegação e links
import { useNavigate, Link } from "react-router-dom";

// Importação de componentes reutilizáveis da UI
import Input from "../ui/Input";
import Button from "../ui/Button";

// Componente principal de Login
export default function Login() {
  // Pega a função de login do contexto
  const { login } = useAuth();

  // Hook do react-router-dom para redirecionamento após login [web:192]
  const navigate = useNavigate();

  // =========================
  //      ESTADOS DO FORM
  // =========================

  // Armazena o email
  const [email, setEmail] = useState("");

  // Armazena a password
  const [password, setPassword] = useState("");

  // Armazena mensagens de erro
  const [error, setError] = useState("");

  // Indica se o login está em progresso (para desativar botão)
  const [loading, setLoading] = useState(false);

  // =========================
  //     SUBMETER FORMULÁRIO
  // =========================

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    // Evita recarregar a página ao submeter o form
    e.preventDefault();

    // Limpa erros anteriores e ativa loading
    setError("");
    setLoading(true);

    // Chama a função de login do contexto
    const result = await login(email, password);

    if (result.success) {
      // Se login OK, redireciona conforme role do utilizador
      if (result.role === "admin") {
        navigate("/gerir"); // Admin vai para o Backoffice
      } else {
        navigate("/minha-conta"); // Cliente vai para área pessoal
      }
    } else {
      // Se falhar, mostra a mensagem de erro e desativa loading
      setError(result.message);
      setLoading(false);
    }
  };

  // =========================
  //        RENDERIZAÇÃO
  // =========================
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "4rem auto", // Centraliza vertical e horizontalmente
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Sombra leve
        backgroundColor: "white",
      }}
    >
      {/* Título e subtítulo */}
      <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#333" }}>
        Bem-vindo
      </h2>

      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
        Entre na sua conta AutoVital
      </p>

      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
        {/* Campo de email */}
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target ? e.target.value : e)}
          type="email"
          placeholder="exemplo@email.com"
          required
        />

        {/* Campo de password */}
        <Input
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target ? e.target.value : e)}
          type="password"
          placeholder="******"
          required
        />

        {/* Mensagem de erro */}
        {error && (
          <div
            style={{
              backgroundColor: "#ffebee", // Fundo vermelho claro
              color: "#c62828", // Texto vermelho escuro
              padding: "0.8rem",
              borderRadius: "6px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Botão de submit */}
        <div style={{ marginTop: "1.5rem" }}>
          <Button type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "A entrar..." : "Entrar"} {/* Texto muda se estiver a carregar */}
          </Button>
        </div>
      </form>

      {/* Link para página de registo */}
      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#888",
        }}
      >
        <p>
          Ainda não tem conta? <br />
          <Link
            to="/registar"
            style={{
              color: "#dc2626",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Registe-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
