import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="text-center">
        <h1 className="page-title">404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        <Link to="/" className="btn-primary mt-3">Voltar para a página inicial</Link>
      </div>
    </div>
  );
};

export default NotFound;
