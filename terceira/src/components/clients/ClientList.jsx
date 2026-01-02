// src/components/clients/ClientList.jsx

// Importação do React e hooks necessários
import React, { useContext, useState } from "react";

// Importação do contexto dos clientes
import { ClientsContext } from "../../context/ClientsContext";

// Importação do componente de botão estilizado
import Button from "../ui/Button";

// Importação do hook de autenticação (para validar permissões)
import { useAuth } from "../../hooks/useAuth";

// Importação do formulário de clientes (para editar)
import ClientForm from "./ClientForm";

// ClientList mostra uma tabela com todos os clientes
export default function ClientList() {
  // Obtemos dados do contexto
  const { clients, loading, deleteClient } = useContext(ClientsContext);

  // Obtemos o utilizador atual para saber se é admin
  const { isLoggedIn, user } = useAuth();

  // Verifica se o utilizador é admin
  const isAdmin = isLoggedIn && user && user.role === "admin";

  // Estado local para guardar o cliente que está a ser editado
  const [editingClient, setEditingClient] = useState(null);

  // =========================
  //        FUNÇÃO DELETE
  // =========================

  // Função para apagar cliente
  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que quer apagar este cliente?")) {
      await deleteClient(id); // Chama a função do contexto
    }
  };

  // =========================
  //     FINALIZAR EDIÇÃO
  // =========================

  // Função chamada quando acaba a edição (ou cancelar)
  const handleFinishEdit = () => {
    setEditingClient(null);
  };

  // =========================
  //          LOADING
  // =========================

  // Caso os dados ainda estejam a carregar
  if (loading) {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>
        A carregar clientes...
      </p>
    );
  }

  // =========================
  //        RENDERIZAÇÃO
  // =========================
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Cabeçalho da lista */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2>Lista de Clientes</h2>
      </div>

      {/* Formulário de edição (só aparece para admin quando há cliente selecionado) */}
      {editingClient && isAdmin && (
        <div style={{ marginBottom: "2rem" }}>
          <ClientForm editingClient={editingClient} onFinish={handleFinishEdit} />
        </div>
      )}

      {/* Mensagem se não houver clientes */}
      {clients.length === 0 ? (
        <p>Não existem clientes registados.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          {/* Tabela de clientes */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "600px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
                  Nome
                </th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
                  Email
                </th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
                  Telefone
                </th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{client.nome || client.Nome}</td>
                  <td style={{ padding: "12px" }}>{client.email || client.Email}</td>
                  <td style={{ padding: "12px" }}>
                    {client.telefone || client.Telefone}
                  </td>

                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* Botão Editar (só aparece se for admin) */}
                      {isAdmin && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => setEditingClient(client)}
                        >
                          Editar
                        </Button>
                      )}

                      {/* Botão Apagar */}
                      <Button
                        variant="danger"
                        size="small"
                        style={{ backgroundColor: "#dc3545", color: "white" }}
                        onClick={() => handleDelete(client.id)}
                      >
                        Apagar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
