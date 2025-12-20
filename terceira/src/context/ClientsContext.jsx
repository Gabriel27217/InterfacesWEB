import React, { createContext, useState, useEffect } from "react";
// Importação direta do ficheiro local
import { clientesIniciais } from "../db";

export const ClientsContext = createContext();

// (LINK DA API ( PARA USO FUTURO)
// const DEFAULT_API = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/clientes";

 const DEFAULT_API = "https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/clientes"; //NOVA API por causa dos requests

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carregamento local
    setClients(clientesIniciais);
    setLoading(false);
    
    /*
    --- CÓDIGO PARA QUANDO QUISERES USAR A API ---*/
    fetch(DEFAULT_API)
      .then(res => res.json())
      .then(data => {
        setClients(data.clientes || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Erro API");
        setLoading(false);
      });
    
  }, []);

  // --- MÉTODOS SIMULADOS ---

  async function addClient(client) {
    try {
      const newClient = { ...client, id: Date.now() };
      setClients(prev => [...prev, newClient]);
      return { ok: true };
    } catch (err) {
      setError("Erro ao criar cliente");
      return { ok: false, message: err.message };
    }
  }

  async function updateClient(id, updatedData) {
    try {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
      return { ok: true };
    } catch (err) {
      setError("Erro ao atualizar");
      return { ok: false, message: err.message };
    }
  }

  async function deleteClient(id) {
    try {
      setClients(prev => prev.filter(c => c.id !== id));
      return { ok: true };
    } catch (err) {
      setError("Erro ao apagar");
      return { ok: false, message: err.message };
    }
  }

  const value = {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
  };

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
}
