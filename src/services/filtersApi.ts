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

export const fetchCompanies = async (): Promise<CompanyData[]> => {
  try {
    const response = await api.get<CompanyData[]>(`${ApiPrefix.SERVICE_API}/empresas`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    throw error;
  }
};