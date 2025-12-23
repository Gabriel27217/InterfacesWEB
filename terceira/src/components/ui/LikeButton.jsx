import React, { useEffect, useMemo, useState, useContext } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import {
  getFavorites,
  createFavorite,
  deleteFavoriteById,
} from "../../api/favoritesApi";
import { CarsContext } from "../../context/CarsContext";

export default function LikeButton({ carId, initialLikes = 0 }) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { refreshCars } = useContext(CarsContext);

  const numericCarId = useMemo(() => Number(carId), [carId]);

  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(Number(initialLikes) || 0);
  const [loading, setLoading] = useState(false);
  const [favoriteRowId, setFavoriteRowId] = useState(null);

  // contador vem do CarsContext
  useEffect(() => {
    setCount(Number(initialLikes) || 0);
  }, [initialLikes]);

  // ver se este user já deu like neste carro
  useEffect(() => {
    async function loadFavorite() {
      if (!isLoggedIn || !user?.email || Number.isNaN(numericCarId)) {
        setIsLiked(false);
        setFavoriteRowId(null);
        return;
      }

      try {
        const favs = await getFavorites();
        const found = (favs || []).find(
          (f) =>
            String(f.email || "").toLowerCase() === String(user.email).toLowerCase() &&
            Number(f.carId) === numericCarId // Caminho A: carId = car.id (Sheety rowId) 
        );

        setIsLiked(!!found);
        setFavoriteRowId(found ? found.id : null);
      } catch (err) {
        console.error("Erro ao obter favoritos:", err);
        setIsLiked(false);
        setFavoriteRowId(null);
      }
    }

    loadFavorite();
  }, [isLoggedIn, user?.email, numericCarId]);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      if (
        window.confirm(
          "Precisas de fazer login para adicionar aos favoritos. Ir para login?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    if (!user?.email) return;
    if (loading) return;
    if (Number.isNaN(numericCarId)) return;

    setLoading(true);
    try {
      if (isLiked) {
        // UI imediato
        setCount((c) => Math.max(0, c - 1));

        // remover favorito
        if (favoriteRowId) await deleteFavoriteById(favoriteRowId);
        setIsLiked(false);
        setFavoriteRowId(null);
      } else {
        // UI imediato
        setCount((c) => c + 1);

        // anti-duplicados
        const favs = await getFavorites();
        const exists = (favs || []).find(
          (f) =>
            String(f.email || "").toLowerCase() === String(user.email).toLowerCase() &&
            Number(f.carId) === numericCarId
        );

        if (exists) {
          setIsLiked(true);
          setFavoriteRowId(exists.id);
        } else {
          const created = await createFavorite({
            email: user.email,
            carId: numericCarId, // Caminho A: guarda o id do Sheety [web:177]
          });
          setIsLiked(true);
          setFavoriteRowId(created?.favorito?.id ?? null);
        }
      }

      // recalcula likes globais a partir de favoritos
      await refreshCars();
    } catch (err) {
      console.error("Erro a atualizar favorito:", err);

      // se falhar, desfaz o update otimista do contador
      setCount(Number(initialLikes) || 0);

      alert(err?.message || "Erro a atualizar favoritos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleToggleLike}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        cursor: loading ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: loading ? 0.6 : 1,
      }}
      title={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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

      <span
        style={{
          fontSize: "0.9rem",
          color: isLiked ? "#dc2626" : "#666",
          fontWeight: isLiked ? "bold" : "normal",
        }}
      >
        {count}
      </span>
    </div>
  );
}
