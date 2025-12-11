import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "white",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "1rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
