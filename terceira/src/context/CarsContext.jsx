import React, { createContext, useEffect, useState } from "react";
import { getCars, createCar, updateCarById, deleteCarById } from "../api/carsApi";
import { getFavorites } from "../api/favoritesApi";

export const CarsContext = createContext();

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refreshCars() {
    try {
      setLoading(true);
      setError(null);

      const [apiCars, favs] = await Promise.all([getCars(), getFavorites()]);

      // conta likes por carId (fonte de verdade = favoritos)
      const likesMap = {};
      (favs || []).forEach((f) => {
        const id = Number(f.carId);
        if (!Number.isNaN(id)) likesMap[id] = (likesMap[id] || 0) + 1;
      });

      const safeCars = (apiCars || []).map((car) => ({
        ...car,
        id: car.id,
        marca: car.marca || "N/D",
        modelo: car.modelo || "N/D",
        ano: car.ano ?? "N/D",
        preco: typeof car.preco === "number" ? car.preco : Number(car.preco) || 0,
        cor: car.cor || "N/D",
        km: parseInt(String(car.km ?? "0").replace(/ /g, "")) || 0,
        foto: car.foto || "",
        likes: likesMap[Number(car.id)] || 0, // ✅ calculado
      }));

      setCars(safeCars);
      setAllCars(safeCars);
    } catch (e) {
      setError(e?.message || "Erro a carregar carros");
      setCars([]);
      setAllCars([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshCars();
  }, []);

  const addCar = async (car) => {
    try {
      setError(null);

      // não precisas de mandar likes para a sheet
      const payload = { ...car };

      await createCar(payload);
      await refreshCars();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao adicionar carro" };
    }
  };

  const updateCar = async (id, updatedCar) => {
    try {
      setError(null);
      await updateCarById(id, updatedCar);
      await refreshCars();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao atualizar carro" };
    }
  };

  const deleteCar = async (id) => {
    try {
      setError(null);
      await deleteCarById(id);
      await refreshCars();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao apagar carro" };
    }
  };

  return (
    <CarsContext.Provider
      value={{
        cars,
        allCars,
        loading,
        error,
        refreshCars,
        addCar,
        updateCar,
        deleteCar,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}
