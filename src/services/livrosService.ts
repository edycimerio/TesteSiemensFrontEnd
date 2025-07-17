import api from './api';
import { LivroRequest, LivroResponse, LivroDetalhesResponse, LivroPaginatedResponse } from '../models/livro';

const LIVROS_ENDPOINT = '/Livros';

export const LivrosService = {
  // Obter todos os livros com paginação
  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Obter livro por ID
  getById: async (id: number): Promise<LivroResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Obter detalhes do livro
  getDetalhes: async (id: number): Promise<LivroDetalhesResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/${id}/detalhes`);
    return response.data;
  },

  // Obter livros por gênero
  getByGenero: async (generoId: number, pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/porGenero/${generoId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Obter livros por autor
  getByAutor: async (autorId: number, pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/porAutor/${autorId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Pesquisar livros por termo
  pesquisar: async (termo: string, pageNumber: number = 1, pageSize: number = 10): Promise<LivroPaginatedResponse> => {
    const response = await api.get(`${LIVROS_ENDPOINT}/pesquisa?termo=${termo}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Criar novo livro
  create: async (livro: LivroRequest): Promise<LivroResponse> => {
    const response = await api.post(LIVROS_ENDPOINT, livro);
    return response.data;
  },

  // Atualizar livro existente
  update: async (id: number, livro: LivroRequest): Promise<void> => {
    await api.put(`${LIVROS_ENDPOINT}/${id}`, livro);
  },

  // Excluir livro
  delete: async (id: number): Promise<void> => {
    await api.delete(`${LIVROS_ENDPOINT}/${id}`);
  }
};

export default LivrosService;
