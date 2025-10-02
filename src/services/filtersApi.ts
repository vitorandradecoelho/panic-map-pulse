import api from "./api";
import { ApiPrefix } from "../m2mconfig";
import { getClienteLocalStorage } from "./auth";
import { getZoneFromStorage } from "./auth";

export interface LineData {
  id: string;
  nome: string;
  descr: string;
}

export interface CompanyData {
  empresaId: number;
  clienteId: number;
  id_integracao_empresa: number;
  ativo: boolean;
  cod_externo: string | null;
  nomeEmpresa: string;
  razaoSocial: string;
  cnpj: string;
  identificador: string;
  logradouro: string;
  cep: string | null;
  numero: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  complemento: string;
  nomeContato: string;
  telefoneContato: string;
  emailContatoUm: string;
  emailContatoDois: string;
  idIntegracaoEmpresa: number;
  codTransportadora: number;
  toForecast: boolean;
  loginObrigatorio: boolean;
}

export const fetchLines = async (): Promise<LineData[]> => {
  try {
    const cliente = getClienteLocalStorage();
    const clienteId = cliente.idCliente;
    
    const response = await api.get<LineData[]>(`${ApiPrefix.SERVICE_API}/linhasTrajetos/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar linhas:", error);
    throw error;
  }
};

export const fetchCompanies = async (clienteId: string): Promise<CompanyData[]> => {
  try {
    // Garantir que a zona tenha o prefixo "zn"
    const zone = getZoneFromStorage() || '0';
    const zoneWithPrefix = zone.startsWith('zn') ? zone : `zn${zone}`;
    const empresaUrl = `https://${zoneWithPrefix}.sinopticoplus.com/api/empresa/consultarPorIdCliente/${clienteId}`;
    
    const response = await api.get<CompanyData[]>(empresaUrl);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar empresas:", error);
    throw error;
  }
};