// Importação do React e hooks
import React, { useState } from "react";

// Importação de componentes de carros
import CarList from "../components/cars/CarList";
import CarForm from "../components/cars/CarForm";

// Importação do hook de autenticação
import { useAuth } from "../hooks/useAuth";

// Componente funcional Frontoffice
export default function Frontoffice() {
  // Acesso ao estado de login e informações do utilizador
  // Precisamos do 'user' para verificar a role
  const { isLoggedIn, user } = useAuth();

  // Estado local para guardar o carro que está a ser editado
  const [editingCar, setEditingCar] = useState(null);

  // =========================
  //       VERIFICAÇÃO ADMIN
  // =========================

  // Verifica se o utilizador que fez login é admin
  const isAdmin = isLoggedIn && user && user.role === "admin";

  // =========================
  //       RENDERIZAÇÃO
  // =========================
  return (
    <div>
      {/* Título da página */}
      <h1>Loja de Carros</h1>

      {/* ===== FORMULÁRIO DE ADMINISTRADOR ===== */}
      {/* Só mostramos o formulário se for Admin (render condicional com &&) [web:159] */}
      {isAdmin && (
        <div
          style={{
            marginBottom: "2rem",
            border: "2px dashed #ccc",
            padding: "1rem",
          }}
        >
          <h3>Área de Admin: Adicionar Carro</h3>

          {/* Formulário para criar ou editar carros */}
          <CarForm
            editingCar={editingCar} // Passa o carro a ser editado
            onFinish={() => setEditingCar(null)} // Limpa estado após submissão
          />
        </div>
      )}

      {/* ===== LISTA DE CARROS ===== */}
      {/* Todos os utilizadores podem ver a lista */}
      {/* Se for admin, passa a função onEdit; senão, passa null para não aparecer botão editar */}
      <CarList onEdit={isAdmin ? (car) => setEditingCar(car) : null} />
    </div>
  );
}
