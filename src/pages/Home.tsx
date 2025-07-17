import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AutoresService } from '../services/autoresService';
import { GenerosService } from '../services/generosService';
import { LivrosService } from '../services/livrosService';

const Home: React.FC = () => {
  // Usar o cache do AppContext para evitar buscas repetidas
  const { autoresCache, generosCache, livrosCache, setAutoresCache, setGenerosCache, setLivrosCache } = useAppContext();
  const [totalAutores, setTotalAutores] = useState<number | null>(autoresCache.length > 0 ? autoresCache.length : null);
  const [totalGeneros, setTotalGeneros] = useState<number | null>(generosCache.length > 0 ? generosCache.length : null);
  const [totalLivros, setTotalLivros] = useState<number | null>(livrosCache.length > 0 ? livrosCache.length : null);
  
  // Buscar dados apenas uma vez quando o componente montar e se não estiverem em cache
  useEffect(() => {
    const fetchData = async () => {
      // Só buscar dados que não estão em cache
      const promises = [];
      
      if (totalAutores === null) {
        promises.push(AutoresService.getAll(1, 1)
          .then(response => {
            setTotalAutores(response.totalCount);
            // Atualizar cache se tivermos dados completos
            if (response.items.length > 0) {
              setAutoresCache(response.items);
            }
            return response;
          })
          .catch(() => null));
      }
      
      if (totalGeneros === null) {
        promises.push(GenerosService.getAll(1, 1)
          .then(response => {
            setTotalGeneros(response.totalCount);
            if (response.items.length > 0) {
              setGenerosCache(response.items);
            }
            return response;
          })
          .catch(() => null));
      }
      
      if (totalLivros === null) {
        promises.push(LivrosService.getAll(1, 1)
          .then(response => {
            setTotalLivros(response.totalCount);
            if (response.items.length > 0) {
              setLivrosCache(response.items);
            }
            return response;
          })
          .catch(() => null));
      }
      
      // Só fazer requisições se necessário
      if (promises.length > 0) {
        try {
          await Promise.all(promises);
        } catch (err) {
          console.error('Erro ao carregar algumas informações:', err);
          // Não exibimos mensagem de erro, apenas log no console
        }
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      <h1 className="page-title">Sistema de Gerenciamento de Livros</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total de Autores</h3>
          <p className="stat-number">{totalAutores !== null ? totalAutores : '-'}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Gêneros</h3>
          <p className="stat-number">{totalGeneros !== null ? totalGeneros : '-'}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Livros</h3>
          <p className="stat-number">{totalLivros !== null ? totalLivros : '-'}</p>
        </div>
      </div>
      
      <div className="dashboard-cards">
        <div className="card">
          <h2>Autores</h2>
          <p>Gerencie os autores cadastrados no sistema</p>
          <Link to="/autores" className="card-link">Ver Autores</Link>
        </div>
        
        <div className="card">
          <h2>Gêneros</h2>
          <p>Gerencie os gêneros literários cadastrados no sistema</p>
          <Link to="/generos" className="card-link">Ver Gêneros</Link>
        </div>
        
        <div className="card">
          <h2>Livros</h2>
          <p>Gerencie o catálogo de livros</p>
          <Link to="/livros" className="card-link">Ver Livros</Link>
        </div>
      </div>
      
      <div className="dashboard-info">
        <h3>Sobre o Sistema</h3>
        <p>
          Este sistema permite o gerenciamento completo de um catálogo de livros, 
          incluindo cadastro de autores, gêneros e os próprios livros.
        </p>
        <p>
          Utilize o menu superior para navegar entre as diferentes seções do sistema.
        </p>
        <div className="dashboard-actions">
          <Link to="/livros/novo" className="btn-primary">Adicionar Novo Livro</Link>
          <Link to="/autores/novo" className="btn-secondary">Adicionar Novo Autor</Link>
          <Link to="/generos/novo" className="btn-secondary">Adicionar Novo Gênero</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
