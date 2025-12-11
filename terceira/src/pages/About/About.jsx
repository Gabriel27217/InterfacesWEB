import React from "react";
import Card from "../../components/ui/Card";

export default function About() {
  return (
    <div>
      <h1>Sobre Nós</h1>

      <Card>
        <p>
          A AutoVital é uma empresa especializada na venda de veículos usados e 
          seminovos. Trabalhamos com transparência e compromisso com o cliente.
        </p>

        <p style={{ marginTop: "1rem" }}>
          Fundada em 2020, crescemos rapidamente devido ao nosso foco em 
          qualidade, confiança e preços competitivos.
        </p>
      </Card>
    </div>
  );
}
