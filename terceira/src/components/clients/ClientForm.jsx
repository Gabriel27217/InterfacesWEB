import React, { useState, useEffect } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useClients } from "../../hooks/useClients";

export default function ClientForm({ editingClient, onFinish }) {
  const { addClient, updateClient } = useClients();

  const [client, setClient] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    if (editingClient) setClient(editingClient);
  }, [editingClient]);

  function handleChange(field, value) {
    setClient((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingClient) {
      await updateClient(editingClient.id, client);
    } else {
      await addClient(client);
    }

    onFinish();
  }

  return (
    <Card>
      <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
        {editingClient ? "Editar Cliente" : "Adicionar Cliente"}
      </h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          value={client.nome}
          onChange={(v) => handleChange("nome", v)}
          required
        />

        <Input
          label="Email"
          type="email"
          value={client.email}
          onChange={(v) => handleChange("email", v)}
          required
        />

        <Input
          label="Telefone"
          value={client.telefone}
          onChange={(v) => handleChange("telefone", v)}
          required
        />

        <Button type="submit" variant="primary" style={{ width: "100%" }}>
          {editingClient ? "Guardar Alterações" : "Adicionar Cliente"}
        </Button>
      </form>
    </Card>
  );
}
