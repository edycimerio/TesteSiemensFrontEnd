import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { alert, hideAlert, loading } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Função para verificar se o link está ativo
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container header-container">
          <div className="logo-container">
            <Link to="/" className="logo">SisLivros</Link>
            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              <span className="menu-icon"></span>
            </button>
          </div>
          
          <nav className={`main-nav ${menuOpen ? 'menu-open' : ''}`}>
            <ul>
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/autores" 
                  className={isActive('/autores') ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Autores
                </Link>
              </li>
              <li>
                <Link 
                  to="/generos" 
                  className={isActive('/generos') ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Gêneros
                </Link>
              </li>
              <li>
                <Link 
                  to="/livros" 
                  className={isActive('/livros') ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Livros
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {alert.show && (
        <div className="container mt-3">
          <div className={`alert alert-${alert.type}`}>
            <div className="alert-content">{alert.message}</div>
            <button className="alert-close" onClick={hideAlert}>&times;</button>
          </div>
        </div>
      )}
      
      {loading && location.pathname !== '/' && (
        <div className="global-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} Sistema de Gerenciamento de Livros</p>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/autores">Autores</Link>
              <Link to="/generos">Gêneros</Link>
              <Link to="/livros">Livros</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
