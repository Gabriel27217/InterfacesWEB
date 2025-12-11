import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Frontoffice from "./pages/Frontoffice";
import Backoffice from "./pages/Backoffice";


import Register from "./pages/Register"; 

// Se o teu Login está em components/layout, mantém.
import Login from "./components/layout/Login"; 
import ClientArea from "./pages/ClientArea"; 

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" 
      element={<Home />} />
      <Route path="/loja" 
      element={<Frontoffice />} />
      <Route path="/sobre" 
      element={<About />} />
      
      {/* Rota de Registo */}
      <Route path="/registar" 
      element={<Register />} /> 

      {/* Rota protegida do Admin */}
      <Route path="/gerir" 
      element={<Backoffice />} />
      
      {/* Página de Login */}
      <Route path="/login" 
      element={<Login />} />
      
      {/* Rota para o Cliente ver histórico */}
      <Route path="/minha-conta" 
      element={<ClientArea />} />
    </Routes>
  );
}
