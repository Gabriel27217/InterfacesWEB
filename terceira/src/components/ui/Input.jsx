// Importa React
import React from "react";

// Componente Input reutilizável
// Props:
// - label → texto a aparecer acima do input
// - name → nome/id do input (útil para formulários com vários campos + acessibilidade)
// - value → valor do input (controlled input)
// - onChange → função chamada quando o utilizador altera o valor
// - type → tipo do input (text, email, password, number, etc.)
// - placeholder → texto placeholder
// - required → se o campo é obrigatório
// - style → estilos extra para sobrescrever o padrão
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
      {/* Se houver label, mostra */}
      {label && (
        <label
          htmlFor={name} // Liga a label ao input através do id (melhora acessibilidade) [web:379]
          style={{
            display: "block", // Label ocupa linha inteira
            marginBottom: "0.5rem", // Espaço entre label e input
            fontWeight: 500, // Peso da fonte
          }}
        >
          {label} {/* Texto da label */}
        </label>
      )}

      <input
        id={name} // Id usado pelo htmlFor da label
        name={name} // Name útil para formulários (ex.: e.target.name)
        value={value} // Valor controlado (controlled input)
        // MODO DUAL:
        // - Se passares "name" (ex.: Register/Login), envia o EVENTO (para usar e.target.name)
        // - Se NÃO passares "name" (ex.: CarForm/ClientForm antigos), envia só o VALOR
        onChange={(e) => {
          // Segurança: evita erro se onChange não for função
          if (typeof onChange !== "function") return;

          if (name) {
            // Para formulários que usam handleChange genérico baseado no name
            onChange(e);
          } else {
            // Para formulários simples que só querem o valor diretamente
            onChange(e.target.value);
          }
        }}
        type={type} // Tipo do input
        placeholder={placeholder} // Placeholder do input
        required={required} // Campo obrigatório se true
        style={{
          width: "100%", // Ocupa toda a largura do container
          padding: "0.75rem", // Espaçamento interno
          border: "1px solid #ddd", // Borda cinza clara
          borderRadius: "4px", // Bordas levemente arredondadas
          fontSize: "1rem", // Tamanho da fonte
          outline: "none", // Remove outline padrão
          transition: "0.2s", // Suaviza mudanças de estilo (ex: foco)
          ...style, // Permite sobrescrever estilos via prop
        }}
      />
    </div>
  );
}
