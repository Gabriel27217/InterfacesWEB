import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CarsProvider } from "./context/CarsContext";
import { ClientsProvider } from "./context/ClientsContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function AppLayout() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRouter isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarsProvider>
          <ClientsProvider>
            <AppLayout />
          </ClientsProvider>
        </CarsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
