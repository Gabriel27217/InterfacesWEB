// Importação do hook useContext do React
import { useContext } from "react";

// Importação do contexto responsável pela gestão dos clientes
import { ClientsContext } from "../context/ClientsContext";

// Hook personalizado para facilitar o acesso ao ClientsContext
export function useClients() {

  // devolve todos os dados e métodos disponibilizados pelo ClientsContext
  // (clients, loading, error, addClient, updateClient, deleteClient, etc.)
  return useContext(ClientsContext);
}