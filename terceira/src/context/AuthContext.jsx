// Importa funcionalidades do React
import React, { createContext, useState } from "react";

// Importa funções da API para obter e criar clientes
import { getClients, createClient } from "../api/clientsApi"; // caminho correto da API

// Criação do contexto de autenticação
export const AuthContext = createContext();

// Componente Provider que envolve a aplicação
export function AuthProvider({ children }) {
  // Estado que guarda o utilizador autenticado
  // Se for null, não existem logins 
  const [user, setUser] = useState(null);

  // -----------------------------
  // FUNÇÃO DE LOGIN (via API)
  // -----------------------------
  const login = async (email, password) => {
    try {
      // Vai buscar todos os clientes à API (ex: Google Sheets)
      const clientes = await getClients(); // GET /clientes

      // Procura um cliente com email e password correspondentes
      const utilizadorEncontrado = (clientes || []).find(
        (c) =>
          // Compara emails ignorando maiúsculas/minúsculas
          String(c.email || "").toLowerCase() ===
            String(email || "").toLowerCase() &&
          // Compara passwords
          String(c.password ?? "") === String(password ?? "")
      );

      // Se não encontrar utilizador, devolve erro
      if (!utilizadorEncontrado) {
        return { success: false, message: "Email ou password incorretos." };
      }

      // Define o role do utilizador (admin ou client)
      const role = utilizadorEncontrado.role === "admin" ? "admin" : "client";

      // Guarda o utilizador autenticado no estado
      setUser({
        name: utilizadorEncontrado.nome || "Utilizador",
        email: utilizadorEncontrado.email,
        role: role,
        dados: utilizadorEncontrado, // dados completos do utilizador
      });

      // Devolve sucesso e o role (usado para navegação)
      return { success: true, role };
    } catch (error) {
      // Caso haja erro de sistema
      console.error("Erro no login:", error);
      return { success: false, message: "Erro de sistema." };
    }
  };

  // -----------------------------
  // FUNÇÃO DE REGISTO (via API)
  // -----------------------------
  const register = async (dadosCliente) => {
    try {
      // 1️⃣ Vai buscar todos os clientes para verificar duplicados
      const clientes = await getClients();

      // Verifica se já existe um cliente com o mesmo email
      const existe = (clientes || []).some(
        (c) =>
          String(c.email || "").toLowerCase() ===
          String(dadosCliente.email || "").toLowerCase()
      );

      // Se o email já existir, devolve erro
      if (existe) {
        return { success: false, message: "Este email já está registado." };
      }

      // 2️⃣ Cria o objeto do novo cliente para enviar à API
      const novoClienteAPI = {
        nome: dadosCliente.nome,
        email: dadosCliente.email,
        password: String(dadosCliente.password ?? ""),
        role: "client", // todos os novos registos são clientes
      };

      // Envia o novo cliente para a API (POST)
      await createClient(novoClienteAPI);

      // 3️⃣ Login automático após registo
      setUser({
        name: novoClienteAPI.nome || "Utilizador",
        email: novoClienteAPI.email,
        role: "client",
        dados: novoClienteAPI,
      });

      // Devolve sucesso
      return { success: true };
    } catch (error) {
      // Caso ocorra algum erro
      console.error("Erro no registo:", error);
      return { success: false, message: "Erro ao criar conta." };
    }
  };

  // -----------------------------
  // FUNÇÃO DE LOGOUT
  // -----------------------------
  const logout = () => setUser(null);

  // -----------------------------
  // PROVIDER DO CONTEXTO
  // -----------------------------
  return (
    <AuthContext.Provider
      value={{
        user,                // dados do utilizador
        isLoggedIn: !!user,   // true se estiver logado
        login,               // função de login
        logout,              // função de logout
        register,            // função de registo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}