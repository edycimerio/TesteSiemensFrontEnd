import api from './api';
import { 
  LivroGeneroRequest, 
  LivroGeneroResponse, 
  LivroGeneroDetalhesResponse, 
  LivroGeneroPaginatedResponse 
} from '../models/livroGenero';

const LIVRO_GENEROS_ENDPOINT = '/LivroGeneros';

export const LivroGeneroService = {


  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<LivroGeneroPaginatedResponse> => {
    const response = await api.get<LivroGeneroPaginatedResponse>(
      `${LIVRO_GENEROS_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },


  getDetalhes: async (id: number): Promise<LivroGeneroDetalhesResponse> => {
    const response = await api.get<LivroGeneroDetalhesResponse>(`${LIVRO_GENEROS_ENDPOINT}/${id}`);
    return response.data;
  },


  getByLivro: async (livroId: number): Promise<LivroGeneroResponse[]> => {
    const response = await api.get<LivroGeneroResponse[]>(`${LIVRO_GENEROS_ENDPOINT}/livro/${livroId}`);
    return response.data;
  },


  getByGenero: async (generoId: number): Promise<LivroGeneroResponse[]> => {
    const response = await api.get<LivroGeneroResponse[]>(`${LIVRO_GENEROS_ENDPOINT}/genero/${generoId}`);
    return response.data;
  },


  create: async (livroGenero: LivroGeneroRequest): Promise<LivroGeneroResponse> => {
    const response = await api.post<LivroGeneroResponse>(LIVRO_GENEROS_ENDPOINT, livroGenero);
    return response.data;
  },


  update: async (id: number, livroGenero: LivroGeneroRequest): Promise<LivroGeneroResponse> => {
    const response = await api.put<LivroGeneroResponse>(`${LIVRO_GENEROS_ENDPOINT}/${id}`, livroGenero);
    return response.data;
  },


  delete: async (id: number): Promise<void> => {
    await api.delete(`${LIVRO_GENEROS_ENDPOINT}/${id}`);
  },


  associarGenerosAoLivro: async (livroId: number, generoIds: number[]): Promise<void> => {
    await api.post(`${LIVRO_GENEROS_ENDPOINT}/livro/${livroId}/generos`, { generoIds });
  },


  associarLivrosAoGenero: async (generoId: number, livroIds: number[]): Promise<void> => {
    await api.post(`${LIVRO_GENEROS_ENDPOINT}/genero/${generoId}/livros`, { livroIds });
  },


  removerGenerosDoLivro: async (livroId: number): Promise<void> => {
    await api.delete(`${LIVRO_GENEROS_ENDPOINT}/livro/${livroId}/generos`);
  },


  removerLivrosDoGenero: async (generoId: number): Promise<void> => {
    await api.delete(`${LIVRO_GENEROS_ENDPOINT}/genero/${generoId}/livros`);
  }
};


export default LivroGeneroService;
