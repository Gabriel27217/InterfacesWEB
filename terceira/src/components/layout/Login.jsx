import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (result.role === "admin") {
        navigate("/gerir");
      } else {
        navigate("/minha-conta");
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "4rem auto", 
      padding: "2rem", 
      border: "1px solid #ddd", 
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "white"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#333" }}>Bem-vindo</h2>
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
        Entre na sua conta AutoVital
      </p>
      
      <form onSubmit={handleSubmit}>
        <Input 
          label="Email" 
          value={email} 
          // CORREÇÃO AQUI: Verifica se é evento ou valor direto
          onChange={(e) => setEmail(e.target ? e.target.value : e)} 
          type="email"
          placeholder="exemplo@email.com"
          required 
        />
        
        <Input 
          label="Password" 
          value={password} 
          // CORREÇÃO AQUI TAMBÉM
          onChange={(e) => setPassword(e.target ? e.target.value : e)} 
          type="password"
          placeholder="******"
          required 
        />
        
        {error && (
          <div style={{ 
            backgroundColor: "#ffebee", 
            color: "#c62828", 
            padding: "0.8rem", 
            borderRadius: "6px",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginTop: "1.5rem" }}>
          <Button type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </div>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "#888" }}>
        <p>Acesso Admin: admin@autovital.com</p>
        <p>Acesso Cliente: Use o email registado no stand</p>
      </div>
    </div>
  );
}
