// Importação do React e dos hooks necessários
import React, { useEffect, useMemo, useState, useContext } from "react";

// Importação do hook de navegação do React Router
import { useNavigate } from "react-router-dom";

// Importação de componentes de carros e clientes
import CarForm from "../components/cars/CarForm";
import CarList from "../components/cars/CarList";
import ClientList from "../components/clients/ClientList";

// Importação de componentes UI
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Importação do hook de autenticação
import { useAuth } from "../hooks/useAuth";

// Importação das funções da API para pedidos e carros
import { getOrders, updateOrderById } from "../api/ordersApi";
import { updateCarById } from "../api/carsApi";

// Importação do contexto dos carros (para refrescar a loja após alterações)
import { CarsContext } from "../context/CarsContext";

export default function Backoffice() {
  // Acede ao estado de autenticação
  const { isLoggedIn, user } = useAuth();

  // Hook para navegação programática
  const navigate = useNavigate();

  // Acede à função de refresh dos carros no contexto (para atualizar o estado global)
  const { refreshCars } = useContext(CarsContext);

  // Estado local para guardar o carro que está a ser editado
  const [editingCar, setEditingCar] = useState(null);

  // =========================
  //          PEDIDOS
  // =========================

  // Estado que guarda a lista de pedidos
  const [orders, setOrders] = useState([]);

  // Estado de carregamento dos pedidos
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Estado para guardar erros ao carregar pedidos
  const [ordersError, setOrdersError] = useState(null);

  // Estado do “separador” de pedidos (em curso / concluído)
  const [tab, setTab] = useState("em_curso");

  // =========================
  //       PROTEÇÃO DE ROTA
  // =========================

  // Verifica se o utilizador tem permissões de admin
  const isAdmin = isLoggedIn && user && user.role === "admin";
  const hasAccess = isAdmin;

  // =========================
  //    CARREGAR PEDIDOS (API)
  // =========================

  // Função que carrega/atualiza os pedidos a partir da API
  async function refreshOrders() {
    try {
      // Inicia loading e limpa erros
      setOrdersLoading(true);
      setOrdersError(null);

      // Vai buscar todos os pedidos à API
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      // Guarda mensagem de erro e limpa pedidos para evitar mostrar dados antigos
      setOrdersError(e?.message || "Erro ao carregar pedidos");
      setOrders([]);
    } finally {
      // Termina o loading
      setOrdersLoading(false);
    }
  }

  // useEffect executado quando o utilizador tem acesso (admin)
  useEffect(() => {
    if (hasAccess) refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess]);

  // Filtra pedidos por estado (aba selecionada)
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => (o.estado || "em_curso") === tab);
  }, [orders, tab]);

  // Função auxiliar: tenta converter a string JSON da coluna "itens"
  function parseItens(order) {
    try {
      return JSON.parse(order.itens || "[]");
    } catch {
      return [];
    }
  }

  // =========================
  //   MARCAR PEDIDO COMO PAGO
  // =========================

  async function handleMarkPaid(order) {
    // Confirmação antes de alterar o pedido e os carros
    if (!window.confirm(`Confirmar pagamento do Pedido #${order.id}?`)) return;

    try {
      // 1) Atualiza o pedido para "concluido"
      await updateOrderById(order.id, { ...order, estado: "concluido" });

      // 2) Lê os itens do pedido
      const itens = parseItens(order);

      // 3) Marca os carros do pedido como "vendido"
      if (itens.length > 0) {
        await Promise.all(
          itens.map((c) => updateCarById(c.id, { status: "vendido" }))
        );
      }

      // 4) Atualiza a lista de pedidos no backoffice
      await refreshOrders();

      // 5) Atualiza a lista de carros na app (loja)
      await refreshCars();

      alert(
        `Pedido #${order.id} marcado como pago e carros marcados como vendidos.`
      );
    } catch (e) {
      console.error("Erro ao concluir pedido:", e);
      alert(e?.message || "Erro ao concluir pedido");
    }
  }

  // =========================
  //       FUNÇÃO DE EDITAR CARRO
  // =========================

  const handleEditCar = (car) => {
    // Define o carro a ser editado
    setEditingCar(car);

    // Faz scroll suave para o topo do formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  //        ACESSO NEGADO
  // =========================

  // Se o utilizador não estiver logado ou não for admin, mostra mensagem
  if (!hasAccess) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#dc2626" }}>
        <h2>Acesso Negado</h2>
        <p>Esta página é exclusiva para administradores.</p>
        <p>Maloto!! Assin:Cebolinha</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Voltar à Loja
        </button>
      </div>
    );
  }

  // =========================
  //       RENDERIZAÇÃO
  // =========================
  return (
    <div>
      <h1>Backoffice — Gestão</h1>

      {/* ===== GESTÃO DE CARROS ===== */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Carros</h2>

        {/* Formulário para criar ou editar carros */}
        <CarForm
          editingCar={editingCar} // Carro a ser editado (ou null para criar novo)
          onFinish={() => setEditingCar(null)} // Limpa estado após submissão
        />

        {/* Lista de carros com botão de editar */}
        <CarList onEdit={handleEditCar} />
      </section>

      {/* ===== GESTÃO DE CLIENTES ===== */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Clientes</h2>

        {/* Lista de clientes */}
        <ClientList />
      </section>

      {/* ===== GESTÃO DE PEDIDOS ===== */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Pedidos</h2>

        {/* Botões para alternar separadores e atualizar */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <Button
            type="button"
            onClick={() => setTab("em_curso")}
            style={{
              backgroundColor: tab === "em_curso" ? "#2563eb" : "#6c757d",
            }}
          >
            Em curso
          </Button>

          <Button
            type="button"
            onClick={() => setTab("concluido")}
            style={{
              backgroundColor: tab === "concluido" ? "#2563eb" : "#6c757d",
            }}
          >
            Concluídos
          </Button>

          <Button
            type="button"
            onClick={refreshOrders}
            style={{ marginLeft: "auto" }}
          >
            Atualizar
          </Button>
        </div>

        {/* Estados de loading/erro */}
        {ordersLoading && <p>A carregar pedidos...</p>}
        {ordersError && <p style={{ color: "red" }}>{ordersError}</p>}

        {/* Caso não existam pedidos na aba selecionada */}
        {!ordersLoading && filteredOrders.length === 0 && (
          <p>Sem pedidos nesta categoria.</p>
        )}

        {/* Lista de pedidos */}
        {filteredOrders.map((order) => {
          // Converte itens do pedido para array de objetos
          const itens = parseItens(order);
          const first = itens[0];

          return (
            <Card key={order.id} style={{ padding: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {/* Miniatura do primeiro item */}
                <div
                  style={{
                    width: 80,
                    height: 60,
                    background: "#eee",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  {first?.foto ? (
                    <img
                      src={first.foto}
                      alt={first.modelo || "carro"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>

                {/* Info do pedido */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <strong>Pedido #{order.id}</strong>
                    <span style={{ opacity: 0.8 }}>{order.estado}</span>
                  </div>

                  <div style={{ opacity: 0.85, marginTop: 4 }}>
                    Cliente: {order.clienteEmail}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    {itens.length === 0 ? (
                      <div style={{ fontSize: "0.95rem", opacity: 0.75 }}>
                        (Sem itens gravados — confirma a coluna "itens" na sheet)
                      </div>
                    ) : (
                      itens.map((i) => (
                        <div key={i.id} style={{ fontSize: "0.95rem" }}>
                          {i.marca} {i.modelo} × {i.quantity}
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ marginTop: 6, fontWeight: 600 }}>
                    Total: {Number(order.total || 0).toFixed(2)} €
                  </div>
                </div>

                {/* Ações */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {order.estado !== "concluido" && (
                    <Button type="button" onClick={() => handleMarkPaid(order)}>
                      Marcar como pago
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
