// Importa React e hooks necessários
import React, { useState, useContext } from "react";

// Importa o contexto de carros (onde estão os dados e funções CRUD)
import { CarsContext } from "../../context/CarsContext";

// Importa componentes reutilizáveis da UI
import Input from "../ui/Input"; // Input estilizado para pesquisa
import Button from "../ui/Button"; // Botão estilizado

// Importa o card individual de cada carro
import CarCard from "./CarCard";

// CarList recebe a prop onEdit, que é usada para editar carros (vinda do Backoffice)
export default function CarList({ onEdit }) {
  // Pega os dados e funções do contexto (vem do <CarsProvider /> via useContext) [web:284]
  const { allCars, cars, loading, deleteCar } = useContext(CarsContext);

  // Escolhe a lista completa: se houver allCars, usa; senão, fallback para cars
  const listaCompleta = allCars || cars || [];

  // =========================
  //           ESTADOS
  // =========================

  // Estado para barra de pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6; // Número de carros por página

  // =========================
  //           PESQUISA
  // =========================

  // Atualiza o termo de pesquisa e volta à página 1
  const handleSearchChange = (e) => {
    const value = e.target ? e.target.value : e;
    setSearchTerm(value.toLowerCase()); // converte para minúsculas (pesquisa case-insensitive)
    setCurrentPage(1); // volta à página 1 ao pesquisar
  };

  // Filtra carros pelo modelo ou marca
  const filteredCars = listaCompleta.filter(
    (car) =>
      car.modelo.toLowerCase().includes(searchTerm) ||
      car.marca.toLowerCase().includes(searchTerm)
  );

  // =========================
  //          PAGINAÇÃO
  // =========================

  // Calcula índices para "cortar" a lista para a página atual
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;

  // Carros que aparecem na página atual
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Total de páginas
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Vai para a próxima página (se existir)
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Vai para a página anterior (se existir)
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // =========================
  //           DELETE
  // =========================

  // Função para apagar um carro (usa a função deleteCar do contexto)
  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este carro?")) {
      await deleteCar(id);
    }
  };

  // =========================
  //           LOADING
  // =========================

  // Enquanto carrega dados, mostra feedback ao utilizador
  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        A carregar carros...
      </p>
    );
  }

  // =========================
  //        RENDERIZAÇÃO
  // =========================
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Loja de Carros</h2>

      {/* BARRA DE PESQUISA */}
      <div style={{ marginBottom: "2rem" }}>
        <Input
          type="text"
          placeholder="Pesquisar por modelo ou marca..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: "100%", maxWidth: "500px" }}
        />
      </div>

      {/* LISTA DE CARROS (PÁGINA ATUAL) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {currentCars.length > 0 ? (
          currentCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={onEdit} // Passa a função de editar recebida do Backoffice
              onDelete={handleDelete} // Passa a função local de apagar
            />
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666" }}>
            Nenhum carro encontrado.
          </p>
        )}
      </div>

      {/* BOTÕES DE PAGINAÇÃO */}
      {filteredCars.length > carsPerPage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Anterior
          </Button>

          <span style={{ color: "#666" }}>
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPages}</strong>
          </span>

          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Seguinte
          </Button>
        </div>
      )}
    </div>
  );
}
