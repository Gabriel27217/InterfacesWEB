//const API_URL =
  //process.env.REACT_APP_CLIENTS_API ||
  //"https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/clientes";

const API_URL =
  process.env.REACT_APP_CLIENTS_API ||
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/clientes";  

// ---- GET ----
export async function getClients() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Erro ao obter clientes (${res.status})`);
  const data = await res.json();
  return data.clientes || [];
}

// ---- CREATE ----
export async function createClient(client) {
  // ✅ Sheety quer root property SINGULAR (cliente) [page:2]
  const payload = { cliente: client };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Erro ao adicionar cliente (${res.status})`);
  return res.json();
}

// ---- UPDATE ----
export async function updateClientById(id, client) {
  // ✅ Sheety quer root property SINGULAR (cliente) [page:2]
  const payload = { cliente: client };

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) 
    throw new Error(`Erro ao atualizar cliente (${res.status})`);
  return res.json();
}
// ---- DELETE ----
export async function deleteClientById(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Erro ao apagar cliente (${res.status})`);
  return true;
}
