// Importa o React (biblioteca principal) e ReactDOM para manipular o DOM
import React from "react";
import ReactDOM from "react-dom/client";

// Importa o componente principal da aplicação
import App from "./App";

// Importa o CSS global
import "./global.css";

// Seleciona o elemento root no HTML e cria a raiz do React
// 'root' é o div com id="root" no index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderiza a aplicação dentro do root
root.render(
  // React.StrictMode é usado apenas em desenvolvimento para detectar problemas
  <React.StrictMode>
    <App />  {/* Componente principal da app */}
  </React.StrictMode>
);