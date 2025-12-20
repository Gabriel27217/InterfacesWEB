import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"; 
import { useNavigate } from "react-router-dom";

// --- CONFIGURAÇÃO API (COMENTADA PARA POUPAR REQUESTS) ---
// const API_URL = "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/folha1";

export default function LikeButton({ carId, initialLikes = 0 }) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialLikes); 
  const [loading, setLoading] = useState(false);

  // Chave única para o localStorage (guarda se ESTE user deu like)
  const storageKey = user && user.email ? `likes_${user.email}` : null;

  // 1. Sincroniza o contador com o valor inicial (vindo do Context/DB)
  useEffect(() => {
    setCount(initialLikes || 0);
  }, [initialLikes]);

  // 2. Verifica no localStorage se este user JÁ deu like neste carro
  useEffect(() => {
    if (storageKey) {
      const userLikes = JSON.parse(localStorage.getItem(storageKey)) || [];
      if (userLikes.includes(carId)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } else {
      setIsLiked(false);
    }
  }, [carId, storageKey]);

  const handleToggleLike = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // Bloqueio de Login
    if (!isLoggedIn) {
      if(window.confirm("Precisas de fazer login para adicionar aos favoritos. Ir para login?")) {
        navigate("/login");
      }
      return;
    }

    if (!storageKey) return; // Se não houver chave (erro user), não faz nada

    // --- LÓGICA LOCAL (IMEDIATA) ---
    const userLikes = JSON.parse(localStorage.getItem(storageKey)) || [];
    let newCount = count; // Variável temporária para usar na API se fosse ligada

    if (isLiked) {
      // --- REMOVER LIKE ---
      setCount((prev) => Math.max(0, prev - 1)); // Garante que não vai abaixo de 0
      setIsLiked(false);
      newCount = Math.max(0, count - 1);
      
      // Remove o ID do array e guarda
      const newLikesList = userLikes.filter((id) => id !== carId);
      localStorage.setItem(storageKey, JSON.stringify(newLikesList));
      
    } else {
      // --- ADICIONAR LIKE ---
      setCount((prev) => prev + 1);
      setIsLiked(true);
      newCount = count + 1;
      
      // Adiciona o ID ao array e guarda
      userLikes.push(carId);
      localStorage.setItem(storageKey, JSON.stringify(userLikes));
    }
    
    // --- LÓGICA API SHEETY (COMENTADA) ---
    /*
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folha1: { likes: newCount } // Envia o novo valor calculado
        })
      });
      console.log("Like sincronizado com Sheety!");
    } catch (error) {
      console.error("Erro ao gravar like no servidor:", error);
      // Aqui poderias reverter o estado se a API falhasse
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div 
      onClick={handleToggleLike}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "4px", 
        cursor: "pointer",
        userSelect: "none"
      }}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={isLiked ? "#dc2626" : "none"}
        stroke={isLiked ? "#dc2626" : "#666"}
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ transition: "all 0.2s ease" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      
      <span style={{ 
        fontSize: "0.9rem", 
        color: isLiked ? "#dc2626" : "#666", 
        fontWeight: isLiked ? "bold" : "normal" 
      }}>
        {count}
      </span>
    </div>
  );
}
