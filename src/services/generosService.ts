import api from './api';
import { GeneroRequest, GeneroResponse, GeneroDetalhesResponse, GeneroPaginatedResponse } from '../models/genero';

const GENEROS_ENDPOINT = '/Generos';

export const GenerosService = {
  // Obter todos os gêneros com paginação
  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<GeneroPaginatedResponse> => {
    const response = await api.get(`${GENEROS_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Obter gênero por ID
  getById: async (id: number): Promise<GeneroResponse> => {
    const response = await api.get(`${GENEROS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Obter detalhes do gênero (incluindo livros)
  getDetalhes: async (id: number): Promise<GeneroDetalhesResponse> => {
    try {
      const response = await api.get(`${GENEROS_ENDPOINT}/${id}/detalhes`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter detalhes do gênero ${id}:`, error);
      throw error;
    }
  },

  // Criar novo gênero
  create: async (genero: GeneroRequest): Promise<GeneroResponse> => {
    const response = await api.post(GENEROS_ENDPOINT, genero);
    return response.data;
  },

  // Atualizar gênero existente
  update: async (id: number, genero: GeneroRequest): Promise<void> => {
    await api.put(`${GENEROS_ENDPOINT}/${id}`, genero);
  },

  // Excluir gênero
  delete: async (id: number): Promise<void> => {
    await api.delete(`${GENEROS_ENDPOINT}/${id}`);
  }
};

export default GenerosService;
