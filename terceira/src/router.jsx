import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Frontoffice from "./pages/Frontoffice";
import Backoffice from "./pages/Backoffice";

import Register from "./pages/Register";
import Login from "./components/layout/Login";
import ClientArea from "./pages/ClientArea";
import CartPage from "./pages/CartPage";
import { useAuth } from "./hooks/useAuth";

// Componente de rota protegida genérico
function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/loja" element={<Frontoffice />} />

      <Route path="/sobre" element={<About />} />

      {/* Rota de Registo */}
      <Route path="/registar" element={<Register />} />

      {/* Rota do Backoffice (podes depois trocar para um PrivateRoute se quiseres) */}
      <Route path="/gerir" element={<Backoffice />} />

      {/* Página de Login */}
      <Route path="/login" element={<Login />} />

      {/* Rota para o Cliente ver histórico (protegida) */}
      <Route
        path="/minha-conta"
        element={
          <PrivateRoute>
            <ClientArea />
          </PrivateRoute>
        }
      />

      {/* Rota do Carrinho (protegida, só depois de login) */}
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
