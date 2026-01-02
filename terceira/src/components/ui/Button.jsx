import React from "react";
import PropTypes from "prop-types"; // Para validação de tipos das props (opcional, mas recomendado)

export default function Button({
  children,      // Conteúdo interno do botão (texto, ícone, etc.)
  onClick,       // Função chamada quando o botão é clicado
  type = "button",  // Tipo do botão (button, submit, reset), padrão: "button"
  variant = "primary", // Estilo do botão, padrão: "primary"
  disabled = false,    // Se true, o botão fica desativado
  style,         // Estilo customizado que pode ser passado por props
}) {

  // Definição de estilos pré-definidos para cada variante
  const colors = {
    primary: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // gradiente roxo-azul
      color: "white",
    },
    secondary: {
      background: "#e0e0e0", // cinza claro
      color: "#333",
    },
    danger: {
      background: "#dc3545", // vermelho
      color: "white",
    },
  };

  return (
    <button
      type={type}          // Define o tipo do botão (button, submit, reset)
      disabled={disabled}  // Define se o botão está desativado
      onClick={onClick}    // Função executada ao clicar
      style={{
        padding: "0.75rem 1.2rem",        // Espaçamento interno
        borderRadius: "6px",              // Bordas arredondadas
        border: "none",                   // Sem borda
        cursor: disabled ? "not-allowed" : "pointer", // Cursor muda se estiver desativado
        fontWeight: 600,                  // Negrito
        opacity: disabled ? 0.6 : 1,      // Botão "esmaecido" se desativado
        transition: "0.2s",               // Transição suave para hover/estado desativado
        ...colors[variant],               // Aplica cores de acordo com a variante (primary, secondary, danger)
        ...style,                         // Sobrescreve qualquer estilo customizado passado via prop
      }}
    >
      {children}        {/* Conteúdo do botão */}
    </button>
  );
}