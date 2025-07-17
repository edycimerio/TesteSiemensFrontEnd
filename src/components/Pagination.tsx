import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Não renderizar paginação se houver apenas uma página
  if (totalPages <= 1) return null;

  // Criar array de páginas para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Número máximo de botões de página para mostrar
    
    // Sempre mostrar a primeira página
    pages.push(1);
    
    // Calcular o intervalo de páginas a serem mostradas
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
    
    // Ajustar startPage se endPage estiver no limite
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - (maxPagesToShow - 3));
    }
    
    // Adicionar elipses após a primeira página se necessário
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Adicionar páginas do intervalo calculado
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Adicionar elipses antes da última página se necessário
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Sempre mostrar a última página se houver mais de uma página
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button 
            key={index}
            className={currentPage === page ? 'active' : ''}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="pagination-ellipsis">{page}</span>
        )
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
