import React from "react";

// Componente Footer: exibe informações de contato e direitos da empresa
export default function Footer() {
  return (
    <footer style={{ 
      marginTop: "auto",   // Garante que o footer fique sempre na parte inferior da página
      padding: "2rem",     // Espaçamento interno
      textAlign: "center", // Centraliza o conteúdo
      background: "#222",  // Cor de fundo escura
      color: "#eee",       // Cor do texto clara para contraste
      fontSize: "0.9rem"   // Tamanho da fonte
    }}>
      
      {/* Seção de informações principais */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          AutoVital
        </p>
        <p>Contacto: 916 442 304 | 915 430 525</p>
        <p>Email: suporte@autovital.com</p>
      </div>
      
      {/* Direitos reservados */}
      <p style={{ opacity: 0.6, fontSize: "0.8rem" }}>
        &copy; {new Date().getFullYear()} AutoVital. Todos os direitos reservados.
      </p>
    </footer>
  );
}