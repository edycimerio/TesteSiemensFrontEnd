import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AutorDetalhesResponse } from '../../models/autor';
import { AutoresService } from '../../services/autoresService';
import { useAppContext } from '../../context/AppContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import Loading from '../../components/Loading';

const AutorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, setLoading, loading } = useAppContext();
  const [autor, setAutor] = useState<AutorDetalhesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchAutor = async () => {
      setLoading(true);
      try {
        const response = await AutoresService.getDetalhes(parseInt(id));
        setAutor(response);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar detalhes do autor:', err);
        setError('Não foi possível carregar os detalhes do autor. Por favor, tente novamente mais tarde.');
        showAlert('Não foi possível carregar os detalhes do autor.', 'error');
        setAutor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAutor();
  }, [id, setLoading, showAlert]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      await AutoresService.delete(parseInt(id));
      showAlert('Autor excluído com sucesso!', 'success');
      // Redirecionar para a lista de autores após um breve delay
      setTimeout(() => {
        navigate('/autores');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        showAlert('Não é possível excluir o autor pois existem livros associados a ele.', 'error');
      } else {
        showAlert('Erro ao excluir autor. Por favor, tente novamente.', 'error');
      }
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <Loading message="Carregando detalhes do autor..." />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!autor) {
    return <div className="alert alert-error">Autor não encontrado.</div>;
  }

  return (
    <div className="autor-details">


      <div className="flex justify-between items-center">
        <h1 className="page-title">{autor.nome}</h1>
        <div className="btn-group">
          <Link to={`/autores/editar/${autor.id}`} className="btn-secondary">Editar</Link>
          <button onClick={handleDeleteClick} className="btn-danger">Excluir</button>
          <Link to="/autores" className="btn-secondary">Voltar</Link>
        </div>
      </div>

      <div className="autor-info">
        <p><strong>Data de Nascimento:</strong> {formatDate(autor.dataNascimento)}</p>
        {autor.biografia && (
          <div className="biografia">
            <h3>Biografia</h3>
            <p>{autor.biografia}</p>
          </div>
        )}
      </div>

      <div className="autor-livros mt-3">
        <h2>Livros do Autor</h2>
        {autor.livros.length === 0 ? (
          <p>Este autor não possui livros cadastrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Ano</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {autor.livros.map(livro => (
                <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>{livro.ano}</td>
                  <td>
                    <Link to={`/livros/${livro.id}`} className="btn-secondary">Detalhes</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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

export default AutorDetails;
