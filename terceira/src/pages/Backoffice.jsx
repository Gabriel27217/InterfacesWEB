import React, { useState } from "react";
import CarForm from "../components/cars/CarForm";
import CarList from "../components/cars/CarList";
import ClientForm from "../components/clients/ClientForm";
import ClientList from "../components/clients/ClientList";
import { useAuth } from "../hooks/useAuth";

export default function Backoffice() {
  const { isLoggedIn } = useAuth();
  const [editingCar, setEditingCar] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  if (!isLoggedIn) {
    return <h2> Acesso restrito. Faça login para continuar.</h2>;
  }

  // Função auxiliar para editar e subir a página
  const handleEditCar = (car) => {
    setEditingCar(car);
    // Isto faz a magia: leva o ecrã para o topo suavemente
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1>Backoffice — Gestão</h1>

      {/* GESTÃO DE CARROS */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Carros</h2>

        <CarForm
          editingCar={editingCar}
          onFinish={() => setEditingCar(null)}
        />

        {/* AQUI ESTÁ A MUDANÇA: Usamos a nova função handleEditCar */}
        <CarList onEdit={handleEditCar} />
      </section>

      {/* GESTÃO DE CLIENTES */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Clientes</h2>

        <ClientForm
          editingClient={editingClient}
          onFinish={() => setEditingClient(null)}
        />

        {/* Também aplicamos aos clientes */}
        <ClientList onEdit={handleEditClient} />
      </section>
    </div>
  );
}
