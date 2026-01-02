// Importação do React e hooks necessários
import React, { useState } from "react";

// Importação do hook de autenticação (para chamar o register)
import { useAuth } from "../hooks/useAuth";

// React Router para navegação e link para login
import { useNavigate, Link } from "react-router-dom";

// Importação dos componentes UI
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

// Componente funcional Register
export default function Register() {
  // Acede à função register do contexto de autenticação
  const { register } = useAuth();

  // Hook para navegação programática
  const navigate = useNavigate();

  // =========================
  //          ESTADOS
  // =========================

  // Estado do formulário (controlled inputs)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado para guardar mensagem de erro (validação/API)
  const [error, setError] = useState("");

  // Estado para indicar envio em progresso (desativar botão)
  const [loading, setLoading] = useState(false);

  // =========================
  //      HANDLERS DO FORM
  // =========================

  // Atualiza o estado conforme o utilizador escreve nos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    // Evita o comportamento default do form (recarregar página) [web:177]
    e.preventDefault();

    // Limpa erro anterior
    setError("");

    // Validação simples: confirmar passwords
    if (formData.password !== formData.confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    // Ativa loading
    setLoading(true);

    // Chama a função register do contexto
    const result = await register({
      nome: formData.nome,
      email: formData.email,
      password: formData.password,
    });

    // Se registou com sucesso, redireciona para área de cliente
    if (result.success) {
      navigate("/minha-conta");
      return;
    }

    // Se falhou, mostra erro e desativa loading
    setError(result.message);
    setLoading(false);
  };

  // =========================
  //       RENDERIZAÇÃO
  // =========================
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "4rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>Criar Conta</h2>

      {/* Formulário de registo */}
      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <Input
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirmar Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Mensagem de erro */}
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

        {/* Botão de submissão */}
        <Button
          type="submit"
          style={{ width: "100%", marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "A criar..." : "Registar"}
        </Button>
      </form>

      {/* Link para login */}
      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}
