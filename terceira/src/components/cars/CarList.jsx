import React, { useState, useContext } from "react";
import { CarsContext } from "../../context/CarsContext";
import Input from "../ui/Input";
import Button from "../ui/Button"; 
import CarCard from "./CarCard";

export default function CarList() {
  // AQUI ESTÁ O SEGREDO: Vamos buscar 'allCars' (todos) e não 'cars' (que pode vir já cortado)
  const { allCars, cars, loading } = useContext(CarsContext);
  
  // Se 'allCars' não existir (depende da versão do teu Context), usamos 'cars' como fallback
  const listaCompleta = allCars || cars || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6; 

  // --- PESQUISA ---
  const handleSearchChange = (e) => {
    const value = e.target ? e.target.value : e;
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1); 
  };

  // Filtra sobre a lista COMPLETA
  const filteredCars = listaCompleta.filter(car => 
    car.modelo.toLowerCase().includes(searchTerm) || 
    car.marca.toLowerCase().includes(searchTerm)
  );

  // --- PAGINAÇÃO ---
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>A carregar carros...</p>;
  }

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
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        {currentCars.length > 0 ? (
          currentCars.map(car => <CarCard key={car.id} car={car} />)
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666" }}>
            Nenhum carro encontrado.
          </p>
        )}
      </div>

      {/* BOTÕES DE PAGINAÇÃO (Só aparecem se houver mais de 1 página) */}
      {filteredCars.length > carsPerPage && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "1rem", 
          marginTop: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid #eee"
        }}>
          <Button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            // Se não tiveres variant="secondary", podes usar style
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Anterior
          </Button>
          
          <span style={{ color: "#666" }}>
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
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
