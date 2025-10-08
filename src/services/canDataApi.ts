import api from "./api";
import { CANVehicleData } from "@/data/canMockData";

const CAN_API_BASE_URL = "http://localhost:3001/api/v1";

export interface CANDataQueryParams {
  serial: string;
  dataInicio: string;
  dataFim: string;
}

export const fetchCANDataByDate = async (params: CANDataQueryParams): Promise<CANVehicleData[]> => {
  try {
    const { serial, dataInicio, dataFim } = params;
    const url = `${CAN_API_BASE_URL}/candatabydate?serial=${serial}&dataInicio=${dataInicio}&dataFim=${dataFim}`;
    
    console.log("🔍 Consultando dados CAN:", url);
    
    const response = await api.get<CANVehicleData[]>(url);
    console.log("✅ Dados CAN recebidos:", response.data.length, "registros");
    
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar dados CAN:", error);
    throw error;
  }
};
