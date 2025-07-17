// Modelo para resposta paginada - usado em todos os serviços
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Modelo para livro simplificado - usado em AutorDetalhesResponse e GeneroDetalhesResponse
export interface LivroSimplificado {
  id: number;
  titulo: string;
  ano: number;
}
