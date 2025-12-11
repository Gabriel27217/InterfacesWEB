import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar navigate
import CarForm from "../components/cars/CarForm";
import CarList from "../components/cars/CarList";
import ClientList from "../components/clients/ClientList";
import { useAuth } from "../hooks/useAuth";

export default function Backoffice() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [editingCar, setEditingCar] = useState(null);

  // --- PROTEÇÃO DE ROTA ---
  // Se não estiver logado OU se estiver logado mas não for admin...
  if (!isLoggedIn || (user && user.role !== "admin")) {
    
    // Podes redirecionar automaticamente para a loja:
    // useEffect(() => { navigate("/"); }, []);
    // return null;

    // OU mostrar uma mensagem de erro:
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#dc2626" }}>
        <h2> Acesso Negado</h2>
        <p>Esta página é exclusiva para administradores.</p>
        <p>Maloto!! Assin:Cebolinha</p>
        <button onClick={() => navigate("/")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
          Voltar à Loja
        </button>
      </div>
    );
  }

  const handleEditCar = (car) => {
    setEditingCar(car);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1>Backoffice — Gestão</h1>

      {/* GESTÃO DE CARROS */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Carros</h2>
        {/* Admin pode criar/editar carros aqui */}
        <CarForm
          editingCar={editingCar}
          onFinish={() => setEditingCar(null)}
        />
        <CarList onEdit={handleEditCar} />
      </section>

      {/* GESTÃO DE CLIENTES */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Clientes</h2>
        {/* Admin vê a lista de clientes aqui */}
        <ClientList />
      </section>
    </div>
  );
}
