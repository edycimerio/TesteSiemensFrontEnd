import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Definindo a URL base da API
const API_BASE_URL = 'http://localhost:7115/api/v1';

// Criando uma instância do Axios com configurações padrão
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Aqui podemos adicionar tokens de autenticação, se necessário
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Erro de validação:', data);
          break;
        case 404:
          console.error('Recurso não encontrado:', data);
          break;
        case 500:
          console.error('Erro interno do servidor:', data);
          break;
        default:
          console.error(`Erro ${status}:`, data);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('Erro na requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
