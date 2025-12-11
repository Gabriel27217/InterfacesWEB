import React, { useState } from "react";
import CarList from "../components/cars/CarList";
import CarForm from "../components/cars/CarForm";
import { useAuth } from "../hooks/useAuth";

export default function Frontoffice() {
  const { isLoggedIn } = useAuth();
  const [editingCar, setEditingCar] = useState(null);

  return (
    <div>
      <h1>Loja de Carros</h1>

      {isLoggedIn && (
        <div style={{ marginBottom: "2rem" }}>
          <CarForm
            editingCar={editingCar}
            onFinish={() => setEditingCar(null)}
          />
        </div>
      )}

      <CarList onEdit={(car) => setEditingCar(car)} />
    </div>
  );
}
