import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { GeneroRequest } from '../../models/genero';
import { GenerosService } from '../../services/generosService';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

const GeneroForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, setLoading, loading } = useAppContext();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<GeneroRequest>({
    nome: '',
    descricao: ''
  });
  
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing) {
      const fetchGenero = async () => {
        setLoading(true);
        try {
          const response = await GenerosService.getDetalhes(parseInt(id));
          setFormData({
            nome: response.nome,
            descricao: response.descricao || ''
          });
        } catch (err) {
          console.error('Erro ao carregar gênero:', err);
          showAlert('Não foi possível carregar os dados do gênero. Por favor, tente novamente.', 'error');
        } finally {
          setLoading(false);
        }
      };
      
      fetchGenero();
    }
  }, [id, isEditing, setLoading, showAlert]);

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
        await GenerosService.update(parseInt(id), formData);
        showAlert('Gênero atualizado com sucesso!', 'success');
      } else {
        await GenerosService.create(formData);
        showAlert('Gênero criado com sucesso!', 'success');
        setFormData({
          nome: '',
          descricao: ''
        });
      }
      
      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/generos');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        showAlert(`Erro: ${err.response.data.message}`, 'error');
      } else {
        showAlert('Ocorreu um erro ao salvar o gênero. Por favor, tente novamente.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados do gênero..." />;
  }

  return (
    <div className="genero-form">

      
      <h1 className="page-title">{isEditing ? 'Editar Gênero' : 'Novo Gênero'}</h1>
      
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
            placeholder="Nome do gênero"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="form-control"
            rows={5}
            placeholder="Descrição do gênero"
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
          <Link to="/generos" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default GeneroForm;
