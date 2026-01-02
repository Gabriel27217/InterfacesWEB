import React from "react";

// Componente Select customizado
export default function Select({ label, value, onChange, options = [], required = false }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      
      {/* Label do select */}
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          {label}
        </label>
      )}
      
      {/* Elemento select */}
      <select
        value={value}                     // Valor selecionado controlado pelo estado pai
        onChange={(e) => onChange(e.target.value)} // Atualiza valor no estado pai
        required={required}               // Define se é obrigatório
        style={{ width: "100%", padding: "0.5rem" }} // Estilo simples
      >
        {/* Opção padrão */}
        <option value="">Selecione...</option>
        
        {/* Renderiza todas as opções */}
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}