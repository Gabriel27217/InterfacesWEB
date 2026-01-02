// Importação do hook useContext do React
import { useContext } from "react";

// Importação do contexto responsável pelos carros
import { CarsContext } from "../context/CarsContext";

// Hook personalizado para facilitar o acesso ao CarsContext
export function useCars() {

  // devolve todos os dados e métodos disponibilizados pelo CarsContext
  // (cars, allCars, loading, addCar, updateCar, deleteCar, etc.)
  return useContext(CarsContext);
}