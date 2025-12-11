import React from "react";

export default function Footer() {
  return (
    <footer style={{ 
      marginTop: "auto", // Garante que fica no fundo
      padding: "2rem", 
      textAlign: "center", 
      background: "#222", 
      color: "#eee", 
      fontSize: "0.9rem" 
    }}>
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>AutoVital</p>
        <p>Contacto: 906 442 304 | 915 430 525</p>
        <p>Email: suporte@autovital.com</p>
      </div>
      
      <p style={{ opacity: 0.6, fontSize: "0.8rem" }}>
        &copy; {new Date().getFullYear()} AutoVital. Todos os direitos reservados.
      </p>
    </footer>
  );
}
