import React, { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useCars } from "../../hooks/useCars";

export default function BrandForm() {
  const { brands, addBrand } = useCars();
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Verificar duplicados
    if (brands.some((b) => b.nome.toLowerCase() === brandName.toLowerCase())) {
      setError("Esta marca já existe.");
      return;
    }

    if (!brandName.trim()) {
      setError("Introduz um nome de marca.");
      return;
    }

    addBrand({ nome: brandName }); // CarsContext trata de guardar
    setBrandName("");
    setError("");
  }

  return (
    <Card>
      <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
        Adicionar Marca
      </h2>

      {error && (
        <div
          style={{
            background: "#fee",
            padding: "0.75rem",
            borderLeft: "4px solid #c33",
            color: "#c33",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nome da marca"
          value={brandName}
          onChange={setBrandName}
          required
        />

        <Button type="submit" variant="primary" style={{ width: "100%" }}>
          Adicionar Marca
        </Button>
      </form>

      <div style={{ marginTop: "1rem", opacity: 0.7, fontSize: "0.9rem" }}>
        Marcas atuais: {brands.map((b) => b.nome).join(", ") || "Nenhuma"}
      </div>
    </Card>
  );
}
