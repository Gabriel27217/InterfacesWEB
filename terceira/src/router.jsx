import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Frontoffice from "./pages/Frontoffice";
import Backoffice from "./pages/Backoffice";

// Se o teu Login está em components/layout, mantém.
// Se criares em pages/Login.jsx, muda para: import Login from "./pages/Login";
import Login from "./components/layout/Login"; 
import ClientArea from "./pages/ClientArea"; // <-- Importa a nova página

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loja" element={<Frontoffice />} />
      <Route path="/sobre" element={<About />} />
      
      {/* Rota protegida do Admin */}
      <Route path="/gerir" element={<Backoffice />} />
      
      {/* Página de Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Nova Rota para o Cliente ver histórico */}
      <Route path="/minha-conta" element={<ClientArea />} />
    </Routes>
  );
}
