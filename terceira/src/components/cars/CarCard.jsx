import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function CarCard({ car, onEdit, onDelete }) {
  const { isLoggedIn } = useAuth();

  // Log para confirmares na consola que o link está a chegar
  console.log("A tentar mostrar imagem:", car.foto);

  return (
    <Card>
      <div style={{ marginBottom: "1rem" }}>
        
        {/* VERSÃO SIMPLIFICADA SEM TRUQUES */}
        {car.foto ? (
          <img 
            src={car.foto} 
            alt={car.modelo}
            style={{ 
              width: "100%", 
              height: "200px", 
              objectFit: "cover", 
              borderRadius: "4px",
              border: "2px solid red" // Borda vermelha para veres onde a imagem devia estar
            }} 
          />
        ) : (
          <p style={{color: "red"}}>Sem link de foto no Excel</p>
        )}

      </div>

      <h3>{car.marca} {car.modelo}</h3>
      <p><strong>Ano:</strong> {car.ano}</p>
      <p><strong>Preço:</strong> {car.preco} €</p>
      
      {isLoggedIn && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => onEdit(car)}>Editar</Button>
          <Button onClick={() => onDelete(car.id)} style={{backgroundColor: "red"}}>Apagar</Button>
        </div>
      )}
    </Card>
  );
}
