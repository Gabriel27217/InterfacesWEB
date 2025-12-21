import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function ClientCard({ client, onEdit, onDelete }) {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = isLoggedIn && user && user.role === "admin";

  const nome = client.nome || client.Nome;
  const email = client.email || client.Email;
  const telefone = client.telefone || client.Telefone;

  return (
    <Card>
      <h3 style={{ marginBottom: "0.5rem" }}>{nome}</h3>
      <p>
        Email: <b>{email}</b>
      </p>
      <p>
        Telefone: <b>{telefone}</b>
      </p>

      {/* Se já tiveres número de cliente / histórico, podes mostrar aqui */}
      {client.numeroCliente && (
        <p>
          Nº Cliente: <b>{client.numeroCliente}</b>
        </p>
      )}
      {client.historicoCarros && (
        <p>
          Histórico: <b>{client.historicoCarros}</b>
        </p>
      )}

      {isAdmin && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          {onEdit && (
            <Button variant="secondary" onClick={() => onEdit(client)}>
              Editar
            </Button>
          )}

          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(client.id)}>
              Apagar
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}


