const API_URL =
  process.env.REACT_APP_CARS_API ||
  "https://api.sheety.co/be4fa2efd3cd7dc007ba3247d051cbe4/showcarroRom/carros";

// ---- GET ALL ----
export async function getCars() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Erro ao obter carros (${res.status})`);
  const data = await res.json();
  return data.carros || [];
}

// ---- CREATE ----
export async function createCar(car) {
  const payload = { carros: car };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Erro ao adicionar carro (${res.status})`);
  return res.json();
}

// ---- UPDATE ----
export async function updateCarById(id, car) {
  const payload = { carros: car };
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Erro ao atualizar carro (${res.status})`);
  return res.json();
}

// ---- DELETE ----
export async function deleteCarById(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Erro ao apagar carro (${res.status})`);
  return true;
}
