import api from "./api";
import { ApiPrefix } from "../m2mconfig";

export interface LineData {
  id: string;
  nome: string;
}

export interface CompanyData {
  id: number;
  nome: string;
}

export const fetchLines = async (): Promise<LineData[]> => {
  try {
    console.log("🔄 Fazendo chamada para /linhasTrajetos/1241...");
    const response = await api.get<LineData[]>(`${ApiPrefix.SERVICE_API}/linhasTrajetos/1241`);
    console.log("✅ Linhas obtidas da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar linhas:", error);
    throw error;
  }
};

export const fetchCompanies = async (clienteId: string): Promise<CompanyData[]> => {
  try {
    console.log(`🔄 Fazendo chamada para /api/empresa/consultarPorIdCliente/${clienteId}...`);
    const response = await api.get<CompanyData[]>(`/api/empresa/consultarPorIdCliente/${clienteId}`);
    console.log("✅ Empresas obtidas da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar empresas:", error);
    throw error;
  }
};