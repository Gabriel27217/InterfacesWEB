import React, { createContext, useState } from "react";
// Importação direta para Login Local
import { clientesIniciais } from "../db";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LINK DA API (COMENTADO PARA USO FUTURO)
  // const CLIENTS_API = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/clientes";

   const CLIENTS_API = "https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/clientes"; //NOVA API por causa dos requestsq

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      /*
      // 1. MODO LOCAL (db.js) - Ativo agora
      const utilizadorEncontrado = clientesIniciais.find(
        (c) => c.email === email && (c.password && c.password.toString() === password.toString())
      );

      /* 
      // 2. MODO API (Sheety) - Futuro*/
      const res = await fetch(CLIENTS_API);
      if (!res.ok) throw new Error("Erro na API");
      const data = await res.json();
      const clientes = data.clientes || [];
      const utilizadorEncontrado = clientes.find(
         (c) => c.email === email && String(c.password) === password
      );
      

      if (utilizadorEncontrado) {
        const role = utilizadorEncontrado.role === "admin" ? "admin" : "client";

        setUser({
          name: utilizadorEncontrado.nome || "Utilizador",
          email: utilizadorEncontrado.email,
          role: role,
          dados: utilizadorEncontrado,
        });

        return { success: true, role: role };
      }

    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: "Erro de sistema." };
    }

    return { success: false, message: "Email ou password incorretos." };
  };

  // --- REGISTO (NOVO) ---
  const register = async (dadosCliente) => {
    // dadosCliente espera: { nome, email, password }
    try {
      // 1. Validar se email já existe (Simulação Local)
      const existeLocal = clientesIniciais.find(c => c.email === dadosCliente.email);
      if (existeLocal) {
        return { success: false, message: "Este email já está registado." };
      }

      /*
      // 2. MODO API (Sheety) - Futuro
      // Verifica primeiro na API se existe, depois cria*/
      const novoClienteAPI = {
        nome: dadosCliente.nome,
        email: dadosCliente.email,
        password: dadosCliente.password,
        role: "client"
      };
      
      await fetch(CLIENTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: novoClienteAPI })
      });
      

      // 3. MODO LOCAL (Simulação Temporária)
      // Cria o cliente em memória e faz login imediato
      const novoClienteSimulado = {
        id: Date.now(), // ID temporário
        ...dadosCliente,
        role: "client"
      };

      // Adiciona à lista em memória (perde-se ao fazer refresh!)
      clientesIniciais.push(novoClienteSimulado);

      // Faz login automático
      setUser({
        name: novoClienteSimulado.nome,
        email: novoClienteSimulado.email,
        role: "client",
        dados: novoClienteSimulado
      });

      return { success: true };

    } catch (error) {
      console.error("Erro no registo:", error);
      return { success: false, message: "Erro ao criar conta." };
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Adicionei 'register' ao value do Provider
  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
