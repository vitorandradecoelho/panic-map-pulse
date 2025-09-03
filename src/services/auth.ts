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
  const params = new URLSearchParams(window.location.search);

  if (!urlToken) {
    urlToken = params.get("token");
  }

  if (!urlZone) {
    urlZone = params.get("zn");
  }

  if (urlToken) {
    token = urlToken;
    localStorage.setItem("token", token);
  } else {
    token = localStorage.getItem("token");
  }

  if (urlZone) {
    sessionStorage.setItem("zn", urlZone);
    localStorage.setItem("zone", urlZone);
  }

  if (!token) {
    throw new Error("No token available");
  }

  try {
    const response = await api.get<IUserDataResponse>(
      `${ApiPrefix.SERVICE_API}/user/data`
    );

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

    return true;
  } catch (error) {
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