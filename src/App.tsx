import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes
import Layout from './components/Layout';

// Context
import { AppProvider } from './context/AppContext';

// Páginas
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Páginas de Autores
import AutoresList from './pages/autores/AutoresList';
import AutorDetails from './pages/autores/AutorDetails';
import AutorForm from './pages/autores/AutorForm';

// Páginas de Gêneros
import GenerosList from './pages/generos/GenerosList';
import GeneroDetails from './pages/generos/GeneroDetails';
import GeneroForm from './pages/generos/GeneroForm';

// Páginas de Livros
import LivrosList from './pages/livros/LivrosList';
import LivroDetails from './pages/livros/LivroDetails';
import LivroForm from './pages/livros/LivroForm';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
          {/* Rotas Home */}
          <Route path="/" element={<Home />} />
          
          {/* Rotas Autores */}
          <Route path="/autores" element={<AutoresList />} />
          <Route path="/autores/:id" element={<AutorDetails />} />
          <Route path="/autores/novo" element={<AutorForm />} />
          <Route path="/autores/editar/:id" element={<AutorForm />} />
          
          {/* Rotas Gêneros */}
          <Route path="/generos" element={<GenerosList />} />
          <Route path="/generos/:id" element={<GeneroDetails />} />
          <Route path="/generos/novo" element={<GeneroForm />} />
          <Route path="/generos/editar/:id" element={<GeneroForm />} />
          
          {/* Rotas Livros */}
          <Route path="/livros" element={<LivrosList />} />
          <Route path="/livros/:id" element={<LivroDetails />} />
          <Route path="/livros/novo" element={<LivroForm />} />
          <Route path="/livros/editar/:id" element={<LivroForm />} />
          
          {/* Rota para página não encontrada */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
