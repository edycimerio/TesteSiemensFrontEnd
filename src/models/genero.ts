import { LivroSimplificado, PaginatedResponse } from './common';

// Modelo para requisição de criação/atualização de Gênero
export interface GeneroRequest {
  nome: string;
  descricao?: string;
}

// Modelo para resposta básica de Gênero
export interface GeneroResponse {
  id: number;
  nome: string;
  descricao: string | null;
}

// Modelo para resposta detalhada de Gênero (inclui livros)
export interface GeneroDetalhesResponse extends GeneroResponse {
  livros: LivroSimplificado[];
}

// Exportando tipos comuns para uso em outros arquivos
export type GeneroPaginatedResponse = PaginatedResponse<GeneroResponse>;
