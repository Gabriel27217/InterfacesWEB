// URL base da API
// Uso a variável de ambiente
// Se não existir, usa o link direto da API (Sheety)
const API_URL =
  process.env.REACT_APP_CARS_API ||
  "https://api.sheety.co/483c093e1fe54f308dfe7b0dbafdf21a/dataCarros/carros";

// =========================
//        GET ALL
// =========================

// Função assíncrona que vai buscar todos os carros à API
export async function getCars() {
  // Faz o pedido HTTP GET à API
  const res = await fetch(API_URL);

  // Verifica se a resposta não foi executada com sucesso
  // Se ocorrer erro, lança uma exceção com o código HTTP e detalhes do servidor
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao obter carros (${res.status}) ${details}`);
  }

  // Converte a resposta para JSON
  const data = await res.json();

  // Retorna o array de carros
  // Caso não exista, retorna um array vazio para evitar erros
  return data.carros || [];
}

// =========================
//        CREATE
// =========================

// Função responsável por criar/adicionar um novo carro
export async function createCar(car) {
  // Estrutura do payload conforme exigido pela API Sheety
  // Sheety espera o registo dentro de uma root singular (ex.: "email" para /emails) [web:1]
  const payload = { carro: car };

  // Faz o pedido HTTP POST para criar um novo registo
  const res = await fetch(API_URL, {
    method: "POST", // Método HTTP para criação
    headers: { "Content-Type": "application/json" }, // Define o tipo de dados enviados
    body: JSON.stringify(payload), // Converte o objeto JS para JSON
  });

  // Verifica se ocorreu algum erro na criação
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao adicionar carro (${res.status}) ${details}`);
  }

  // Retorna a resposta da API com o carro criado
  return res.json();
}

// =========================
//        UPDATE
// =========================

// Função responsável por atualizar um carro existente através do seu ID
export async function updateCarById(id, car) {
  // Payload com os novos dados do carro (root singular exigida pelo Sheety) [web:1]
  const payload = { carro: car };

  // Faz o pedido HTTP PUT para atualizar o carro específico
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT", // Método HTTP para atualização
    headers: { "Content-Type": "application/json" }, // Tipo de conteúdo enviado
    body: JSON.stringify(payload), // Converte os dados para JSON
  });

  // Verifica se a atualização falhou
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao atualizar carro (${res.status}) ${details}`);
  }

  // Retorna a resposta da API com os dados atualizados
  return res.json();
}

// =========================
//        DELETE
// =========================

// Função responsável por apagar um carro através do seu ID
export async function deleteCarById(id) {
  // Faz o pedido HTTP DELETE para remover o carro
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  // Verifica se ocorreu erro ao apagar
  if (!res.ok) {
    let details = "";
    try {
      details = await res.text();
    } catch {}
    throw new Error(`Erro ao apagar carro (${res.status}) ${details}`);
  }

  // Retorna true caso a operação tenha sido executada com sucesso
  return true;
}
