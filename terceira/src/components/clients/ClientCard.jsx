// Importa React
import React from "react";

// Importa componentes reutilizáveis da UI
import Card from "../ui/Card"; // Componente visual de cartão
import Button from "../ui/Button"; // Botões estilizados

// Importa o hook de autenticação (para saber se está logado e qual a role)
import { useAuth } from "../../hooks/useAuth";

// ClientCard recebe:
// - client → objeto do cliente { id, nome, email, telefone, ... }
// - onEdit → função para editar o cliente
// - onDelete → função para apagar o cliente
export default function ClientCard({ client, onEdit, onDelete }) {
  // Acesso ao estado de autenticação
  const { isLoggedIn, user } = useAuth();

  // Verifica se o utilizador é admin (só admin pode editar/apagar)
  const isAdmin = isLoggedIn && user && user.role === "admin";

  // =========================
  //   NORMALIZAÇÃO DE DADOS
  // =========================
  // Alguns registos podem vir com chaves diferentes (ex.: Nome vs nome),
  // então fazemos fallback para evitar undefined
  const nome = client.nome || client.Nome;
  const email = client.email || client.Email;
  const telefone = client.telefone || client.Telefone;

  return (
    <Card>
      {/* Nome do cliente */}
      <h3 style={{ marginBottom: "0.5rem" }}>{nome}</h3>

      {/* Informações do cliente */}
      <p>
        Email: <b>{email}</b>
      </p>
      <p>
        Telefone: <b>{telefone}</b>
      </p>

      {/* Extras opcionais (se existirem no objeto) */}
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

      {/* Botões de ação (Editar/Apagar) */}
      {/* Só aparecem se o utilizador for admin */}
      {isAdmin && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          {/* Botão para editar cliente (só chama se existir onEdit) */}
          {onEdit && (
            <Button variant="secondary" onClick={() => onEdit(client)}>
              Editar
            </Button>
          )}

          {/* Botão para apagar cliente (só chama se existir onDelete) */}
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
