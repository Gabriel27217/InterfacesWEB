//const API_URL =
  //process.env.REACT_APP_ORDERS_API ||
  //"https://api.sheety.co/3156a1682b37bad7288f630932369003/dataCarros/pedidos";

const API_URL =
  process.env.REACT_APP_ORDERS_API ||
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/pedidos";  

// GET
export async function getOrders() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Erro ao obter pedidos (${res.status})`);
  const data = await res.json();
  return data.pedidos || [];
}

// CREATE
export async function createOrder(order) {
  const payload = { pedido: order };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao criar pedido (${res.status}) ${details}`);
  }

  return res.json();
}

// UPDATE
export async function updateOrderById(id, order) {
  const payload = { pedido: order };

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao atualizar pedido (${res.status}) ${details}`);
  }

  return res.json();
}
