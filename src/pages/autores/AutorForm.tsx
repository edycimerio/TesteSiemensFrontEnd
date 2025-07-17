import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AutorRequest, AutorResponse } from '../../models/autor';
import { AutoresService } from '../../services/autoresService';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const AutorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, setLoading, loading } = useAppContext();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<AutorRequest>({
    nome: '',
    dataNascimento: '',
    biografia: ''
  });
  
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing) {
      const fetchAutor = async () => {
        setLoading(true);
        try {
          const response = await AutoresService.getDetalhes(parseInt(id));
          setFormData({
            nome: response.nome,
            dataNascimento: formatDateForInput(response.dataNascimento),
            biografia: response.biografia || ''
          });
        } catch (err) {
          console.error('Erro ao carregar autor:', err);
          showAlert('Não foi possível carregar os dados do autor. Por favor, tente novamente.', 'error');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAutor();
    }
  }, [id, isEditing, setLoading, showAlert]);

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
      } else {
        await AutoresService.create(formData);
        showAlert('Autor criado com sucesso!', 'success');
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
