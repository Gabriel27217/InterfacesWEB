const API_URL =
  process.env.REACT_APP_FAVORITES_API ||
  "https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/favoritos";

export async function getFavorites() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Erro ao obter favoritos (${res.status})`);
  const data = await res.json();
  return data.favoritos || [];
}

export async function createFavorite(fav) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorito: fav }), //  singular
  });
  if (!res.ok) throw new Error(`Erro ao criar favorito (${res.status})`);
  return res.json();
}

export async function deleteFavoriteById(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Erro ao apagar favorito (${res.status})`);
  return true;
}
