import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function ClientArea() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user || user.role !== "client") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Acesso Restrito</h2>
        <p>Faça login como cliente para ver esta página.</p>
        <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>Ir para Login</Link>
      </div>
    );
  }

  const { dados } = user;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ color: "#333" }}>Olá, {user.name}!</h1>
      <p style={{ fontSize: "1.1rem", color: "#666" }}>Bem-vindo à sua área pessoal AutoVital.</p>

      <div style={{ display: "grid", gap: "2rem", marginTop: "2rem", gridTemplateColumns: "1fr 1fr" }}>
        
        {/* CARTÃO HISTÓRICO */}
        <div style={{ 
          border: "1px solid #e0e0e0", 
          padding: "1.5rem", 
          borderRadius: "12px", 
          backgroundColor: "#f8f9fa",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ borderBottom: "2px solid #6200ea", paddingBottom: "0.5rem", marginTop: 0 }}>
            📜 Histórico de Compra
          </h3>
          
          {dados.carroComprado ? (
            <div style={{ marginTop: "1rem" }}>
              <p><strong>Veículo:</strong> <br/>{dados.carroComprado}</p>
              <p><strong>Data:</strong> <br/>{dados.dataCompra || "Data não registada"}</p>
              <p><strong>Estado:</strong> <br/>{dados.notas || "Processo concluído"}</p>
            </div>
          ) : (
            <p style={{ color: "#888", fontStyle: "italic", marginTop: "1rem" }}>
              Ainda não tem registo de compras ativo.
            </p>
          )}
        </div>

        {/* CARTÃO CONTACTO */}
        <div style={{ 
          border: "1px solid #e0e0e0", 
          padding: "1.5rem", 
          borderRadius: "12px", 
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ borderBottom: "2px solid #25D366", paddingBottom: "0.5rem", marginTop: 0 }}>
             Suporte ao Cliente
          </h3>
          <p>Os nossos vendedores estão disponíveis:</p>
          
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>📧 <strong>Email:</strong> suporte@autovital.com</li>
          </ul>

          {/* Botão para o Vendedor 1 */}
          <button 
            style={{ 
              width: "100%",
              padding: "0.8rem", 
              marginBottom: "0.8rem",
              background: "#25D366", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onClick={() => window.open("https://wa.me/351906442304", "_blank")}
          >
            <span>WhatsApp Vendedor 1</span>
            <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>(906 442 304)</span>
          </button>

          {/* Botão para o Vendedor 2 */}
          <button 
            style={{ 
              width: "100%",
              padding: "0.8rem", 
              background: "#128C7E", // Verde ligeiramente diferente
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onClick={() => window.open("https://wa.me/351915430525", "_blank")}
          >
            <span>WhatsApp Vendedor 2</span>
            <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>(915 430 525)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
