import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AutorResponse, AutorPaginatedResponse } from '../../models/autor';
import { AutoresService } from '../../services/autoresService';
import Pagination from '../../components/Pagination';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const AutoresList: React.FC = () => {
  const { showAlert, autoresCache, setAutoresCache } = useAppContext();
  const [autores, setAutores] = useState<AutorResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [autorToDelete, setAutorToDelete] = useState<number | null>(null);

  const pageSize = 10;

  // Carregar autores ao montar o componente e quando a página mudar
  useEffect(() => {
    fetchAutores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchAutores = async (retry = false) => {
    // Verificar se já temos os dados em cache para esta página
    const cachedData = autoresCache.filter(autor => autor.page === currentPage);
    
    if (cachedData.length > 0) {
      // Usar dados do cache
      setAutores(cachedData.map(item => item.data));
      setTotalPages(cachedData[0].totalPages);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Iniciando busca de autores...');
      const response: AutorPaginatedResponse = await AutoresService.getAll(currentPage, pageSize);
      console.log('Dados recebidos:', response);
      
      setAutores(response.items);
      setTotalPages(response.totalPages);
      setError(null);
      
      // Atualizar o cache com os novos dados
      const newCacheItems = response.items.map(autor => ({
        id: autor.id,
        page: currentPage,
        data: autor,
        totalPages: response.totalPages
      }));
      
      // Manter apenas os itens de outras páginas e adicionar os novos
      const filteredCache = autoresCache.filter(autor => autor.page !== currentPage);
      setAutoresCache([...filteredCache, ...newCacheItems]);
    } catch (err: any) {
      console.error('Erro ao carregar autores:', err);
      
      // Informações detalhadas do erro para depuração
      if (err.response) {
        console.error('Status do erro:', err.response.status);
        console.error('Dados do erro:', err.response.data);
      } else if (err.request) {
        console.error('Sem resposta do servidor. Detalhes:', err.request);
      } else {
        console.error('Erro na configuração da requisição:', err.message);
      }
      
      // Se for o primeiro erro e não estiver tentando novamente, tentar uma vez mais
      if (!retry) {
        console.log('Tentando novamente...');
        setTimeout(() => fetchAutores(true), 1000);
        return;
      }
      
      const errorMsg = 'Não foi possível carregar a lista de autores. Por favor, tente novamente mais tarde.';
      setError(errorMsg);
      showAlert(errorMsg, 'error');
      setAutores([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id: number) => {
    setAutorToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (autorToDelete === null) return;
    
    try {
      await AutoresService.delete(autorToDelete);
      showAlert('Autor excluído com sucesso!', 'success');
      
      // Remover do cache
      const updatedCache = autoresCache.filter(autor => autor.id !== autorToDelete);
      setAutoresCache(updatedCache);
      
      fetchAutores(); // Recarregar a lista após exclusão
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        showAlert('Não é possível excluir o autor pois existem livros associados a ele.', 'error');
      } else {
        showAlert('Erro ao excluir autor. Por favor, tente novamente.', 'error');
      }
    } finally {
      setDeleteModalOpen(false);
      setAutorToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAutorToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };



  return (
    <div className="autores-list">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Autores</h1>
        <Link to="/autores/novo" className="btn-primary">Novo Autor</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loading message="Carregando autores..." />
      ) : autores.length === 0 ? (
        <p>Nenhum autor encontrado.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data de Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {autores.map(autor => (
                <tr key={autor.id}>
                  <td>{autor.nome}</td>
                  <td>{formatDate(autor.dataNascimento)}</td>
                  <td>
                    <div className="btn-group">
                      <Link to={`/autores/${autor.id}`} className="btn-secondary">Detalhes</Link>
                      <Link to={`/autores/editar/${autor.id}`} className="btn-secondary">Editar</Link>
                      <button 
                        onClick={() => handleDeleteClick(autor.id)} 
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
        message="Tem certeza que deseja excluir este autor? Esta ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDelete={true}
      />
    </div>
  );
};

export default AutoresList;
