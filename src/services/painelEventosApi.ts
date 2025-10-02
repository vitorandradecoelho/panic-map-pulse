import api from './api';
import { VehicleData } from '@/data/mockData';
import { getZoneFromStorage } from './auth';
import { ApiPrefix } from '@/m2mconfig';

export interface PainelEventosFilter {
  veiculos: string[];
  filtraVeiculos: boolean;
  tipoEvento: string[];
  inicio: string; // "YYYY-MM-DD HH:mm"
  fim: string; // "YYYY-MM-DD HH:mm"
  currentPage: number;
  numPerPage: number;
  linhasSelecionadas: string[];
  codMotorista: string;
  empresaId?: number;
}

export interface PainelEventosResponse {
  data: VehicleData[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Busca eventos de pânico da API
 */
export const fetchPainelEventos = async (
  clienteId: number,
  filter: PainelEventosFilter
): Promise<PainelEventosResponse> => {
  try {
    // Resolver zona a partir do storage ou das URLs do m2mconfig
    let zone = getZoneFromStorage();
    if (!zone) {
      try {
        const host = new URL(ApiPrefix.SERVICE).hostname; // ex: zn5.m2mcontrol.com.br
        zone = host.split('.')[0];
      } catch {
        zone = 'zn0';
      }
    }
    const zoneWithPrefix = zone.startsWith('zn') ? zone : `zn${zone}`;
    
    const filterParam = encodeURIComponent(JSON.stringify(filter));
    const url = `https://${zoneWithPrefix}.sinopticoplus.com/api/painelEventos/${clienteId}?filter=${filterParam}`;

    const response = await api.get(url);

    // Transformar os dados da API para o formato esperado
    const transformedData: VehicleData[] = (response.data.result || response.data.data || response.data || []).map((item: any) => ({
      _id: item._id || item.id,
      empresaId: item.empresaId,
      prefixoVeiculo: item.prefixoVeiculo || item.veiculo,
      dataTransmissaoS: item.dataTransmissaoS || item.dataTransmissao,
      gps: {
        type: "Point",
        coordinates: item.gps?.coordinates || [item.longitude || 0, item.latitude || 0]
      },
      motorista: item.motorista || "",
      linha: item.linha || (item.linhaDescr ? item.linhaDescr.split(' - ')[0] : ""),
      linhaDescricao: item.linhaDescr || item.descricaoLinha || "",
      velocidadeMedia: item.velocidadeAtual?.toString() || item.velocidadeMedia?.toString() || item.velocidade?.toString(),
      nomeEmpresa: item.nomeEmpresa || "",
      nomeAlerta: item.nomeAlerta || "Pânico",
      lido: item.lido || false,
      eventoFinalizado: item.eventoFinalizado || false,
      panico: true // Eventos de pânico sempre têm essa flag
    }));

    return {
      data: transformedData,
      total: response.data.totalItens || response.data.total || transformedData.length,
      page: filter.currentPage,
      totalPages: response.data.totalPages || Math.ceil((response.data.totalItens || response.data.total || transformedData.length) / filter.numPerPage)
    };
  } catch (error) {
    console.error("❌ Erro ao buscar eventos de pânico:", error);
    
    // Em caso de erro, retornar estrutura vazia para não quebrar a aplicação
    return {
      data: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }
};

/**
 * Formatar data para o formato esperado pela API (YYYY-MM-DD HH:mm)
 */
export const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Criar filtro padrão para a API
 */
export const createDefaultFilter = (
  startDate?: Date | null,
  endDate?: Date | null,
  selectedLines?: string[],
  empresaId?: number
): PainelEventosFilter => {
  const today = new Date();
  const start = startDate || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const end = endDate || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return {
    veiculos: [],
    filtraVeiculos: false,
    tipoEvento: ["panico"],
    inicio: formatDateForApi(start),
    fim: formatDateForApi(end),
    currentPage: 1,
    numPerPage: 500,
    linhasSelecionadas: selectedLines || [],
    codMotorista: "",
    empresaId
  };
};