import React, { useState } from "react";
import CarList from "../components/cars/CarList";
import CarForm from "../components/cars/CarForm";
import { useAuth } from "../hooks/useAuth";

export default function Frontoffice() {
  const { isLoggedIn, user } = useAuth(); // Precisamos do 'user' para ver a role
  const [editingCar, setEditingCar] = useState(null);

  // Verifica se é admin
  const isAdmin = isLoggedIn && user && user.role === "admin";

  return (
    <div>
      <h1>Loja de Carros</h1>

      {/* AQUI ESTÁ A CORREÇÃO: */}
      {/* Só mostramos o formulário SE for Admin. Antes tinhas apenas 'isLoggedIn' */}
      
      {isAdmin && (
        <div style={{ marginBottom: "2rem", border: "2px dashed #ccc", padding: "1rem" }}>
          <h3>Área de Admin: Adicionar Carro</h3>
          <CarForm
            editingCar={editingCar}
            onFinish={() => setEditingCar(null)}
          />
        </div>
      )}

      {/* A lista toda a gente vê */}
      {/* Passamos o setEditingCar apenas se for admin, senão passamos null para não aparecer botão editar */}
      <CarList onEdit={isAdmin ? (car) => setEditingCar(car) : null} />
    </div>
  );
}
