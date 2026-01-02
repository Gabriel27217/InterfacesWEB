// Importação do React
import React from "react";

// Importação de um componente Card reutilizável para estilo de caixa
import Card from "../../components/ui/Card";

// Componente funcional About
// Exibe informações sobre a empresa
export default function About() {
  return (
    <div>
      {/* Título da página */}
      <h1>Sobre Nós</h1>

      {/* Card que envolve o conteúdo textual */}
      <Card>
        {/* Primeiro parágrafo sobre a missão e especialização da empresa */}
        <p>
          A AutoVital é uma empresa especializada na venda de veículos usados e 
          seminovos. Trabalhamos com transparência e compromisso com o cliente.
        </p>

        {/* Segundo parágrafo sobre história e valores da empresa */}
        <p style={{ marginTop: "1rem" }}>
          Fundada em 2020, crescemos rapidamente devido ao nosso foco em 
          qualidade, confiança e preços competitivos.
        </p>
      </Card>
    </div>
  );
}