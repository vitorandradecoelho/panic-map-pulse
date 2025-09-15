import { ApiPrefix } from "@/m2mconfig";
import api from "./api";

interface ICliente {
  idCliente: number;
  gmtCliente: string;
  nomeUsuario: string;
  idUsuario: string;
  empresas: number[];
  acessos: Record<string, unknown>[]; // substitui object[] por tipo genérico seguro
  inicioDiaOperacional: string;
}

interface IUserDataResponse {
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

let language: string | null = null;
let token: string | null = null;
const cliente: ICliente = {
  idCliente: 0,
  acessos: [],
  empresas: [],
  gmtCliente: "",
  nomeUsuario: "",
  idUsuario: "",
  inicioDiaOperacional: "00:00:00",
};

export const initGetLocalStorage = async (
  urlToken?: string | null,
  urlZone?: string | null
): Promise<boolean> => {
  console.log("🔄 Iniciando autenticação...");
  console.log("🔍 URL atual:", window.location.href);
  console.log("🔍 Search params:", window.location.search);
  
  const params = new URLSearchParams(window.location.search);
  console.log("🔍 Todos os parâmetros:", Array.from(params.entries()));

  if (!urlToken) {
    urlToken = params.get("token");
  }

  if (!urlZone) {
    urlZone = params.get("zn");
  }

  console.log("📋 Parâmetros da URL:", { 
    token: urlToken ? "PRESENTE" : "AUSENTE", 
    zone: urlZone,
    tokenLength: urlToken?.length || 0 
  });

  if (urlToken) {
    token = urlToken;
    localStorage.setItem("token", token);
    console.log("✅ Token salvo no localStorage");
  } else {
    token = localStorage.getItem("token");
    console.log("📦 Token recuperado do localStorage:", token ? "PRESENTE" : "AUSENTE");
  }

  if (urlZone) {
    sessionStorage.setItem("zn", urlZone);
    localStorage.setItem("zone", urlZone);
    console.log("✅ Zone salva:", urlZone);
    
    // Atualizar URLs da API com a nova zone
    const { updateApiUrls } = await import("../m2mconfig");
    updateApiUrls(urlZone);
  }

  if (!token) {
    console.warn("⚠️ Nenhum token disponível - executando em modo demo");
    return false;
  }

  try {
    console.log("🌐 Fazendo chamada para /user/data...");
    console.log("🔗 URL final que será chamada:", `${ApiPrefix.SERVICE_API}/user/data`);
    const response = await api.get<IUserDataResponse>(
      `${ApiPrefix.SERVICE_API}/user/data`
    );

    console.log("✅ Resposta da API user/data:", response.data);

    language = languageToUpper(response.data.conf?.lang) || "pt-BR";
    cliente.idCliente = response.data.cli?.id || 0;
    cliente.gmtCliente = response.data.cli?.tz || "America/Fortaleza";
    cliente.acessos = response.data.user?.acss || [];
    cliente.empresas = response.data.user?.emp || [];
    cliente.nomeUsuario = response.data.user?.nm || "";
    cliente.idUsuario = response.data.user?.id || "";

    const chaveDiaOperacional = response.data.conf?.keys?.find(
      (item) => item.chave === "INICIO_DIA_OPERACIONAL"
    );

    cliente.inicioDiaOperacional = chaveDiaOperacional?.valor || "00:00:00";

    console.log("👤 Dados do cliente carregados:", {
      idCliente: cliente.idCliente,
      nomeUsuario: cliente.nomeUsuario,
      empresas: cliente.empresas
    });

    return true;
  } catch (error) {
    console.error("❌ Erro na autenticação:", error);
    throw error;
  }
};

export const getToken = (): string | null => token;

export const setToken = (newToken: string): void => {
  token = newToken;
  localStorage.setItem("token", newToken);
};

export const clearToken = (): void => {
  token = null;
  localStorage.removeItem("token");
  sessionStorage.removeItem("zn");
};

const languageToUpper = (param: string): string => {
  if (!param) return param;

  const parts = param.split("-");

  if (parts.length === 1) return parts[0].toLowerCase();

  return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
};

export const getLanguage = (): string => language || "pt-BR";

export const getClienteLocalStorage = (): ICliente => cliente;

export const isAuthenticated = (): boolean => !!getToken();