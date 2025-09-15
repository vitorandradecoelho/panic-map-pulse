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
  id: number;
  nome: string;
  descr: string;
}

export const fetchLines = async (): Promise<LineData[]> => {
  try {
    const cliente = getClienteLocalStorage();
    const clienteId = cliente.idCliente;
    
    console.log(`🔄 Fazendo chamada para /linhasTrajetos/${clienteId}...`);
    const response = await api.get<LineData[]>(`${ApiPrefix.SERVICE_API}/linhasTrajetos/${clienteId}`);
    console.log("✅ Linhas obtidas da API:", response.data);
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
    console.log(`🔄 Fazendo chamada para empresas: ${empresaUrl}`);
    
    const response = await api.get<CompanyData[]>(empresaUrl);
    console.log("✅ Empresas obtidas da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar empresas:", error);
    throw error;
  }
};