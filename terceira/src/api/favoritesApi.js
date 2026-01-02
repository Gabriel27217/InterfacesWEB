const API_URL =
  process.env.REACT_APP_FAVORITES_API ||
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/favoritos";

// --------------------------------------------------
// GET FAVORITOS
// --------------------------------------------------
export async function getFavorites() {
  const res = await fetch(API_URL);

  // Verifica se a resposta foi OK
  if (!res.ok) throw new Error(`Erro ao obter favoritos (${res.status})`);

  // Extrai dados JSON
  const data = await res.json();

  // Retorna array de favoritos ou array vazio
  return data.favoritos || [];
}

// --------------------------------------------------
// CREATE FAVORITO
// --------------------------------------------------
export async function createFavorite(fav) {
  // Validação: carId é obrigatório
  if (fav?.carId == null) {
    throw new Error("createFavorite: carId em falta");
  }

  // Faz POST para criar favorito
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorito: fav }), // API espera { favorito: {...} }
  });

  // Verifica se a criação foi OK
  if (!res.ok) throw new Error(`Erro ao criar favorito (${res.status})`);

  // Retorna dados da criação
  return res.json();
}

// --------------------------------------------------
// DELETE FAVORITO
// --------------------------------------------------
export async function deleteFavoriteById(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  // Verifica se a eliminação foi OK
  if (!res.ok) throw new Error(`Erro ao apagar favorito (${res.status})`);

  // Retorna true se eliminado com sucesso
  return true;
}