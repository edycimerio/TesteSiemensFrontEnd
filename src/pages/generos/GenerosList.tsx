import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GeneroResponse, GeneroPaginatedResponse } from '../../models/genero';
import { GenerosService } from '../../services/generosService';
import Pagination from '../../components/Pagination';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const GenerosList: React.FC = () => {
  const { showAlert, setLoading, loading } = useAppContext();
  const [generos, setGeneros] = useState<GeneroResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [generoToDelete, setGeneroToDelete] = useState<number | null>(null);

  const pageSize = 10;

  // Carregar gêneros ao montar o componente e quando a página mudar
  useEffect(() => {
    fetchGeneros();
  }, [currentPage]);

  const fetchGeneros = async () => {
    setLoading(true);
    try {
      const response: GeneroPaginatedResponse = await GenerosService.getAll(currentPage, pageSize);
      setGeneros(response.items);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar gêneros:', err);
      const errorMsg = 'Não foi possível carregar a lista de gêneros. Por favor, tente novamente mais tarde.';
      setError(errorMsg);
      showAlert(errorMsg, 'error');
      setGeneros([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id: number) => {
    setGeneroToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (generoToDelete === null) return;
    
    try {
      await GenerosService.delete(generoToDelete);
      showAlert('Gênero excluído com sucesso!', 'success');
      fetchGeneros(); // Recarregar a lista após exclusão
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        showAlert('Não é possível excluir o gênero pois existem livros associados a ele.', 'error');
      } else {
        showAlert('Erro ao excluir gênero. Por favor, tente novamente.', 'error');
      }
    } finally {
      setDeleteModalOpen(false);
      setGeneroToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setGeneroToDelete(null);
  };

  return (
    <div className="generos-list">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Gêneros</h1>
          {totalCount > 0 && <p className="text-sm text-gray-600">Total: {totalCount} gênero(s)</p>}
        </div>
        <Link to="/generos/novo" className="btn-primary">Novo Gênero</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loading message="Carregando gêneros..." />
      ) : generos.length === 0 ? (
        <p>Nenhum gênero encontrado.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {generos.map(genero => (
                <tr key={genero.id}>
                  <td>{genero.nome}</td>
                  <td>{genero.descricao || '-'}</td>
                  <td>
                    <div className="btn-group">
                      <Link to={`/generos/${genero.id}`} className="btn-secondary">Detalhes</Link>
                      <Link to={`/generos/editar/${genero.id}`} className="btn-secondary">Editar</Link>
                      <button 
                        onClick={() => handleDeleteClick(genero.id)} 
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
        message="Tem certeza que deseja excluir este gênero? Esta ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDelete={true}
      />
    </div>
  );
};

export default GenerosList;
