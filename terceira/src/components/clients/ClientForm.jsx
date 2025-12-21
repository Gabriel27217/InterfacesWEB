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
    numeroCliente: "",
    historicoCarros: "",
  });

  useEffect(() => {
    if (editingClient) {
      setClient({
        nome: editingClient.nome || editingClient.Nome || "",
        email: editingClient.email || editingClient.Email || "",
        telefone: editingClient.telefone || editingClient.Telefone || "",
        numeroCliente: editingClient.numeroCliente || "",
        historicoCarros: editingClient.historicoCarros || "",
      });
    } else {
      setClient({
        nome: "",
        email: "",
        telefone: "",
        numeroCliente: "",
        historicoCarros: "",
      });
    }
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

    if (onFinish) onFinish();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h3>{editingClient ? "Editar Cliente" : "Adicionar Cliente"}</h3>

        <Input
          label="Nome"
          name="nome"
          value={client.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          required
        />

        <Input
          label="Email"
          name="email"
          value={client.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />

        <Input
          label="Telefone"
          name="telefone"
          value={client.telefone}
          onChange={(e) => handleChange("telefone", e.target.value)}
          required
        />

        <Input
          label="Número de Cliente"
          name="numeroCliente"
          value={client.numeroCliente}
          onChange={(e) => handleChange("numeroCliente", e.target.value)}
        />

        <Input
          label="Histórico de Carros"
          name="historicoCarros"
          value={client.historicoCarros}
          onChange={(e) => handleChange("historicoCarros", e.target.value)}
          placeholder="Ex: Corolla 2020; Civic 2023"
        />

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <Button type="submit">
            {editingClient ? "Guardar Alterações" : "Adicionar Cliente"}
          </Button>

          {editingClient && (
            <Button
              type="button"
              style={{ backgroundColor: "#6c757d" }}
              onClick={onFinish}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
