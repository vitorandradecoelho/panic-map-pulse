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
    const response = await api.get<LineData[]>(`${ApiPrefix.SERVICE_API}/linhasTrajetos/1241`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar linhas:", error);
    throw error;
  }
};

export const fetchCompanies = async (clienteId: string): Promise<CompanyData[]> => {
  try {
    const response = await api.get<CompanyData[]>(`/api/empresa/consultarPorIdCliente/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    throw error;
  }
};