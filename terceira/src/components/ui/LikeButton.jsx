import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"; 
import { useNavigate } from "react-router-dom";

export default function LikeButton({ carId, initialLikes = 0 }) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  // --- CONFIGURAÇÃO API (FUTURO - DESCOMENTAR PARA LIGAR) ---
  // const API_URL = `https://api.sheety.co/SEU_ID_AQUI/showcarroRom/folha1/${carId}`;

  // Cria uma chave única baseada no email do user logado
  // Se não houver user, a chave é nula (não guarda)
  const storageKey = user && user.email ? `likes_${user.email}` : null;

  // Efeito: Verificar se ESTE user já deu like
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

    // 1. Bloqueio de Login
    if (!isLoggedIn) {
      if(window.confirm("Precisas de fazer login para adicionar aos favoritos. Ir para login?")) {
        navigate("/login");
      }
      return;
    }

    // Se por algum motivo não tivermos chave (erro no user), não faz nada
    if (!storageKey) return;

    // 2. Lógica Local (Imediata)
    const userLikes = JSON.parse(localStorage.getItem(storageKey)) || [];
    let newCount = count;

    if (isLiked) {
      // REMOVER LIKE
      newCount = count - 1;
      setCount(newCount);
      setIsLiked(false);
      
      const newLikes = userLikes.filter((id) => id !== carId);
      localStorage.setItem(storageKey, JSON.stringify(newLikes));
      
    } else {
      // ADICIONAR LIKE
      newCount = count + 1;
      setCount(newCount);
      setIsLiked(true);
      
      userLikes.push(carId);
      localStorage.setItem(storageKey, JSON.stringify(userLikes));
    }
    
    // --- LÓGICA API SHEETY (FUTURO - DESCOMENTAR PARA LIGAR) ---
    /*
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folha1: { likes: newCount } // Garante que tens a coluna 'likes' no Excel
        })
      });
      console.log("Like sincronizado com Sheety!");
    } catch (error) {
      console.error("Erro ao gravar like no servidor:", error);
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
