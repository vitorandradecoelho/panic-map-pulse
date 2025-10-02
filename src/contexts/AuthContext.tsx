import React, { createContext, useContext } from 'react';
import { useAuth, UseAuthReturn } from '@/hooks/useAuth';

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  
  return context;
};

// Hook para verificar se usuário está autenticado
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  return {
    isAuthenticated,
    isLoading,
    canAccess: isAuthenticated || !isLoading // Permite acesso em modo demo
  };
};

// Hook para obter dados do cliente
export const useCliente = () => {
  const { cliente, isAuthenticated } = useAuthContext();
  
  return {
    cliente,
    hasClientData: cliente.idCliente > 0,
    isAuthenticated
  };
};