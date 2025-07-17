import api from './api';
import { AutorRequest, AutorResponse, AutorDetalhesResponse, AutorPaginatedResponse } from '../models/autor';

const AUTORES_ENDPOINT = '/Autores';

export const AutoresService = {

  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<AutorPaginatedResponse> => {
    const response = await api.get(`${AUTORES_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },


  getById: async (id: number): Promise<AutorResponse> => {
    const response = await api.get(`${AUTORES_ENDPOINT}/${id}`);
    return response.data;
  },


  getDetalhes: async (id: number): Promise<AutorDetalhesResponse> => {
    const response = await api.get(`${AUTORES_ENDPOINT}/${id}/detalhes`);
    return response.data;
  },


  create: async (autor: AutorRequest): Promise<AutorResponse> => {
    const response = await api.post(AUTORES_ENDPOINT, autor);
    return response.data;
  },


  update: async (id: number, autor: AutorRequest): Promise<void> => {
    await api.put(`${AUTORES_ENDPOINT}/${id}`, autor);
  },


  delete: async (id: number): Promise<void> => {
    await api.delete(`${AUTORES_ENDPOINT}/${id}`);
  }
};


export default AutoresService;
