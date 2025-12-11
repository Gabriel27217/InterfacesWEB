import React, { useContext } from "react";
import { ClientsContext } from "../../context/ClientsContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button"; // Certifica-te que tens este componente

export default function ClientList() {
  const { clients, loading, deleteClient } = useContext(ClientsContext);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que quer apagar este cliente?")) {
      await deleteClient(id);
    }
  };

  if (loading) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>A carregar clientes...</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Lista de Clientes</h2>
        <Link to="/clientes/novo">
          <Button>+ Novo Cliente</Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <p>Não existem clientes registados.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Nome</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Email</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Telefone</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{client.nome || client.Nome}</td>
                  <td style={{ padding: "12px" }}>{client.email || client.Email}</td>
                  <td style={{ padding: "12px" }}>{client.telefone || client.Telefone}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => navigate(`/clientes/editar/${client.id}`)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" // Se não tiveres variant danger, usa style={{ background: "red" }}
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
