// Função para registrar métricas de performance
// 'onPerfEntry' é uma função callback que será chamada com os valores das métricas
const reportWebVitals = onPerfEntry => {
  // Verifica se foi passada uma função válida
  if (onPerfEntry && onPerfEntry instanceof Function) {
    
    // Importa dinamicamente o pacote 'web-vitals', evitando carregar o pacote se não for necessário
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      
      // Cada uma destas funções mede uma métrica de performance:
      // CLS  → Cumulative Layout Shift (mudanças de layout inesperadas)
      // FID  → First Input Delay (tempo de resposta à primeira interação)
      // FCP  → First Contentful Paint (tempo até o primeiro conteúdo ser exibido)
      // LCP  → Largest Contentful Paint (tempo até o maior conteúdo ser exibido)
      // TTFB → Time To First Byte (tempo até o primeiro byte do servidor)
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Exporta a função para que possa ser usada em index.js ou App.js
export default reportWebVitals;