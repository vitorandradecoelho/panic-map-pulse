import { 
  getToken, 
  setToken, 
  clearToken, 
  isAuthenticated, 
  getClienteLocalStorage,
  getLanguage,
  ICliente 
} from '@/services/auth';

/**
 * Utilitários para facilitar o uso do sistema de autenticação
 */

export const AuthUtils = {
  // Verificações rápidas
  isLoggedIn: (): boolean => isAuthenticated(),
  hasToken: (): boolean => !!getToken(),
  
  // Dados do usuário
  getCurrentUser: (): ICliente => getClienteLocalStorage(),
  getUserId: (): string => getClienteLocalStorage().idUsuario,
  getClientId: (): number => getClienteLocalStorage().idCliente,
  getUserName: (): string => getClienteLocalStorage().nomeUsuario,
  getUserCompanies: (): number[] => getClienteLocalStorage().empresas,
  getUserTimezone: (): string => getClienteLocalStorage().gmtCliente,
  getUserLanguage: (): string => getLanguage(),
  
  // Permissões
  hasAccess: (requiredAccess: string): boolean => {
    const cliente = getClienteLocalStorage();
    return cliente.acessos.some(access => 
      access && typeof access === 'object' && 'modulo' in access && 
      access.modulo === requiredAccess
    );
  },
  
  hasCompanyAccess: (companyId: number): boolean => {
    const cliente = getClienteLocalStorage();
    return cliente.empresas.includes(companyId);
  },
  
  // Modo demo
  isDemoMode: (): boolean => {
    const cliente = getClienteLocalStorage();
    return !isAuthenticated() || cliente.idCliente === 0;
  },
  
  // Informações do sistema
  getSystemInfo: () => ({
    isAuthenticated: isAuthenticated(),
    isDemoMode: AuthUtils.isDemoMode(),
    hasClientData: getClienteLocalStorage().idCliente > 0,
    userLanguage: getLanguage(),
    userTimezone: getClienteLocalStorage().gmtCliente,
    companiesCount: getClienteLocalStorage().empresas.length,
  }),
  
  // Logout com limpeza completa
  performLogout: (): void => {
    clearToken();
    
    // Opcional: Redirecionar para página de login
    console.log('👋 Logout realizado');
    
    // Emitir evento personalizado para components reagirem
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },
  
  // Login com token externo
  performLogin: (token: string, zone?: string): void => {
    setToken(token);
    
    if (zone) {
      sessionStorage.setItem("zn", zone);
      localStorage.setItem("zone", zone);
    }
    
    console.log('✅ Login realizado com token externo');
    
    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('auth:login', { 
      detail: { token, zone } 
    }));
  },
};

/**
 * Constantes úteis para o sistema de autenticação
 */
export const AUTH_CONSTANTS = {
  STORAGE_KEYS: {
    TOKEN: 'token',
    ZONE: 'zone',
    SESSION_ZONE: 'zn',
  },
  
  EVENTS: {
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    UNAUTHORIZED: 'auth:unauthorized',
  },
  
  DEMO_MODE: {
    DEFAULT_TIMEZONE: 'America/Fortaleza',
    DEFAULT_LANGUAGE: 'pt-BR',
  },
  
  API_ERRORS: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
} as const;

/**
 * Tipos para facilitar o desenvolvimento
 */
export type AuthEvent = typeof AUTH_CONSTANTS.EVENTS[keyof typeof AUTH_CONSTANTS.EVENTS];
export type StorageKey = typeof AUTH_CONSTANTS.STORAGE_KEYS[keyof typeof AUTH_CONSTANTS.STORAGE_KEYS];

export default AuthUtils;