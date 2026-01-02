// Importação do React e hooks necessários
import React, { useEffect, useMemo, useState, useContext } from "react";

// Importação do hook de autenticação e navegação
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Importação das funções da API de favoritos (Sheety)
import {
  getFavorites, // Vai buscar todos os favoritos
  createFavorite, // Cria um favorito (POST)
  deleteFavoriteById, // Apaga um favorito pelo id (DELETE)
} from "../../api/favoritesApi";

// Importação do contexto dos carros (para recalcular likes globais)
import { CarsContext } from "../../context/CarsContext";

// Componente LikeButton recebe:
// - carId → id do carro (no teu caso é o id/rowId do Sheety)
// - initialLikes → total de likes que vem do CarsContext/lista de carros
export default function LikeButton({ carId, initialLikes = 0 }) {
  // Obtemos info do utilizador que fez login
  const { isLoggedIn, user } = useAuth();

  // Hook do React Router para navegar para o login quando necessário
  const navigate = useNavigate();

  // Função do CarsContext para atualizar os carros/likes depois de alterar favoritos
  const { refreshCars } = useContext(CarsContext);

  // =========================
  //    NORMALIZAÇÃO DO carId
  // =========================

  // Converte carId para número (e memoiza para não recalcular sem necessidade) [web:122]
  const numericCarId = useMemo(() => Number(carId), [carId]);

  // =========================
  //          ESTADOS
  // =========================

  // Se o utilizador já deu like neste carro
  const [isLiked, setIsLiked] = useState(false);

  // Contador de likes visível no UI
  const [count, setCount] = useState(Number(initialLikes) || 0);

  // Bloqueia cliques repetidos enquanto a API está a responder
  const [loading, setLoading] = useState(false);

  // Guarda o id da linha do favorito no Sheety (para apagar depois)
  const [favoriteRowId, setFavoriteRowId] = useState(null);

  // =========================
  //   SINCRONIZAR CONTADOR
  // =========================

  // Sempre que initialLikes mudar (ex.: refreshCars), atualiza o contador local
  useEffect(() => {
    setCount(Number(initialLikes) || 0);
  }, [initialLikes]);

  // =========================
  //   VER SE JÁ TEM LIKE
  // =========================

  // Efeito: verifica na API se este utilizador já deu like neste carro
  useEffect(() => {
    async function loadFavorite() {
      // Se não estiver logado, sem email, ou carId inválido, desliga o like
      if (!isLoggedIn || !user?.email || Number.isNaN(numericCarId)) {
        setIsLiked(false);
        setFavoriteRowId(null);
        return;
      }

      try {
        // Vai buscar favoritos à API
        const favs = await getFavorites();

        // Procura um favorito deste utilizador para este carro
        const found = (favs || []).find(
          (f) =>
            String(f.email || "").toLowerCase() ===
              String(user.email).toLowerCase() &&
            Number(f.carId) === numericCarId
        );

        // Atualiza estado local conforme o resultado
        setIsLiked(!!found);
        setFavoriteRowId(found ? found.id : null);
      } catch (err) {
        // Se falhar o fetch, assume não gostado
        console.error("Erro ao obter favoritos:", err);
        setIsLiked(false);
        setFavoriteRowId(null);
      }
    }

    loadFavorite();
  }, [isLoggedIn, user?.email, numericCarId]);

  // =========================
  //     TOGGLE LIKE (CLICK)
  // =========================

  // Função chamada ao clicar no coração
  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Impede propagar clique para o card (evita ações extra) [web:408]

    // 1) Bloqueio de login: se não houver login, pergunta se quer ir para login
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

    // Validações de segurança
    if (!user?.email) return;
    if (loading) return;
    if (Number.isNaN(numericCarId)) return;

    // Ativa loading para bloquear cliques repetidos
    setLoading(true);

    try {
      if (isLiked) {
        // 2A) Se já estava liked -> remover favorito

        // UI imediato (otimista): diminui contador
        setCount((c) => Math.max(0, c - 1));

        // Apaga favorito na API usando o id da linha
        if (favoriteRowId) await deleteFavoriteById(favoriteRowId);

        // Atualiza estados locais
        setIsLiked(false);
        setFavoriteRowId(null);
      } else {
        // 2B) Se não estava liked -> adicionar favorito

        // UI imediato (otimista): aumenta contador
        setCount((c) => c + 1);

        // Anti-duplicados: confirma se já existe favorito antes de criar
        const favs = await getFavorites();
        const exists = (favs || []).find(
          (f) =>
            String(f.email || "").toLowerCase() ===
              String(user.email).toLowerCase() &&
            Number(f.carId) === numericCarId
        );

        if (exists) {
          // Se já existe, só marca liked e guarda id
          setIsLiked(true);
          setFavoriteRowId(exists.id);
        } else {
          // Se não existe, cria favorito na API
          const created = await createFavorite({
            email: user.email,
            carId: numericCarId, // Guarda o id do carro (rowId do Sheety)
          });

          // Atualiza estados locais com o id devolvido pela API
          setIsLiked(true);
          setFavoriteRowId(created?.favorito?.id ?? null);
        }
      }

      // 3) Recalcula likes globais a partir de favoritos (atualiza a loja toda)
      await refreshCars();
    } catch (err) {
      // Se falhar, desfaz o update otimista do contador (rollback) [web:399]
      console.error("Erro a atualizar favorito:", err);
      setCount(Number(initialLikes) || 0);

      alert(err?.message || "Erro a atualizar favoritos.");
    } finally {
      // Desativa loading
      setLoading(false);
    }
  };

  // =========================
  //       RENDERIZAÇÃO
  // =========================
  return (
    <div
      onClick={handleToggleLike} // Clique chama o toggle
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
      {/* Ícone do coração */}
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

      {/* Contador de likes */}
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
