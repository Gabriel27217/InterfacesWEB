import React from "react";
import PropTypes from "prop-types";


export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style,
}) {
  const colors = {
    primary: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
    },
    secondary: {
      background: "#e0e0e0",
      color: "#333",
    },
    danger: {
      background: "#dc3545",
      color: "white",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "0.75rem 1.2rem",
        borderRadius: "6px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
        transition: "0.2s",
        ...colors[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
