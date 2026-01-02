// Importações do React e hooks
import React, { useContext } from "react";

// React Router para navegação
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router"; // Componente que contém todas as rotas da aplicação

// Importação dos contextos
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CarsProvider } from "./context/CarsContext";
import { ClientsProvider } from "./context/ClientsContext";
import { CartProvider } from "./context/CartContext"; // Contexto do carrinho (novo)

// Layout global
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ===========================
// Componente de Layout Principal
// ===========================
function AppLayout() {
  // Acesso ao estado de login do utilizador a partir do AuthContext
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="app-container">
      {/* Navbar aparece em todas as páginas */}
      <Navbar />

      {/* Conteúdo principal renderizado pelas rotas */}
      <main className="main-content">
        <AppRouter isLoggedIn={isLoggedIn} />
      </main>

      {/* Footer global */}
      <Footer />
    </div>
  );
}

// ===========================
// Componente App Principal
// ===========================
export default function App() {
  return (
    // BrowserRouter envolve toda a app para habilitar navegação SPA [web:199]
    <BrowserRouter>
      {/* Contexto de autenticação */}
      <AuthProvider>
        {/* Contexto de carros */}
        <CarsProvider>
          {/* Contexto de clientes */}
          <ClientsProvider>
            {/* Contexto do carrinho (novo) */}
            <CartProvider>
              {/* Layout principal com Navbar, rotas e Footer */}
              <AppLayout />
            </CartProvider>
          </ClientsProvider>
        </CarsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
