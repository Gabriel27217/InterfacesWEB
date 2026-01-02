// Importação do React e dos hooks necessários
import React, { createContext, useState, useEffect } from "react";

// Importação dos clientes iniciais (simulação de base de dados local)
import { clientesIniciais } from "../db";

// Criação do Contexto dos Clientes
export const ClientsContext = createContext();

// URL da API (comentada para possível utilização futura)
// const DEFAULT_API = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/clientes";

// URL da API nova (Sheety)
// API antiga (comentada)
// const DEFAULT_API = "https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/clientes";
const DEFAULT_API =
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/clientes";

export function ClientsProvider({ children }) {
  // Estado que guarda a lista de clientes
  const [clients, setClients] = useState([]);

  // Estado que indica se os dados ainda estão a ser carregados
  const [loading, setLoading] = useState(true);

  // Estado para guardar mensagens de erro
  const [error, setError] = useState(null);

  // useEffect executado uma única vez quando o componente é montado
  useEffect(() => {
    // -------- CARREGAMENTO LOCAL (ATUAL) --------
    // Inicializa a lista de clientes com dados locais
    setClients(clientesIniciais);
    setLoading(false);

    /*
    // -------- CARREGAMENTO VIA API (FUTURO) --------
    // Exemplo de como carregar os clientes a partir da API (Sheety)
    fetch(DEFAULT_API)
      .then((res) => res.json())
      .then((data) => {
        // O Sheety devolve os registos dentro do array com o nome da sheet (ex.: data.clientes) [web:9]
        setClients(data.clientes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro API");
        setLoading(false);
      });
    */
  }, []);

  // =========================
  //     MÉTODOS SIMULADOS
  // =========================

  // Função para adicionar um novo cliente
  async function addClient(client) {
    try {
      // Cria um novo cliente com ID temporário
      const newClient = { ...client, id: Date.now() };

      // Atualiza a lista de clientes
      setClients((prev) => [...prev, newClient]);

      return { ok: true };
    } catch (err) {
      // Guarda mensagem de erro
      setError("Erro ao criar cliente");
      return { ok: false, message: err.message };
    }
  }

  // Função para atualizar os dados de um cliente existente
  async function updateClient(id, updatedData) {
    try {
      // Atualiza apenas o cliente com o ID correspondente
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
      );

      return { ok: true };
    } catch (err) {
      // Guarda mensagem de erro
      setError("Erro ao atualizar");
      return { ok: false, message: err.message };
    }
  }

  // Função para apagar um cliente
  async function deleteClient(id) {
    try {
      // Remove o cliente com o ID indicado
      setClients((prev) => prev.filter((c) => c.id !== id));

      return { ok: true };
    } catch (err) {
      // Guarda mensagem de erro
      setError("Erro ao apagar");
      return { ok: false, message: err.message };
    }
  }

  // Objeto com os dados e métodos disponibilizados pelo contexto
  const value = {
    clients, // Lista de clientes
    loading, // Estado de carregamento
    error, // Mensagem de erro
    addClient, // Função para adicionar cliente
    updateClient, // Função para atualizar cliente
    deleteClient, // Função para apagar cliente
  };

  // Provider que disponibiliza o contexto aos componentes filhos
  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}
