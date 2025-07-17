import { LivroSimplificado, PaginatedResponse } from './common';

// Modelo para requisição de criação/atualização de Autor
export interface AutorRequest {
  nome: string;
  biografia?: string;
  dataNascimento: string; // Formato ISO: "YYYY-MM-DDThh:mm:ss"
}

// Modelo para resposta básica de Autor
export interface AutorResponse {
  id: number;
  nome: string;
  biografia: string | null;
  dataNascimento: string;
}

// Modelo para resposta detalhada de Autor (inclui livros)
export interface AutorDetalhesResponse extends AutorResponse {
  livros: LivroSimplificado[];
}

// Exportando tipos comuns para uso em outros arquivos
export type AutorPaginatedResponse = PaginatedResponse<AutorResponse>;
