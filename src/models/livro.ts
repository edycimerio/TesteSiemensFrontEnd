import { AutorResponse } from './autor';
import { PaginatedResponse } from './common';

// Modelo para gênero simplificado (usado em LivroResponse)
export interface GeneroSimplificado {
  id: number;
  nome: string;
}

// Modelo para requisição de criação/atualização de Livro
export interface LivroRequest {
  titulo: string;
  ano: number;
  autorId: number;
  generos: number[];
}

// Modelo para resposta básica de Livro
export interface LivroResponse {
  id: number;
  titulo: string;
  ano: number;
  generos: GeneroSimplificado[];
  autor: AutorResponse;
}

// Modelo para resposta detalhada de Livro (mesma estrutura que LivroResponse)
export interface LivroDetalhesResponse extends LivroResponse {}

// Exportando tipos comuns para uso em outros arquivos
export type LivroPaginatedResponse = PaginatedResponse<LivroResponse>;
