import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LivroResponse, LivroPaginatedResponse } from '../../models/livro';
import { LivrosService } from '../../services/livrosService';
import Pagination from '../../components/Pagination';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const LivrosList: React.FC = () => {
  const { showAlert, setLoading, loading } = useAppContext();
  const [livros, setLivros] = useState<LivroResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [livroToDelete, setLivroToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const pageSize = 10;

  // Carregar livros ao montar o componente e quando a página mudar
  useEffect(() => {
    fetchLivros();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchLivros = async () => {
    setLoading(true);
    try {
      let response: LivroPaginatedResponse;
      
      if (searchTerm.trim()) {
        response = await LivrosService.pesquisar(searchTerm, currentPage, pageSize);
      } else {
        response = await LivrosService.getAll(currentPage, pageSize);
      }
      
      setLivros(response.items);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar livros:', err);
      const errorMsg = 'Não foi possível carregar a lista de livros. Por favor, tente novamente mais tarde.';
      setError(errorMsg);
      showAlert(errorMsg, 'error');
      setLivros([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id: number) => {
    setLivroToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (livroToDelete === null) return;
    
    try {
      await LivrosService.delete(livroToDelete);
      showAlert('Livro excluído com sucesso!', 'success');
      fetchLivros(); // Recarregar a lista após exclusão
    } catch (err) {
      showAlert('Erro ao excluir livro. Por favor, tente novamente.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setLivroToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setLivroToDelete(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Resetar para a primeira página ao pesquisar
    fetchLivros();
  };

  return (
    <div className="livros-list">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Livros</h1>
          {totalCount > 0 && <p className="text-sm text-gray-600">Total: {totalCount} livro(s)</p>}
        </div>
        <Link to="/livros/novo" className="btn-primary">Novo Livro</Link>
      </div>

      <form onSubmit={handleSearch} className="search-form mb-3">
        <div className="flex">
          <input
            type="text"
            placeholder="Pesquisar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-secondary">Pesquisar</button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loading message="Carregando livros..." />
      ) : livros.length === 0 ? (
        <p>Nenhum livro encontrado.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Ano</th>
                <th>Gêneros</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.map(livro => (
                <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>
                    <Link to={`/autores/${livro.autor.id}`}>
                      {livro.autor.nome}
                    </Link>
                  </td>
                  <td>{livro.ano}</td>
                  <td>
                    {livro.generos.map((genero, index) => (
                      <React.Fragment key={genero.id}>
                        {index > 0 && <span>, </span>}
                        <span className="genero-tag">
                          <Link to={`/generos/${genero.id}`}>
                            {genero.nome}
                          </Link>
                        </span>
                      </React.Fragment>
                    ))}
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link to={`/livros/${livro.id}`} className="btn-secondary">Detalhes</Link>
                      <Link to={`/livros/editar/${livro.id}`} className="btn-secondary">Editar</Link>
                      <button 
                        onClick={() => handleDeleteClick(livro.id)} 
                        className="btn-danger"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      )}

      <ConfirmationModal 
        isOpen={deleteModalOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este livro? Esta ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDelete={true}
      />
    </div>
  );
};

export default LivrosList;
