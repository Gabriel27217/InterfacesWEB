// src/components/ui/Select.jsx
import React from "react";

export default function Select({ label, value, onChange, options = [], required = false }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", marginBottom: "0.5rem" }}>{label}</label>}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ width: "100%", padding: "0.5rem" }}
      >
        <option value="">Selecione...</option>
        
        {/* AQUI ESTAVA O PROBLEMA DO KEY */}
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
