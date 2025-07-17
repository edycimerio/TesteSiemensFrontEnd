import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LivroRequest } from '../../models/livro';
import { AutorResponse } from '../../models/autor';
import { GeneroResponse } from '../../models/genero';
import { LivrosService } from '../../services/livrosService';
import { AutoresService } from '../../services/autoresService';
import { GenerosService } from '../../services/generosService';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import './generos-grid.css';

const LivroForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert, setLoading, loading } = useAppContext();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<LivroRequest>({
    titulo: '',
    ano: new Date().getFullYear(),
    autorId: 0,
    generos: []
  });
  
  // Estado para controlar os gêneros selecionados
  const [selectedGeneros, setSelectedGeneros] = useState<number[]>([]);
  
  const [autores, setAutores] = useState<AutorResponse[]>([]);
  const [generos, setGeneros] = useState<GeneroResponse[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  // Flag para controlar se os dados já foram carregados
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Só carrega os dados uma vez
    if (dataLoaded) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carrega dados em sequência para evitar muitas requisições simultâneas
        // Primeiro autores
        const autoresResponse = await AutoresService.getAll(1, 100);
        setAutores(autoresResponse.items);
        
        // Depois gêneros (sequencial, não paralelo)
        const generosResponse = await GenerosService.getAll(1, 100);
        setGeneros(generosResponse.items);
        
        // Se estiver editando, carrega os detalhes do livro
        if (isEditing && id) {
          const livroResponse = await LivrosService.getDetalhes(parseInt(id));
          setFormData({
            titulo: livroResponse.titulo,
            ano: livroResponse.ano,
            autorId: livroResponse.autor.id,
            generos: livroResponse.generos.map(g => g.id)
          });
          
          // Definir os gêneros selecionados
          const generosIds = livroResponse.generos.map(g => g.id);
          setSelectedGeneros(generosIds);
          setFormData(prev => ({
            ...prev,
            generos: generosIds
          }));
        }
        
        // Marca que os dados foram carregados
        setDataLoaded(true);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        showAlert('Não foi possível carregar os dados necessários. Por favor, tente novamente.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing, dataLoaded, setLoading, showAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Lidar com campos do formData
    if (name === 'titulo') {
      setFormData(prev => ({
        ...prev,
        titulo: value
      }));
    } else if (name === 'ano') {
      setFormData(prev => ({
        ...prev,
        ano: parseInt(value) || new Date().getFullYear()
      }));
    } else if (name === 'autorId') {
      setFormData(prev => ({
        ...prev,
        autorId: parseInt(value) || 0
      }));
    
    }
  };

  // Função para alternar a seleção de um gênero
  const toggleGenero = (generoId: number) => {
    const isSelected = selectedGeneros.includes(generoId);
    let newSelectedGeneros: number[];
    
    if (isSelected) {
      // Remover o gênero se já estiver selecionado
      newSelectedGeneros = selectedGeneros.filter(id => id !== generoId);
    } else {
      // Adicionar o gênero se não estiver selecionado
      newSelectedGeneros = [...selectedGeneros, generoId];
    }
    
    setSelectedGeneros(newSelectedGeneros);
    setFormData(prev => ({
      ...prev,
      generos: newSelectedGeneros
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (formData.autorId === 0) {
      showAlert('Por favor, selecione um autor.', 'warning');
      return;
    }
    
    if (selectedGeneros.length === 0) {
      showAlert('Por favor, selecione pelo menos um gênero.', 'warning');
      return;
    }
    
    setSaving(true);
    try {
      // Preparar dados para envio
      const livroData = {
        ...formData,
        generos: selectedGeneros // Enviar todos os gêneros selecionados
      };
      
      if (isEditing) {
        // Atualizar livro existente
        await LivrosService.update(parseInt(id!), livroData);
        showAlert('Livro atualizado com sucesso!', 'success');
      } else {
        // Criar novo livro
        await LivrosService.create(livroData);
        showAlert('Livro criado com sucesso!', 'success');
        
        // Limpar formulário após criação
        setFormData({
          titulo: '',
          ano: new Date().getFullYear(),
          autorId: 0,
          generos: []
        });
        setSelectedGeneros([]);
      }
      
      // Redirecionar para a lista de livros
      navigate('/livros');
    } catch (err: any) {
      console.error('Erro ao salvar livro:', err);
      showAlert('Não foi possível salvar o livro. Por favor, tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados..." />;
  }

  return (
    <div className="livro-form">
      <h1 className="page-title">{isEditing ? 'Editar Livro' : 'Novo Livro'}</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Título do livro"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ano">Ano de Publicação *</label>
          <input
            type="number"
            id="ano"
            name="ano"
            value={formData.ano}
            onChange={handleChange}
            required
            min="1000"
            max={new Date().getFullYear() + 5}
            className="form-control"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="autorId">Autor *</label>
            <select
              id="autorId"
              name="autorId"
              value={formData.autorId}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value={0}>Selecione um autor</option>
              {autores.map(autor => (
                <option key={autor.id} value={autor.id}>{autor.nome}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Gêneros *</label>
          <div className="mt-2 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Selecione pelo menos um gênero (clique para selecionar/desselecionar)
            </p>
            <div className="generos-grid">
              {generos.map(genero => (
                <div 
                  key={genero.id} 
                  className={`genero-item ${selectedGeneros.includes(genero.id) ? 'selected' : ''}`}
                  onClick={() => toggleGenero(genero.id)}
                >
                  {genero.nome}
                </div>
              ))}
            </div>
            {selectedGeneros.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Por favor, selecione pelo menos um gênero</p>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/livros" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default LivroForm;
