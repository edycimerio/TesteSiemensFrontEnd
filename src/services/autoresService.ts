import api from './api';
import { AutorRequest, AutorResponse, AutorDetalhesResponse, AutorPaginatedResponse } from '../models/autor';

const AUTORES_ENDPOINT = '/Autores';

export const AutoresService = {
  // Obter todos os autores com paginação
  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<AutorPaginatedResponse> => {
    const response = await api.get(`${AUTORES_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Obter autor por ID
  getById: async (id: number): Promise<AutorResponse> => {
    const response = await api.get(`${AUTORES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Obter detalhes do autor (incluindo livros)
  getDetalhes: async (id: number): Promise<AutorDetalhesResponse> => {
    const response = await api.get(`${AUTORES_ENDPOINT}/${id}/detalhes`);
    return response.data;
  },

  // Criar novo autor
  create: async (autor: AutorRequest): Promise<AutorResponse> => {
    const response = await api.post(AUTORES_ENDPOINT, autor);
    return response.data;
  },

  // Atualizar autor existente
  update: async (id: number, autor: AutorRequest): Promise<void> => {
    await api.put(`${AUTORES_ENDPOINT}/${id}`, autor);
  },

  // Excluir autor
  delete: async (id: number): Promise<void> => {
    await api.delete(`${AUTORES_ENDPOINT}/${id}`);
  }
};

// Mantendo a exportação padrão para compatibilidade com código existente
export default AutoresService;
