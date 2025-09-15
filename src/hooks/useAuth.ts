import { useState, useEffect, useCallback } from 'react';
import { 
  initializeAuth, 
  isAuthenticated, 
  getAuthState, 
  getClienteLocalStorage,
  logout as authLogout,
  refreshUserData,
  IAuthState,
  ICliente 
} from '@/services/auth';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  cliente: ICliente;
  login: (token?: string, zone?: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook customizado para gerenciar estado de autenticação
 */
export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<IAuthState>(() => getAuthState());
  const [cliente, setCliente] = useState<ICliente>(() => getClienteLocalStorage());

  // Escutar eventos de autenticação
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthState(getAuthState());
      setCliente(getClienteLocalStorage());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setAuthState(getAuthState());
      }
    };

    // Event listeners
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = useCallback(async (token?: string, zone?: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const success = await initializeAuth(token, zone);
      setAuthState(getAuthState());
      setCliente(getClienteLocalStorage());
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na autenticação';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false
      }));
      return false;
    }
  }, []);

  const logout = useCallback((): void => {
    authLogout();
    setAuthState(getAuthState());
    setCliente(getClienteLocalStorage());
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await refreshUserData();
      setAuthState(getAuthState());
      setCliente(getClienteLocalStorage());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar dados';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, []);

  const clearError = useCallback((): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    cliente,
    login,
    logout,
    refresh,
    clearError
  };
};