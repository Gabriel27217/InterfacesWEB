// Importação do React e dos hooks necessários
import React, { createContext, useEffect, useState } from "react";

// Importação das funções da API de carros (Sheety) e favoritos
import { getCars, createCar, updateCarById, deleteCarById } from "../api/carsApi";
import { getFavorites } from "../api/favoritesApi";

// Criação do Contexto dos Carros
export const CarsContext = createContext();

// Componente Provider responsável por fornecer os dados dos carros
// e respetivos métodos a toda a aplicação
export function CarsProvider({ children }) {
  // Estado que guarda a lista atual de carros (pode ser filtrada)
  const [cars, setCars] = useState([]);

  // Estado que guarda todos os carros (lista completa)
  const [allCars, setAllCars] = useState([]);

  // Estado que indica se os dados ainda estão a ser carregados
  const [loading, setLoading] = useState(true);

  // Estado para guardar mensagens de erro (ex.: falha ao carregar da API)
  const [error, setError] = useState(null);

  // =========================
  //     CARREGAR / REFRESH
  // =========================

  // Função que atualiza a lista de carros a partir da API
  async function refreshCars() {
    try {
      // Inicia o loading e limpa erros anteriores
      setLoading(true);
      setError(null);

      // Faz 2 pedidos em paralelo:
      // - carros (GET /carros)
      // - favoritos (GET /favoritos)
      const [apiCars, favs] = await Promise.all([getCars(), getFavorites()]);

      // Mapa de likes por car.id (no Sheety, o id costuma ser o número da linha/row id) [web:1]
      // NOTA: em favoritos, garante que guardas { carId: car.id }
      const likesMap = {};
      (favs || []).forEach((f) => {
        const carId = Number(f.carId);
        if (!Number.isNaN(carId)) likesMap[carId] = (likesMap[carId] || 0) + 1;
      });

      // Normaliza dados para evitar undefined e garantir tipos consistentes
      const safeCars = (apiCars || []).map((car) => ({
        ...car,
        marca: car.marca || "N/D",
        modelo: car.modelo || "N/D",
        ano: car.ano ?? "N/D",
        preco: typeof car.preco === "number" ? car.preco : Number(car.preco) || 0,
        cor: car.cor || "N/D",
        km: parseInt(String(car.km ?? "0").replace(/ /g, "")) || 0,
        foto: car.foto || "",
        descricao: car.descricao || "",
        status: car.status || "disponivel",
        likes: likesMap[Number(car.id)] || 0,
      }));

      // Atualiza os estados com os carros já tratados
      setCars(safeCars);
      setAllCars(safeCars);
    } catch (e) {
      // Se falhar, guarda a mensagem de erro e limpa listas para não mostrar dados “velhos”
      setError(e?.message || "Erro a carregar carros");
      setCars([]);
      setAllCars([]);
    } finally {
      // Termina o loading (independentemente de sucesso/erro)
      setLoading(false);
    }
  }

  // useEffect executado uma única vez quando o componente é montado
  useEffect(() => {
    refreshCars();
  }, []);

  // =========================
  //           CREATE
  // =========================

  // Função para adicionar um novo carro via API
  const addCar = async (car) => {
    try {
      // Limpa erros anteriores
      setError(null);

      // Define valores por defeito
      // (não enviar id, porque o Sheety atribui/usa o id da linha) [web:1]
      const payload = { ...car, status: car.status || "disponivel" };

      // Cria o carro na API e depois atualiza a lista
      await createCar(payload);
      await refreshCars();

      return { ok: true };
    } catch (e) {
      // Devolve erro para o componente que chamou (para mostrar feedback no UI)
      return { ok: false, message: e?.message || "Erro ao adicionar carro" };
    }
  };

  // =========================
  //           UPDATE
  // =========================

  // Função para atualizar um carro existente através do seu ID
  const updateCar = async (id, updatedCar) => {
    try {
      // Limpa erros anteriores
      setError(null);

      // Atualiza na API usando /carros/:id
      // No Sheety, este :id costuma ser o row id (número da linha) [web:1]
      await updateCarById(id, updatedCar);

      // Atualiza a lista local depois do update
      await refreshCars();

      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao atualizar carro" };
    }
  };

  // =========================
  //           DELETE
  // =========================

  // Função para apagar um carro através do seu ID
  const deleteCar = async (id) => {
    try {
      // Limpa erros anteriores
      setError(null);

      // Apaga na API usando /carros/:id
      // No Sheety, este :id costuma ser o row id (número da linha) [web:1]
      await deleteCarById(id);

      // Atualiza a lista local depois do delete
      await refreshCars();

      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Erro ao apagar carro" };
    }
  };

  // Provider que disponibiliza os dados e métodos dos carros
  return (
    <CarsContext.Provider
      value={{
        cars,        // Lista atual de carros (pode ser filtrada)
        allCars,     // Lista completa de carros
        loading,     // Estado de carregamento
        error,       // Mensagem de erro (se existir)
        refreshCars, // Função para voltar a carregar carros
        addCar,      // Função para adicionar carro
        updateCar,   // Função para atualizar carro
        deleteCar,   // Função para apagar carro
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}
