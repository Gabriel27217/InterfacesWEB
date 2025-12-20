import React from "react";

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  style,
}) {
  return (
    <div style={{ marginBottom: "1rem", width: "100%" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        value={value}
        //  MODO DUAL:
        // - Se passares "name" (Register/Login), manda o EVENTO (para usar e.target.name)
        // - Se NÃO passares "name" (CarForm/ClientForm antigos), manda só o VALOR
        onChange={(e) => {
          if (typeof onChange !== "function") return;

          if (name) {
            onChange(e); // Register.jsx / Login.jsx
          } else {
            onChange(e.target.value); // CarForm.jsx / ClientForm.jsx
          }
        }}
        type={type}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "0.75rem",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "1rem",
          outline: "none",
          transition: "0.2s",
          ...style,
        }}
      />
    </div>
  );
}
