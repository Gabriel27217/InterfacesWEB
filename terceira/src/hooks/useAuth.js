// Importação do hook useContext do React
import { useContext } from "react";

// Importação do contexto de autenticação
import { AuthContext } from "../context/AuthContext";

// Hook personalizado para facilitar o acesso ao AuthContext
export function useAuth() {

  // devolve os valores disponibilizados pelo AuthContext
  // (user, isLoggedIn, login, logout, register, etc.)
  return useContext(AuthContext);
}