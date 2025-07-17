import api from './api';
import { GeneroRequest, GeneroResponse, GeneroDetalhesResponse, GeneroPaginatedResponse } from '../models/genero';

const GENEROS_ENDPOINT = '/Generos';

export const GenerosService = {

  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<GeneroPaginatedResponse> => {
    const response = await api.get(`${GENEROS_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },


  getById: async (id: number): Promise<GeneroResponse> => {
    const response = await api.get(`${GENEROS_ENDPOINT}/${id}`);
    return response.data;
  },


  getDetalhes: async (id: number): Promise<GeneroDetalhesResponse> => {
    try {
      const response = await api.get(`${GENEROS_ENDPOINT}/${id}/detalhes`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter detalhes do gênero ${id}:`, error);
      throw error;
    }
  },


  create: async (genero: GeneroRequest): Promise<GeneroResponse> => {
    const response = await api.post(GENEROS_ENDPOINT, genero);
    return response.data;
  },


  update: async (id: number, genero: GeneroRequest): Promise<void> => {
    await api.put(`${GENEROS_ENDPOINT}/${id}`, genero);
  },


  delete: async (id: number): Promise<void> => {
    await api.delete(`${GENEROS_ENDPOINT}/${id}`);
  }
};

export default GenerosService;
