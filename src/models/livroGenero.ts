import { LivroSimplificado, PaginatedResponse } from './common';

export interface LivroGeneroRequest {
  livroId: number;
  generoId: number;
}

export interface LivroGeneroResponse {
  id: number;
  livroId: number;
  generoId: number;
}

export interface LivroGeneroDetalhesResponse {
  id: number;
  livro: LivroSimplificado;
  generoId: number;
  generoNome: string;
}

export type LivroGeneroPaginatedResponse = PaginatedResponse<LivroGeneroResponse>;
