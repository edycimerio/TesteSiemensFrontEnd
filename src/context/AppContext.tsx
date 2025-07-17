import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AutorResponse } from '../models/autor';
import { GeneroResponse } from '../models/genero';
import { LivroResponse } from '../models/livro';

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
  autoresCache: AutorResponse[];
  setAutoresCache: (autores: AutorResponse[]) => void;
  generosCache: GeneroResponse[];
  setGenerosCache: (generos: GeneroResponse[]) => void;
  livrosCache: LivroResponse[];
  setLivrosCache: (livros: LivroResponse[]) => void;
  
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
  const [autoresCache, setAutoresCache] = useState<AutorResponse[]>([]);
  const [generosCache, setGenerosCache] = useState<GeneroResponse[]>([]);
  const [livrosCache, setLivrosCache] = useState<LivroResponse[]>([]);
  
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
