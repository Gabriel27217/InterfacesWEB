// URL base da API de pedidos
// Prioriza variável de ambiente REACT_APP_ORDERS_API, senão usa a Sheety nova
const API_URL =
  process.env.REACT_APP_ORDERS_API ||
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/pedidos";

/**
 * GET: Obter todos os pedidos
 * Retorna um array de pedidos da API
 */
export async function getOrders() {
  // Faz fetch à API
  const res = await fetch(API_URL);

  // Se status HTTP não for 200~299 → lança erro
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text(); // tenta ler corpo da resposta
    } catch {}
    throw new Error(`Erro ao obter pedidos (${res.status}) ${details}`);
  }

  // Converte resposta para JSON
  const data = await res.json();

  // Retorna o array de pedidos ou vazio
  return data.pedidos || [];
}

/**
 * CREATE: Criar um novo pedido
 * @param {object} order - objeto do pedido a criar
 * Retorna o pedido criado
 */
export async function createOrder(order) {
  // Sheety espera que o root do POST seja singular: { pedido: { ... } }
  const payload = { pedido: order };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // converte para JSON
  });

  // Erro caso status não seja 2xx
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao criar pedido (${res.status}) ${details}`);
  }

  // Retorna JSON do pedido criado
  return res.json();
}

/**
 * UPDATE: Atualiza um pedido pelo id
 * @param {number|string} id - id do pedido (Sheety rowId)
 * @param {object} order - dados atualizados do pedido
 * Retorna o pedido atualizado
 */
export async function updateOrderById(id, order) {
  // Root singular como a Sheety espera
  const payload = { pedido: order };

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Se houver erro → lança
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao atualizar pedido (${res.status}) ${details}`);
  }

  // Retorna JSON do pedido atualizado
  return res.json();
}