import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AutorResponse } from '../models/autor';
import { GeneroResponse } from '../models/genero';
import { LivroResponse } from '../models/livro';

// Interface para o cache de autores com paginação
interface CachedAutor {
  id: number;
  page: number;
  data: AutorResponse;
  totalPages: number;
  totalCount: number;
}

// Interface para o cache de gêneros com paginação
interface CachedGenero {
  id: number;
  page: number;
  data: GeneroResponse;
  totalPages: number;
  totalCount: number;
}

// Interface para o cache de livros com paginação
interface CachedLivro {
  id: number;
  page: number;
  data: LivroResponse;
  totalPages: number;
  totalCount: number;
}

interface AlertState {
  message: string | null;
  type: 'success' | 'error' | 'warning';
  show: boolean;
}

interface AppContextType {
  // Estado global para alertas
  alert: AlertState;
  showAlert: (message: string, type: 'success' | 'error' | 'warning') => void;
  hideAlert: () => void;
  
  // Cache de dados
  autoresCache: CachedAutor[];
  setAutoresCache: (autores: CachedAutor[]) => void;
  generosCache: CachedGenero[];
  setGenerosCache: (generos: CachedGenero[]) => void;
  livrosCache: CachedLivro[];
  setLivrosCache: (livros: CachedLivro[]) => void;
  
  // Estado de carregamento global
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Estado para alertas
  const [alert, setAlert] = useState<AlertState>({
    message: null,
    type: 'success',
    show: false
  });
  
  // Cache de dados
  const [autoresCache, setAutoresCache] = useState<CachedAutor[]>([]);
  const [generosCache, setGenerosCache] = useState<CachedGenero[]>([]);
  const [livrosCache, setLivrosCache] = useState<CachedLivro[]>([]);
  
  // Estado de carregamento global
  const [loading, setLoading] = useState<boolean>(false);
  
  // Funções para gerenciar alertas
  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlert({
      message,
      type,
      show: true
    });
    
    // Auto-esconder após 5 segundos
    setTimeout(() => {
      hideAlert();
    }, 5000);
  };
  
  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      show: false
    }));
  };
  
  const value = {
    alert,
    showAlert,
    hideAlert,
    autoresCache,
    setAutoresCache,
    generosCache,
    setGenerosCache,
    livrosCache,
    setLivrosCache,
    loading,
    setLoading
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
