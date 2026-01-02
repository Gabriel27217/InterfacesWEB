// URL base da API de clientes
// Uso a variável de ambiente
// Se não existir, usa o link direto da API (Sheety)
const API_URL =
  process.env.REACT_APP_CLIENTS_API ||
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/clientes";

// =========================
//          GET
// =========================

// Função assíncrona que vai buscar todos os clientes à API
export async function getClients() {
  // Faz o pedido HTTP GET à API
  const res = await fetch(API_URL);

  // Verifica se a resposta não foi executada com sucesso
  // Se ocorrer erro, lança uma exceção com o código HTTP
  if (!res.ok) throw new Error(`Erro ao obter clientes (${res.status})`);

  // Converte a resposta para JSON
  const data = await res.json();

  // Retorna o array de clientes
  // Caso não exista, retorna um array vazio para evitar erros
  return data.clientes || [];
}

// =========================
//        CREATE
// =========================

// Função responsável por criar/adicionar um novo cliente
export async function createClient(client) {
  // Estrutura do payload conforme exigido pela API Sheety
  // Sheety espera o registo dentro de uma root singular com o nome da sheet/recurso [web:1]
  const payload = { cliente: client };

  // Faz o pedido HTTP POST para criar um novo registo
  const res = await fetch(API_URL, {
    method: "POST", // Método HTTP para criação
    headers: { "Content-Type": "application/json" }, // Define o tipo de dados enviados
    body: JSON.stringify(payload), // Converte o objeto JS para JSON
  });

  // Verifica se ocorreu algum erro na criação
  if (!res.ok) throw new Error(`Erro ao adicionar cliente (${res.status})`);

  // Retorna a resposta da API com o cliente criado
  return res.json();
}

// =========================
//        UPDATE
// =========================

// Função responsável por atualizar um cliente existente através do seu ID
export async function updateClientById(id, client) {
  // Payload com os novos dados do cliente
  // Sheety espera root singular com o nome da sheet/recurso [web:1]
  const payload = { cliente: client };

  // Faz o pedido HTTP PUT para atualizar o cliente específico
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT", // Método HTTP para atualização
    headers: { "Content-Type": "application/json" }, // Tipo de conteúdo enviado
    body: JSON.stringify(payload), // Converte os dados para JSON
  });

  // Verifica se a atualização falhou
  if (!res.ok) throw new Error(`Erro ao atualizar cliente (${res.status})`);

  // Retorna a resposta da API com os dados atualizados
  return res.json();
}

// =========================
//        DELETE
// =========================

// Função responsável por apagar um cliente através do seu ID
export async function deleteClientById(id) {
  // Faz o pedido HTTP DELETE para remover o cliente
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  // Verifica se ocorreu erro ao apagar
  if (!res.ok) throw new Error(`Erro ao apagar cliente (${res.status})`);

  // Retorna true caso a operação tenha sido executada com sucesso
  return true;
}
