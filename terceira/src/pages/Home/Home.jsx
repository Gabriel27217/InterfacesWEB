import React from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Bem-vindo à AutoVital 🚗
      </h1>

      <p style={{ marginBottom: "2rem", fontSize: "1.1rem", opacity: 0.8 }}>
        A melhor seleção de carros usados e seminovos ao melhor preço.
      </p>

      <Link to="/loja">
        <Button variant="primary">Explorar Carros</Button>
      </Link>

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
