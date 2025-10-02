import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPainelEventos, createDefaultFilter, PainelEventosFilter } from '@/services/painelEventosApi';
import { useAuthContext } from '@/contexts/AuthContext';
import { VehicleData } from '@/data/mockData';

export interface UsePainelEventosParams {
  startDate?: Date | null;
  endDate?: Date | null;
  selectedLine?: string | null;
  selectedCompany?: number | null;
  enabled?: boolean;
}

export interface UsePainelEventosReturn {
  vehicles: VehicleData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  total: number;
  hasData: boolean;
}

/**
 * Hook para gerenciar dados dos eventos de pânico
 */
export const usePainelEventos = ({
  startDate,
  endDate,
  selectedLine,
  selectedCompany,
  enabled = true
}: UsePainelEventosParams = {}): UsePainelEventosReturn => {
  const { cliente, isAuthenticated } = useAuthContext();
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);

  // Criar filtro baseado nos parâmetros
  const filter = createDefaultFilter(
    startDate,
    endDate,
    selectedLine ? [selectedLine] : [],
    selectedCompany
  );

  // Query para buscar dados da API
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['painelEventos', cliente.idCliente, filter],
    queryFn: () => fetchPainelEventos(cliente.idCliente, filter),
    enabled: enabled && cliente.idCliente > 0,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 15000, // Considerar dados obsoletos após 15 segundos
    retry: (failureCount, error: any) => {
      // Não tentar novamente em casos de 401 ou 403
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2; // Máximo 2 tentativas
    },
  });

  // Atualizar veículos quando os dados da API mudarem
  useEffect(() => {
    if (apiResponse?.data) {
      setVehicles(apiResponse.data);
    }
  }, [apiResponse]);

  // Aplicar filtros locais adicionais se necessário
  const filteredVehicles = vehicles.filter(vehicle => {
    if (selectedLine && vehicle.linha !== selectedLine) {
      return false;
    }
    if (selectedCompany && vehicle.empresaId !== selectedCompany) {
      return false;
    }
    return true;
  });

  const refetchData = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    vehicles: filteredVehicles,
    isLoading,
    error: error ? 'Erro ao carregar dados do painel de eventos' : null,
    refetch: refetchData,
    total: apiResponse?.total || 0,
    hasData: filteredVehicles.length > 0
  };
};