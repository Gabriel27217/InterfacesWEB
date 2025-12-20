// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";
import { getClients, createClient } from "../api/clientsApi"; //caminho certo zé 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // --- LOGIN (API) ---
  const login = async (email, password) => {
    try {
      const clientes = await getClients(); // GET /clientes [file:9]

      const utilizadorEncontrado = (clientes || []).find(
        (c) =>
          String(c.email || "").toLowerCase() === String(email || "").toLowerCase() &&
          String(c.password ?? "") === String(password ?? "")
      );

      if (!utilizadorEncontrado) {
        return { success: false, message: "Email ou password incorretos." };
      }

      const role = utilizadorEncontrado.role === "admin" ? "admin" : "client";

      setUser({
        name: utilizadorEncontrado.nome || "Utilizador",
        email: utilizadorEncontrado.email,
        role,
        dados: utilizadorEncontrado,
      });

      return { success: true, role };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: "Erro de sistema." };
    }
  };

  // --- REGISTO (API) ---
  const register = async (dadosCliente) => {
    try {
      // 1) Verificar se email já existe (na API)
      const clientes = await getClients(); // [file:9]
      const existe = (clientes || []).some(
        (c) =>
          String(c.email || "").toLowerCase() ===
          String(dadosCliente.email || "").toLowerCase()
      );

      if (existe) {
        return { success: false, message: "Este email já está registado." };
      }

      // 2) Criar na API (isto é o que faz aparecer na Google Sheet)
      const novoClienteAPI = {
        nome: dadosCliente.nome,
        email: dadosCliente.email,
        password: String(dadosCliente.password ?? ""),
        role: "client",
      };

      await createClient(novoClienteAPI); // POST /clientes com { clientes: ... } [file:9]

      // 3) Login automático
      setUser({
        name: novoClienteAPI.nome || "Utilizador",
        email: novoClienteAPI.email,
        role: "client",
        dados: novoClienteAPI,
      });

      return { success: true };
    } catch (error) {
      console.error("Erro no registo:", error);
      return { success: false, message: "Erro ao criar conta." };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
