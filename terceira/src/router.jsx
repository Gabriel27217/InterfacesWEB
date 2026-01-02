// Importa React
import React from "react";

// Importa componentes do React Router v6
import { Routes, Route, Navigate } from "react-router-dom";

// Importa páginas da aplicação
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Frontoffice from "./pages/Frontoffice";
import Backoffice from "./pages/Backoffice";
import Register from "./pages/Register";
import ClientArea from "./pages/ClientArea";
import CartPage from "./pages/CartPage";

// Se o Login está em components/layout, mantém aqui
import Login from "./components/layout/Login";

// Importação do hook de autenticação
import { useAuth } from "./hooks/useAuth";

// =========================
//   ROTA PROTEGIDA (GENÉRICA)
// =========================

// Componente de rota protegida genérico
// Recebe um "children" (componente) e só o renderiza se estiver logado
function PrivateRoute({ children }) {
  // Acede ao estado de autenticação
  const { isLoggedIn } = useAuth();

  // Se não estiver logado, redireciona para a página de login
  // "replace" evita que o utilizador volte para a rota protegida com o botão "voltar" [web:255]
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, mostra o conteúdo protegido
  return children;
}

// =========================
//     ROUTER PRINCIPAL
// =========================

// Componente principal de rotas
export default function AppRouter() {
  return (
    <Routes>
      {/* Rota principal / -> Página Home */}
      <Route path="/" element={<Home />} />

      {/* Loja de carros */}
      <Route path="/loja" element={<Frontoffice />} />

      {/* Página sobre a empresa */}
      <Route path="/sobre" element={<About />} />

      {/* Página de registo de novos clientes */}
      <Route path="/registar" element={<Register />} />

      {/* Página administrativa (Backoffice) - (neste código ainda não está protegida) */}
      <Route path="/gerir" element={<Backoffice />} />

      {/* Página de Login */}
      <Route path="/login" element={<Login />} />

      {/* Área privada do cliente (protegida) */}
      <Route
        path="/minha-conta"
        element={
          <PrivateRoute>
            <ClientArea />
          </PrivateRoute>
        }
      />

      {/* Página do carrinho (protegida, só depois de login) */}
      <Route
        path="/carrinho"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
