import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LivroRequest } from '../../models/livro';
import { AutorResponse } from '../../models/autor';
import { GeneroResponse } from '../../models/genero';
import { LivrosService } from '../../services/livrosService';
import { AutoresService } from '../../services/autoresService';
import { GenerosService } from '../../services/generosService';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';

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
  
  // Estado adicional para campos não incluídos no modelo LivroRequest
  const [isbn, setIsbn] = useState<string>('');
  const [sinopse, setSinopse] = useState<string>('');
  const [capa, setCapa] = useState<string>('');
  const [selectedGeneroId, setSelectedGeneroId] = useState<number>(0);
  
  const [autores, setAutores] = useState<AutorResponse[]>([]);
  const [generos, setGeneros] = useState<GeneroResponse[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar autores e gêneros para os selects
        const autoresResponse = await AutoresService.getAll(1, 100);
        const generosResponse = await GenerosService.getAll(1, 100);
        
        setAutores(autoresResponse.items);
        setGeneros(generosResponse.items);
        
        // Se estiver editando, carregar dados do livro
        if (isEditing) {
          const livroResponse = await LivrosService.getDetalhes(parseInt(id!));
          setFormData({
            titulo: livroResponse.titulo,
            ano: livroResponse.ano,
            autorId: livroResponse.autor.id,
            generos: livroResponse.generos.map(g => g.id)
          });
          
          // Definir os campos adicionais
          // Usando type assertion para acessar propriedades que podem não estar definidas no tipo
          const livroData = livroResponse as any;
          setIsbn(livroData.isbn || '');
          setSinopse(livroData.sinopse || '');
          setCapa(livroData.capa || '');
          if (livroResponse.generos.length > 0) {
            setSelectedGeneroId(livroResponse.generos[0].id);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        showAlert('Não foi possível carregar os dados necessários. Por favor, tente novamente.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing, setLoading, showAlert]);

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
    } else if (name === 'generoId') {
      setSelectedGeneroId(parseInt(value) || 0);
    } else if (name === 'isbn') {
      setIsbn(value);
    } else if (name === 'sinopse') {
      setSinopse(value);
    } else if (name === 'capa') {
      setCapa(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (formData.autorId === 0) {
      showAlert('Por favor, selecione um autor.', 'warning');
      return;
    }
    
    if (selectedGeneroId === 0) {
      showAlert('Por favor, selecione um gênero.', 'warning');
      return;
    }
    
    // Adicionar o gênero selecionado ao array de gêneros
    const livroData = {
      ...formData,
      generos: [selectedGeneroId]
    };
    
    setSaving(true);
    
    try {
      if (isEditing) {
        await LivrosService.update(parseInt(id!), livroData);
        showAlert('Livro atualizado com sucesso!', 'success');
      } else {
        await LivrosService.create(livroData);
        showAlert('Livro criado com sucesso!', 'success');
        setFormData({
          titulo: '',
          ano: new Date().getFullYear(),
          autorId: 0,
          generos: []
        });
        setIsbn('');
        setSinopse('');
        setCapa('');
        setSelectedGeneroId(0);
      }
      
      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/livros');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        showAlert(`Erro: ${err.response.data.message}`, 'error');
      } else {
        showAlert('Ocorreu um erro ao salvar o livro. Por favor, tente novamente.', 'error');
      }
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
        
        <div className="form-row">
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
          
          <div className="form-group">
            <label htmlFor="isbn">ISBN *</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={isbn}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="ISBN do livro"
            />
          </div>
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
          
          <div className="form-group">
            <label htmlFor="generoId">Gênero *</label>
            <select
              id="generoId"
              name="generoId"
              value={selectedGeneroId}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value={0}>Selecione um gênero</option>
              {generos.map(genero => (
                <option key={genero.id} value={genero.id}>{genero.nome}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="capa">URL da Capa</label>
          <input
            type="url"
            id="capa"
            name="capa"
            value={capa}
            onChange={handleChange}
            className="form-control"
            placeholder="URL da imagem de capa"
          />
          {capa && (
            <div className="capa-preview mt-2">
              <img src={capa} alt="Prévia da capa" style={{ maxHeight: '100px' }} />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="sinopse">Sinopse</label>
          <textarea
            id="sinopse"
            name="sinopse"
            value={sinopse}
            onChange={handleChange}
            className="form-control"
            rows={5}
            placeholder="Sinopse do livro"
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
          <Link to="/livros" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default LivroForm;
