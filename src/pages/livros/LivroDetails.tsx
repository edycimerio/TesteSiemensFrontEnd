import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LivroDetalhesResponse } from '../../models/livro';
import { LivrosService } from '../../services/livrosService';
import { useAppContext } from '../../context/AppContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import Loading from '../../components/Loading';

const LivroDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAppContext();
  const [livro, setLivro] = useState<LivroDetalhesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Interface estendida para incluir campos extras que existem na API mas não no tipo original
  interface LivroDetalhesResponseExtended extends LivroDetalhesResponse {
    isbn?: string;
    sinopse?: string;
    capa?: string;
  }

  useEffect(() => {
    if (!id) return;
    
    const fetchLivro = async () => {
      setLoading(true);
      try {
        const livroId = parseInt(id);
        console.log(`Buscando detalhes do livro ${livroId}...`);
        const response = await LivrosService.getDetalhes(livroId);
        console.log('Resposta recebida:', response);
        // Usando type assertion para incluir os campos extras
        setLivro(response as LivroDetalhesResponseExtended);
        setError(null);
      } catch (err: any) {
        console.error('Erro ao carregar detalhes do livro:', err);
        
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
        
        showAlert('Não foi possível carregar os detalhes do livro.', 'error');
        setLivro(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLivro();
  }, [id, showAlert]);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      await LivrosService.delete(parseInt(id));
      showAlert('Livro excluído com sucesso!', 'success');
      // Redirecionar para a lista de livros após um breve delay
      setTimeout(() => {
        navigate('/livros');
      }, 2000);
    } catch (err) {
      showAlert('Erro ao excluir livro. Por favor, tente novamente.', 'error');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  if (loading) {
    return <Loading message="Carregando detalhes do livro..." />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!livro) {
    return <div className="alert alert-error">Livro não encontrado.</div>;
  }

  return (
    <div className="livro-details">


      <div className="flex justify-between items-center">
        <h1 className="page-title">{livro.titulo}</h1>
        <div className="btn-group">
          <Link to="/livros" className="btn-secondary">Voltar</Link>
        </div>
      </div>

      <div className="livro-info">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Ano de Publicação:</strong> {livro.ano}</p>
            <p><strong>ISBN:</strong> {(livro as any).isbn || 'N/A'}</p>
            <p>
              <strong>Autor:</strong>{' '}
              <Link to={`/autores/${livro.autor.id}`} className="text-link">
                {livro.autor.nome}
              </Link>
            </p>
            <p>
              <strong>Gêneros:</strong>{' '}
              {livro.generos.map((genero, index) => (
                <React.Fragment key={genero.id}>
                  {index > 0 && <span>, </span>}
                  <Link to={`/generos/${genero.id}`} className="text-link">
                    {genero.nome}
                  </Link>
                </React.Fragment>
              ))}
            </p>
          </div>
          <div>
            {(livro as any).capa && (
              <div className="livro-capa">
                <img src={(livro as any).capa} alt={`Capa do livro ${livro.titulo}`} />
              </div>
            )}
          </div>
        </div>

        {(livro as any).sinopse && (
          <div className="sinopse mt-4">
            <h3>Sinopse</h3>
            <p>{(livro as any).sinopse}</p>
          </div>
        )}
      </div>

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

export default LivroDetails;
