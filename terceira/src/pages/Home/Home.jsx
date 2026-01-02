// Importação do React
import React from "react";

// Importação de componentes reutilizáveis
import Button from "../../components/ui/Button"; // Botão estilizado
import Card from "../../components/ui/Card";     // Card para destacar conteúdo
import { Link } from "react-router-dom";         // Link para navegação entre páginas

// Componente funcional Home
export default function Home() {
  return (
    <div>
      {/* Título principal da página */}
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Bem-vindo à AutoVital 🚗
      </h1>

      {/* Subtítulo ou descrição curta */}
      <p style={{ marginBottom: "2rem", fontSize: "1.1rem", opacity: 0.8 }}>
        A melhor seleção de carros usados e seminovos ao melhor preço.
      </p>

      {/* Botão para ir à página da loja */}
      <Link to="/loja">
        <Button variant="primary">Explorar Carros</Button>
      </Link>

      {/* Seção com destaque de benefícios em um Card */}
      <div style={{ marginTop: "3rem" }}>
        <Card>
          <h2>Porquê comprar connosco?</h2>
          <ul style={{ marginTop: "1rem", lineHeight: "1.7rem" }}>
            <li>✔ Garantia de qualidade</li>
            <li>✔ Inspeção completa antes da venda</li>
            <li>✔ Atendimento personalizado</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}