import React, { createContext, useState, useEffect } from "react";
// Importação direta do ficheiro local (MÉTODO ATUAL)
import { carrosIniciais } from "../db";

export const CarsContext = createContext();

// LINK DA API (COMENTADO PARA USO FUTURO)
// const DEFAULT_API = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/carros";

export function CarsProvider({ children }) {
  // Inicializamos com os dados importados do JS
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregamento local (Instantâneo)
    setCars(carrosIniciais);
    setAllCars(carrosIniciais);
    setLoading(false);

    /* 
    // --- CÓDIGO PARA QUANDO QUISERES USAR A API ---
    async function fetchFromApi() {
      try {
        const res = await fetch(DEFAULT_API);
        const data = await res.json();
        const apiCars = data.carros || [];
        setCars(apiCars);
        setAllCars(apiCars);
        setLoading(false);
      } catch (error) {
        console.error("Erro API:", error);
      }
    }
    // fetchFromApi(); 
    */
  }, []);

  // --- MÉTODOS SIMULADOS (LOCAL) ---

  const addCar = async (car) => {
    const newCar = { ...car, id: Date.now() };
    setCars(prev => [...prev, newCar]);
    setAllCars(prev => [...prev, newCar]);
    return true;
  };

  const updateCar = async (id, updatedCar) => {
    const updater = (list) => list.map(c => c.id === id ? { ...c, ...updatedCar } : c);
    setCars(prev => updater(prev));
    setAllCars(prev => updater(prev));
    return true;
  };

  const deleteCar = async (id) => {
    const filter = (list) => list.filter(c => c.id !== id);
    setCars(prev => filter(prev));
    setAllCars(prev => filter(prev));
    return true;
  };

  return (
    <CarsContext.Provider value={{ cars, allCars, loading, addCar, updateCar, deleteCar }}>
      {children}
    </CarsContext.Provider>
  );
}
