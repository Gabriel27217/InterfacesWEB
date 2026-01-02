import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "white",                          // Fundo branco
        padding: "1rem",                              // Espaçamento interno
        borderRadius: "8px",                          // Bordas arredondadas
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",      // Sombra suave para dar profundidade
        marginBottom: "1rem",                         // Espaço inferior entre cards
        ...style,                                     // Permite sobrescrever ou adicionar estilos via prop
      }}
    >
      {children}                                      {/* Conteúdo interno do card */}
    </div>
  );
}