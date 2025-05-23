import axios from 'axios';

const api = axios.create({
  // URL da API Django
  baseURL: 'http://localhost:8000/api',
  headers: {
    // Não definimos Content-Type global para permitir que o Axios configure automaticamente
    // para uploads de arquivos (multipart/form-data)
  },
});

// Adiciona token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@CDGProducao:token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Importante: Define o Content-Type como 'application/json' apenas para dados que não são FormData
    if (!(config.data instanceof FormData) && config.method !== 'get') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Se for FormData, deixamos o navegador/axios definir o Content-Type automaticamente
    // para que inclua o boundary necessário para o multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Depuração para API POST requests
    if (config.method === 'post') {
      // Mostrar a URL completa com baseURL e path
      console.log(`API Request para ${config.baseURL}${config.url}:`, config.data);
      console.log('Headers:', config.headers);
      
      // Para dados do tipo FormData, fazer log de cada campo
      if (config.data instanceof FormData) {
        console.log('FormData contém:');
        for (let [key, value] of config.data.entries()) {
          if (key === 'arquivo') {
            console.log(`${key}: Arquivo (${value.name}, ${value.type}, ${value.size} bytes)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Unauthorized), podemos redirecionar para a tela de login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@CDGProducao:user');
      localStorage.removeItem('@CDGProducao:token');
      // O redirecionamento pode ser feito aqui ou no componente
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
