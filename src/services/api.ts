import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';


const API_BASE_URL = 'https://localhost:7115/api/v1';


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 30000,
});


api.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {

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

      console.error('Sem resposta do servidor:', error.request);
      console.error('URL da requisição:', error.config?.url);
      console.error('Método da requisição:', error.config?.method);
      console.error('Código de erro:', error.code);
      

      if (error.code === 'ECONNABORTED') {
        console.error('A conexão foi abortada (timeout)');
      } else if (error.message.includes('certificate')) {
        console.error('Problema com o certificado SSL. Verifique se o servidor está usando um certificado válido.');
      }
    } else {

      console.error('Erro na requisição:', error.message);
      console.error('Detalhes do erro:', error);
    }
    
    return Promise.reject(error);
  }
);

export default api;
