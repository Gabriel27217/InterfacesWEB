import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function ClientCard({ client, onEdit, onDelete }) {
  const { isLoggedIn } = useAuth();

  return (
    <Card>
      <h3 style={{ marginBottom: "0.5rem" }}>{client.nome}</h3>
      <p>Email: <b>{client.email}</b></p>
      <p>Telefone: <b>{client.telefone}</b></p>

      {isLoggedIn && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <Button variant="secondary" onClick={() => onEdit(client)}>
            Editar
          </Button>

          <Button variant="danger" onClick={() => onDelete(client.id)}>
            Apagar
          </Button>
        </div>
      )}
    </Card>
  );
}
