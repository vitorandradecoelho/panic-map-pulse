import { ApiPrefix } from "@/m2mconfig";
import api from "./api";

// Interfaces para tipagem do sistema de autenticação
export interface ICliente {
  idCliente: number;
  gmtCliente: string;
  nomeUsuario: string;
  idUsuario: string;
  empresas: number[];
  acessos: Record<string, unknown>[];
  inicioDiaOperacional: string;
}

export interface IUserDataResponse {
  cli: {
    id: number;
    tz: string;
  };
  user: {
    id: string;
    nm: string;
    emp: number[];
    acss: Record<string, unknown>[];
  };
  conf: {
    lang?: string;
    keys?: { chave: string; valor: string }[];
  };
}

export interface IAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Estado global da autenticação
let language: string | null = null;
let token: string | null = null;
let authState: IAuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const cliente: ICliente = {
  idCliente: 0,
  acessos: [],
  empresas: [],
  gmtCliente: "",
  nomeUsuario: "",
  idUsuario: "",
  inicioDiaOperacional: "00:00:00",
};

/**
 * Captura token e zona dos parâmetros da URL ou hash
 * Suporta tanto ?token=...&zn=... quanto #token=...&zn=...
 */
const extractUrlParams = (): { token: string | null; zone: string | null } => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  const token = urlParams.get("token") || hashParams.get("token");
  const zone = urlParams.get("zn") || hashParams.get("zn");
  
  return { token, zone };
};

/**
 * Gerencia zona no storage (sessionStorage prioritário, localStorage como fallback)
 */
export const getZoneFromStorage = (): string | null => {
  return sessionStorage.getItem("zn") || localStorage.getItem("zone");
};

export const setZoneInStorage = (zone: string): void => {
  sessionStorage.setItem("zn", zone);
  localStorage.setItem("zone", zone);
};

/**
 * Inicialização completa do sistema de autenticação
 */
export const initializeAuth = async (
  urlToken?: string | null,
  urlZone?: string | null
): Promise<boolean> => {
  try {
    authState.isLoading = true;
    authState.error = null;

    console.log("🔄 Iniciando autenticação...");
    console.log("🔍 URL atual:", window.location.href);
    
    // Extrair parâmetros da URL se não fornecidos
    if (!urlToken || !urlZone) {
      const params = extractUrlParams();
      urlToken = urlToken || params.token;
      urlZone = urlZone || params.zone;
    }

    console.log("📋 Parâmetros detectados:", { 
      token: urlToken ? "PRESENTE" : "AUSENTE", 
      zone: urlZone,
      tokenLength: urlToken?.length || 0 
    });

    // Gerenciar token
    if (urlToken) {
      setToken(urlToken);
      console.log("✅ Token salvo no localStorage");
    } else {
      token = getToken();
      console.log("📦 Token recuperado do localStorage:", token ? "PRESENTE" : "AUSENTE");
    }

    // Gerenciar zona e atualizar URLs da API
    if (urlZone) {
      setZoneInStorage(urlZone);
      console.log("✅ Zone salva:", urlZone);
      
      const { updateApiUrls } = await import("../m2mconfig");
      const zoneWithPrefix = urlZone.startsWith("zn") ? urlZone : `zn${urlZone}`;
      updateApiUrls(zoneWithPrefix);
    }

    if (!token) {
      console.warn("⚠️ Nenhum token disponível - executando em modo demo");
      authState.isAuthenticated = false;
      return false;
    }

    // Validar token e carregar dados do usuário
    await loadUserData();
    
    authState.isAuthenticated = true;
    console.log("✅ Autenticação concluída com sucesso");
    return true;

  } catch (error) {
    console.error("❌ Erro na autenticação:", error);
    authState.error = error instanceof Error ? error.message : "Erro desconhecido";
    authState.isAuthenticated = false;
    throw error;
  } finally {
    authState.isLoading = false;
  }
};

/**
 * Carrega dados do usuário da API
 */
const loadUserData = async (): Promise<void> => {
  console.log("🌐 Carregando dados do usuário...");
  console.log("🔗 URL da API:", `${ApiPrefix.SERVICE_API}/user/data`);
  
  const response = await api.get<IUserDataResponse>(
    `${ApiPrefix.SERVICE_API}/user/data`
  );

  console.log("✅ Dados do usuário recebidos:", response.data);

  // Processar dados da resposta
  language = languageToUpper(response.data.conf?.lang) || "pt-BR";
  cliente.idCliente = response.data.cli?.id || 0;
  cliente.gmtCliente = response.data.cli?.tz || "America/Fortaleza";
  cliente.acessos = response.data.user?.acss || [];
  cliente.empresas = response.data.user?.emp || [];
  cliente.nomeUsuario = response.data.user?.nm || "";
  cliente.idUsuario = response.data.user?.id || "";

  // Processar configurações especiais
  const chaveDiaOperacional = response.data.conf?.keys?.find(
    (item) => item.chave === "INICIO_DIA_OPERACIONAL"
  );
  cliente.inicioDiaOperacional = chaveDiaOperacional?.valor || "00:00:00";

  console.log("👤 Cliente configurado:", {
    idCliente: cliente.idCliente,
    nomeUsuario: cliente.nomeUsuario,
    empresas: cliente.empresas,
    timezone: cliente.gmtCliente
  });
};

// Manter compatibilidade com código existente
export const initGetLocalStorage = initializeAuth;

// ========== GERENCIAMENTO DE TOKEN ==========

export const getToken = (): string | null => {
  if (!token) {
    token = localStorage.getItem("token");
  }
  return token;
};

export const setToken = (newToken: string): void => {
  token = newToken;
  localStorage.setItem("token", newToken);
  authState.isAuthenticated = true;
};

export const clearToken = (): void => {
  token = null;
  localStorage.removeItem("token");
  sessionStorage.removeItem("zn");
  localStorage.removeItem("zone");
  authState.isAuthenticated = false;
  authState.error = null;
  
  // Limpar dados do cliente
  cliente.idCliente = 0;
  cliente.acessos = [];
  cliente.empresas = [];
  cliente.gmtCliente = "";
  cliente.nomeUsuario = "";
  cliente.idUsuario = "";
  cliente.inicioDiaOperacional = "00:00:00";
  
  console.log("🧹 Dados de autenticação limpos");
};

// ========== UTILITÁRIOS ==========

const languageToUpper = (param: string): string => {
  if (!param) return param;

  const parts = param.split("-");

  if (parts.length === 1) return parts[0].toLowerCase();

  return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
};

export const getLanguage = (): string => language || "pt-BR";

export const getClienteLocalStorage = (): ICliente => cliente;

export const isAuthenticated = (): boolean => !!getToken();

export const getAuthState = (): IAuthState => ({ ...authState });

/**
 * Força recarregamento dos dados do usuário
 */
export const refreshUserData = async (): Promise<void> => {
  if (!isAuthenticated()) {
    throw new Error("Usuário não autenticado");
  }
  
  await loadUserData();
};

/**
 * Logout completo do sistema
 */
export const logout = (): void => {
  clearToken();
  
  // Opcional: redirecionar ou atualizar UI
  console.log("👋 Logout realizado");
};