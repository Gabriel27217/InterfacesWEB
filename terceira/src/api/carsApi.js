const API_URL =
  process.env.REACT_APP_CARS_API ||
  "https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/carros";

// GET
export async function getCars() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    let details = "";
    try { details = await res.text(); } catch {}
    throw new Error(`Erro ao obter carros (${res.status}) ${details}`);
  }
  const data = await res.json();
  return data.carros || [];
}

// CREATE
export async function createCar(car) {
  const payload = { carro: car }; // root singular [web:177]

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let details = "";
    try { details = await res.text(); } catch {}
    throw new Error(`Erro ao adicionar carro (${res.status}) ${details}`);
  }

  return res.json();
}

// UPDATE
export async function updateCarById(id, car) {
  const payload = { carro: car }; // root singular [web:177]

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let details = "";
    try { details = await res.text(); } catch {}
    throw new Error(`Erro ao atualizar carro (${res.status}) ${details}`);
  }

  return res.json();
}

// DELETE
export async function deleteCarById(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    let details = "";
    try { details = await res.text(); } catch {}
    throw new Error(`Erro ao apagar carro (${res.status}) ${details}`);
  }

  return true;
}
