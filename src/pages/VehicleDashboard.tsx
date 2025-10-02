import { useState, useMemo } from "react";
import { VehicleData } from "@/data/mockData";
import { VehicleFiltersPanel } from "@/components/dashboard/VehicleFiltersPanel";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { KPICard } from "@/components/dashboard/KPICard";
import { Header } from "@/components/layout/Header";
import { Truck, MapPin, Gauge, Building, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";
import { usePainelEventos } from "@/hooks/usePainelEventos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const VehicleDashboard = () => {
  const { t } = useTranslation();
  
  // Define datas padrão: início = início do dia atual, fim = fim do dia atual
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  const [startDate, setStartDate] = useState<Date | null>(startOfDay);
  const [endDate, setEndDate] = useState<Date | null>(endOfDay);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  // Buscar dados da API de eventos de pânico
  const { 
    vehicles: apiVehicles, 
    isLoading, 
    error, 
    refetch, 
    total,
    hasData 
  } = usePainelEventos({
    startDate,
    endDate,
    selectedLine,
    selectedCompany,
    enabled: isQueryEnabled
  });

  const handleSearch = (filters: {
    start: Date | null;
    end: Date | null;
    line: string | null;
    company: number | null;
  }) => {
    setStartDate(filters.start);
    setEndDate(filters.end);
    setSelectedLine(filters.line);
    setSelectedCompany(filters.company);
    if (!isQueryEnabled) {
      setIsQueryEnabled(true);
    }
  };

  // Use API data as the primary source
  const filteredVehicles = apiVehicles;

  // Calculate KPI data based on filtered vehicles
  const kpiData = useMemo(() => {
    const totalVehicles = filteredVehicles.length;
    const vehiclesWithDriver = filteredVehicles.filter(v => v.motorista && v.motorista !== "0").length;
    const vehiclesWithSpeed = filteredVehicles.filter(v => v.velocidadeMedia).length;
    
    const avgSpeed = vehiclesWithSpeed > 0 
      ? filteredVehicles
          .filter(v => v.velocidadeMedia)
          .reduce((sum, v) => sum + parseFloat(v.velocidadeMedia!), 0) / vehiclesWithSpeed
      : 0;

    const uniqueLines = new Set(filteredVehicles.map(v => v.linha)).size;
    const uniqueCompanies = new Set(filteredVehicles.map(v => v.empresaId)).size;

    // Get most recent transmission
    const latestTransmission = filteredVehicles.reduce((latest, vehicle) => {
      const [datePart, timePart] = vehicle.dataTransmissaoS.split(' ');
      const [day, month, year] = datePart.split('/');
      const vehicleDate = new Date(`${year}-${month}-${day}T${timePart}`);
      
      if (!latest) return vehicleDate;
      
      const [latestDatePart, latestTimePart] = latest.toISOString().split('T');
      const latestDate = new Date(`${latestDatePart}T${latestTimePart.split('.')[0]}`);
      
      return vehicleDate > latestDate ? vehicleDate : latest;
    }, null as Date | null);

    return {
      totalVehicles,
      vehiclesWithDriver,
      avgSpeed,
      uniqueLines,
      uniqueCompanies,
      latestTransmission
    };
  }, [filteredVehicles]);

  const dateRangeText = startDate && endDate 
    ? `${format(startDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    : startDate 
    ? `A partir de ${format(startDate, "dd/MM/yyyy", { locale: ptBR })}`
    : endDate
    ? `Até ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    : "Todos os períodos";

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('dashboard.title')}
              </h1>
              <p className="text-muted-foreground">
                Monitoramento em tempo real • {dateRangeText} • {total} eventos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={refetch}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 p-6 border-destructive/50 bg-destructive/5">
            <div className="flex items-center space-x-2 text-destructive">
              <span className="font-medium">Erro ao carregar dados:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Filters */}
        <VehicleFiltersPanel
          onSearch={handleSearch}
          selectedDateRange={{ start: startDate, end: endDate }}
          selectedLine={selectedLine}
          selectedCompany={selectedCompany}
          isLoading={isLoading}
        />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <KPICard
            title={t('dashboard.kpis.totalVehicles')}
            value={kpiData.totalVehicles}
            icon={<Truck className="h-6 w-6" />}
            trend="neutral"
            trendValue="+0%"
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20"
          />
          
          <KPICard
            title={t('dashboard.kpis.uniqueCompanies')}
            value={kpiData.uniqueCompanies}
            icon={<Building className="h-6 w-6" />}
            trend="neutral"
            trendValue="0"
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20"
          />
        </div>

        {/* Heat Map */}
        <div className="mb-8">
          <HeatMap vehicles={filteredVehicles} />
        </div>

        {/* Vehicle Table */}
        <VehicleTable 
          vehicles={filteredVehicles} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default VehicleDashboard;