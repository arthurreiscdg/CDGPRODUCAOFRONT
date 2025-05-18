import axios from 'axios';

const api = axios.create({
  // Substitua pela URL da sua API
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Unauthorized), podemos redirecionar para a tela de login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@CDGProducao:user');
      localStorage.removeItem('@CDGProducao:token');
      // O redirecionamento pode ser feito aqui ou no componente
    }
    
    return Promise.reject(error);
  }
);

export default api;
