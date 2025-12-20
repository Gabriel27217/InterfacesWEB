import React, { createContext, useState, useEffect } from "react";
// Importa os teus dados locais
import { carrosIniciais } from "../db";

export const CarsContext = createContext();

// LINK DA API (COMENTADO PARA POUPAR REQUESTS)
// const API_URL = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/folha1";

const API_URL = "https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/carros";   //NOVA API por causa dos requests

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Carregamento LOCAL a partir do db.js ---
    console.log("A carregar dados locais do db.js...");

    // "Limpa" os teus dados para garantir que a aplicação não quebra
    const safeCars = carrosIniciais.map(car => ({
      // Valores por defeito para evitar erros de 'undefined'
      marca: car.marca || "N/D",
      modelo: car.modelo || "N/D",
      ano: car.ano || "N/D",
      preco: typeof car.preco === 'number' ? car.preco : 0,
      cor: car.cor || "N/D",
      // Converte "100 201" para o número 100201 e trata strings vazias
      km: parseInt(String(car.km || '0').replace(/ /g, '')) || 0,
      foto: car.foto || "",
      id: car.id,
      likes: car.likes || 0 // ✅ PONTO-CHAVE: Adiciona 'likes: 0' se não existir
    }));
      
    setCars(safeCars);
    setAllCars(safeCars);
    setLoading(false);
    
  }, []);

  // As funções abaixo continuam a funcionar localmente, modificando o estado
  const addCar = async (car) => {
    const newCar = { ...car, id: Date.now(), likes: 0 };
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