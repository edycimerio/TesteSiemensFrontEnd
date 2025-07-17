import api from './api';
import { LivroRequest, LivroResponse, LivroDetalhesResponse, LivroPaginatedResponse } from '../models/livro';

const LIVROS_ENDPOINT = '/Livros';

export const LivrosService = {

  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },


  getById: async (id: number): Promise<LivroResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/${id}`);
    return response.data;
  },


  getDetalhes: async (id: number): Promise<LivroDetalhesResponse> => {
    try {
      const response = await api.get(`${LIVROS_ENDPOINT}/${id}/detalhes`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter detalhes do livro ${id}:`, error);
      throw error;
    }
  },


  getByGenero: async (generoId: number, pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/porGenero/${generoId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },


  getByAutor: async (autorId: number, pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/porAutor/${autorId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },


  pesquisar: async (termo: string, pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/pesquisa?termo=${termo}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },


  create: async (livro: LivroRequest): Promise<LivroResponse> => {
    const response = await api.post(LIVROS_ENDPOINT, livro);
    return response.data;
  },


  update: async (id: number, livro: LivroRequest): Promise<void> => {
    await api.put(`${LIVROS_ENDPOINT}/${id}`, livro);
  },


  delete: async (id: number): Promise<void> => {
    await api.delete(`${LIVROS_ENDPOINT}/${id}`);
  }
};

export default LivrosService;
