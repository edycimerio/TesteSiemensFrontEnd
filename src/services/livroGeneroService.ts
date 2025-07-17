import api from './api';
import { 
  LivroGeneroRequest, 
  LivroGeneroResponse, 
  LivroGeneroDetalhesResponse, 
  LivroGeneroPaginatedResponse 
} from '../models/livroGenero';

const LIVRO_GENEROS_ENDPOINT = '/LivroGeneros';

export const LivroGeneroService = {

  // Obtém uma lista paginada de associações entre livros e gêneros
  getAll: async (pageNumber: number = 1, pageSize: number = 10): Promise<LivroGeneroPaginatedResponse> => {
    const response = await api.get<LivroGeneroPaginatedResponse>(
      `${LIVRO_GENEROS_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Obtém detalhes de uma associação específica entre livro e gênero
  getDetalhes: async (id: number): Promise<LivroGeneroDetalhesResponse> => {
    const response = await api.get<LivroGeneroDetalhesResponse>(`${LIVRO_GENEROS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Obtém todas as associações para um livro específico
  getByLivro: async (livroId: number): Promise<LivroGeneroResponse[]> => {
    const response = await api.get<LivroGeneroResponse[]>(`${LIVRO_GENEROS_ENDPOINT}/livro/${livroId}`);
    return response.data;
  },

  // Obtém todas as associações para um gênero específico
  getByGenero: async (generoId: number): Promise<LivroGeneroResponse[]> => {
    const response = await api.get<LivroGeneroResponse[]>(`${LIVRO_GENEROS_ENDPOINT}/genero/${generoId}`);
    return response.data;
  },

  // Cria uma nova associação entre livro e gênero
  create: async (livroGenero: LivroGeneroRequest): Promise<LivroGeneroResponse> => {
    const response = await api.post<LivroGeneroResponse>(LIVRO_GENEROS_ENDPOINT, livroGenero);
    return response.data;
  },

  // Atualiza uma associação existente entre livro e gênero
  update: async (id: number, livroGenero: LivroGeneroRequest): Promise<LivroGeneroResponse> => {
    const response = await api.put<LivroGeneroResponse>(`${LIVRO_GENEROS_ENDPOINT}/${id}`, livroGenero);
    return response.data;
  },

  // Remove uma associação entre livro e gênero
  delete: async (id: number): Promise<void> => {
    await api.delete(`${LIVRO_GENEROS_ENDPOINT}/${id}`);
  },

  // Associa múltiplos gêneros a um livro
  associarGenerosAoLivro: async (livroId: number, generoIds: number[]): Promise<void> => {
    await api.post(`${LIVRO_GENEROS_ENDPOINT}/livro/${livroId}/generos`, { generoIds });
  },

  // Associa múltiplos livros a um gênero
  associarLivrosAoGenero: async (generoId: number, livroIds: number[]): Promise<void> => {
    await api.post(`${LIVRO_GENEROS_ENDPOINT}/genero/${generoId}/livros`, { livroIds });
  },

  // Remove todas as associações de gêneros para um livro específico
  removerGenerosDoLivro: async (livroId: number): Promise<void> => {
    await api.delete(`${LIVRO_GENEROS_ENDPOINT}/livro/${livroId}/generos`);
  },

  // Remove todas as associações de livros para um gênero específico
  removerLivrosDoGenero: async (generoId: number): Promise<void> => {
    await api.delete(`${LIVRO_GENEROS_ENDPOINT}/genero/${generoId}/livros`);
  }
};

// Mantendo a exportação padrão para compatibilidade com código existente
export default LivroGeneroService;
