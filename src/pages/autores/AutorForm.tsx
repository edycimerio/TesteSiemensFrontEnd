import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AutorRequest, AutorResponse } from '../../models/autor';
import { AutoresService } from '../../services/autoresService';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const AutorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, autoresCache, setAutoresCache } = useAppContext();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<AutorRequest>({
    nome: '',
    dataNascimento: '',
    biografia: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing) {
      // Verificar se temos o autor em cache
      const cachedAutor = autoresCache.find(autor => autor.id === parseInt(id));
      
      if (cachedAutor) {
        // Usar dados do cache
        setFormData({
          nome: cachedAutor.data.nome,
          dataNascimento: formatDateForInput(cachedAutor.data.dataNascimento),
          biografia: cachedAutor.data.biografia || ''
        });
      } else {
        // Buscar dados da API
        const fetchAutor = async () => {
          setLoading(true);
          try {
            const response = await AutoresService.getDetalhes(parseInt(id));
            setFormData({
              nome: response.nome,
              dataNascimento: formatDateForInput(response.dataNascimento),
              biografia: response.biografia || ''
            });
            
            // Adicionar ao cache
            setAutoresCache([...autoresCache, {
              id: response.id,
              page: 1, // Página padrão
              data: response,
              totalPages: 1 // Valor padrão
            }]);
          } catch (err) {
            console.error('Erro ao carregar autor:', err);
            showAlert('Não foi possível carregar os dados do autor. Por favor, tente novamente.', 'error');
          } finally {
            setLoading(false);
          }
        };
        
        fetchAutor();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditing) {
        await AutoresService.update(parseInt(id), formData);
        showAlert('Autor atualizado com sucesso!', 'success');
        
        // Atualizar o cache
        const updatedCache = autoresCache.map(item => {
          if (item.id === parseInt(id)) {
            return {
              ...item,
              data: {
                ...item.data,
                nome: formData.nome,
                biografia: formData.biografia || null,
                dataNascimento: formData.dataNascimento
              }
            };
          }
          return item;
        });
        setAutoresCache(updatedCache);
      } else {
        // Criar novo autor
        const response = await AutoresService.create(formData);
        showAlert('Autor criado com sucesso!', 'success');
        
        // Adicionar ao cache
        setAutoresCache([...autoresCache, {
          id: response.id,
          page: 1,
          data: response,
          totalPages: autoresCache.length > 0 ? autoresCache[0].totalPages : 1
        }]);
        
        setFormData({
          nome: '',
          dataNascimento: '',
          biografia: ''
        });
      }
      
      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/autores');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        showAlert(`Erro: ${err.response.data.message}`, 'error');
      } else {
        showAlert('Ocorreu um erro ao salvar o autor. Por favor, tente novamente.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados do autor..." />;
  }

  return (
    <div className="autor-form">

      
      <h1 className="page-title">{isEditing ? 'Editar Autor' : 'Novo Autor'}</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Nome do autor"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento *</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="biografia">Biografia</label>
          <textarea
            id="biografia"
            name="biografia"
            value={formData.biografia}
            onChange={handleChange}
            className="form-control"
            rows={5}
            placeholder="Biografia do autor"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/autores" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default AutorForm;
