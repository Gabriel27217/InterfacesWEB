import React from "react";

export default function Input({
  label,
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
