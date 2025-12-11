import React, { createContext, useState } from "react";
// Importação direta para Login Local
import { clientesIniciais } from "../db";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LINK DA API (COMENTADO PARA USO FUTURO)
  // const CLIENTS_API = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/clientes";

  const login = async (email, password) => {
    // 1. LOGIN ADMIN
    if (email === "admin@autovital.com" && password === "admin123") {
      setUser({
        name: "Administrador",
        email: email,
        role: "admin",
      });
      return { success: true, role: "admin" };
    }

    // 2. LOGIN CLIENTE (Lógica Local com Import)
    try {
      // Procura diretamente no array importado
      const clienteEncontrado = clientesIniciais.find(
        (c) => c.email === email && (c.password && c.password.toString() === password.toString())
      );

      /* 
      // --- CÓDIGO PARA QUANDO QUISERES USAR A API ---
      const res = await fetch(CLIENTS_API);
      const data = await res.json();
      const clientes = data.clientes || [];
      const clienteEncontrado = clientes.find(...)
      */

      if (clienteEncontrado) {
        setUser({
          name: clienteEncontrado.nome,
          email: clienteEncontrado.email,
          role: "client",
          dados: clienteEncontrado,
        });
        return { success: true, role: "client" };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: "Erro de sistema." };
    }

    return { success: false, message: "Email ou password incorretos." };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
