// Importação do React e hooks necessários
import React, { useState, useEffect } from "react";

// Importação de componentes reutilizáveis da UI
import Card from "../ui/Card"; // Componente visual de cartão (wrapper do formulário)
import Input from "../ui/Input"; // Componente de input estilizado
import Button from "../ui/Button"; // Componente de botão estilizado

// Importação do hook que dá acesso ao ClientsContext
import { useClients } from "../../hooks/useClients";

// ClientForm recebe duas props:
// - editingClient → objeto do cliente que está a ser editado (ou null se for novo cliente)
// - onFinish → função callback que é chamada após adicionar/atualizar ou cancelar edição
export default function ClientForm({ editingClient, onFinish }) {
  // Métodos do contexto (CRUD de clientes)
  const { addClient, updateClient } = useClients();

  // =========================
  //        ESTADO LOCAL
  // =========================

  // Estado local para controlar os campos do formulário
  const [client, setClient] = useState({
    nome: "",
    email: "",
    telefone: "",
    numeroCliente: "",
    historicoCarros: "",
  });

  // =========================
  //   PREENCHER AO EDITAR
  // =========================

  // Sempre que o editingClient muda:
  // - se existir, preenche o formulário com os dados do cliente
  // - se não existir, limpa o formulário (modo "novo cliente")
  useEffect(() => {
    if (editingClient) {
      // Normaliza campos (alguns dados podem vir com Nome/Email/Telefone)
      setClient({
        nome: editingClient.nome || editingClient.Nome || "",
        email: editingClient.email || editingClient.Email || "",
        telefone: editingClient.telefone || editingClient.Telefone || "",
        numeroCliente: editingClient.numeroCliente || "",
        historicoCarros: editingClient.historicoCarros || "",
      });
    } else {
      // Reset do formulário
      setClient({
        nome: "",
        email: "",
        telefone: "",
        numeroCliente: "",
        historicoCarros: "",
      });
    }
  }, [editingClient]);

  // =========================
  //      HANDLERS FORM
  // =========================

  // Atualiza o estado local conforme os campos são alterados (controlled inputs)
  function handleChange(field, value) {
    setClient((prev) => ({ ...prev, [field]: value }));
  }

  // Submete o formulário (adiciona ou atualiza)
  async function handleSubmit(e) {
    // Evita o refresh da página ao submeter um form [web:182]
    e.preventDefault();

    if (editingClient) {
      // Atualiza cliente existente
      await updateClient(editingClient.id, client);
    } else {
      // Adiciona novo cliente
      await addClient(client);
    }

    // Callback após concluir (limpa edição/fecha formulário)
    if (onFinish) onFinish();
  }

  // =========================
  //       RENDERIZAÇÃO
  // =========================
  return (
    <Card>
      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        {/* Título do formulário */}
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

        {/* Campo extra (opcional) */}
        <Input
          label="Número de Cliente"
          name="numeroCliente"
          value={client.numeroCliente}
          onChange={(e) => handleChange("numeroCliente", e.target.value)}
        />

        {/* Campo extra (opcional) */}
        <Input
          label="Histórico de Carros"
          name="historicoCarros"
          value={client.historicoCarros}
          onChange={(e) => handleChange("historicoCarros", e.target.value)}
          placeholder="Ex: Corolla 2020; Civic 2023"
        />

        {/* Botões de ação */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          {/* Botão de submissão */}
          <Button type="submit">
            {editingClient ? "Guardar Alterações" : "Adicionar Cliente"}
          </Button>

          {/* Botão de cancelar (só aparece em modo de edição) */}
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
