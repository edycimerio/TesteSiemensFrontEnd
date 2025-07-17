import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GeneroDetalhesResponse } from '../../models/genero';
import { GenerosService } from '../../services/generosService';
import { useAppContext } from '../../context/AppContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import Loading from '../../components/Loading';

const GeneroDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [genero, setGenero] = useState<GeneroDetalhesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchGenero = async () => {
      setLoading(true);
      try {
        const generoId = parseInt(id);
        console.log(`Buscando detalhes do gênero ${generoId}...`);
        const response = await GenerosService.getDetalhes(generoId);
        console.log('Resposta recebida:', response);
        setGenero(response);
        setError(null);
      } catch (err: any) {
        console.error('Erro ao carregar detalhes do gênero:', err);
        
        // Tratamento específico para diferentes tipos de erro
        if (err.response) {
          // O servidor respondeu com um status de erro
          console.error(`Erro ${err.response.status}:`, err.response.data);
          setError(`Erro ${err.response.status}: ${err.response.statusText}`);
        } else if (err.request) {
          // A requisição foi feita mas não houve resposta
          console.error('Sem resposta do servidor:', err.request);
          setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          // Algo aconteceu na configuração da requisição
          setError(`Erro: ${err.message}`);
        }
        
        showAlert('Não foi possível carregar os detalhes do gênero.', 'error');
        setGenero(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGenero();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, showAlert]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      await GenerosService.delete(parseInt(id));
      showAlert('Gênero excluído com sucesso!', 'success');
      // Redirecionar para a lista de gêneros após um breve delay
      setTimeout(() => {
        navigate('/generos');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        showAlert('Não é possível excluir o gênero pois existem livros associados a ele.', 'error');
      } else {
        showAlert('Erro ao excluir gênero. Por favor, tente novamente.', 'error');
      }
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  if (loading) {
    return <Loading message="Carregando detalhes do gênero..." />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!genero) {
    return <div className="alert alert-error">Gênero não encontrado.</div>;
  }

  return (
    <div className="genero-details">


      <div className="flex justify-between items-center">
        <h1 className="page-title">{genero.nome}</h1>
        <div className="btn-group">
          <Link to={`/generos/editar/${genero.id}`} className="btn-secondary">Editar</Link>
          <button onClick={handleDeleteClick} className="btn-danger">Excluir</button>
          <Link to="/generos" className="btn-secondary">Voltar</Link>
        </div>
      </div>

      <div className="genero-info">
        {genero.descricao && (
          <div className="descricao">
            <h3>Descrição</h3>
            <p>{genero.descricao}</p>
          </div>
        )}
      </div>

      <div className="genero-livros mt-3">
        <h2>Livros deste Gênero</h2>
        {genero.livros.length === 0 ? (
          <p>Este gênero não possui livros cadastrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Ano</th>
              </tr>
            </thead>
            <tbody>
              {genero.livros.map(livro => (
                <tr key={livro.id}>
                  <td>
                    <Link to={`/livros/${livro.id}`}>{livro.titulo}</Link>
                  </td>
                  <td>{livro.ano}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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

export default GeneroDetails;
