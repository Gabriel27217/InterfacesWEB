import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // ou onde estiver o teu hook
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input"; // Ajusta caminhos
import Button from "../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    setLoading(true);
    
    // Chama a função register do contexto
    const result = await register({
      nome: formData.nome,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate("/minha-conta"); // Redireciona para área de cliente
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "12px", backgroundColor: "white" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Criar Conta</h2>
      
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

        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

        <Button type="submit" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
          {loading ? "A criar..." : "Registar"}
        </Button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}
