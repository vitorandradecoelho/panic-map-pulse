import { useState, useMemo } from "react";
import { mockVehicleData, VehicleData, getVehiclesInDateRange } from "@/data/mockData";
import { VehicleFiltersPanel } from "@/components/dashboard/VehicleFiltersPanel";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { KPICard } from "@/components/dashboard/KPICard";
import { TopLinesKPI } from "@/components/dashboard/TopLinesKPI";
import { Header } from "@/components/layout/Header";
import { Truck, MapPin, Gauge, Building, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";

const VehicleDashboard = () => {
  console.log("🚗 VehicleDashboard: Iniciando renderização...");
  
  const { t } = useTranslation();
  console.log("🌐 VehicleDashboard: useTranslation inicializado");
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  
  console.log("🔧 VehicleDashboard: Estados inicializados");

  // Filter vehicles based on current filter states
  const filteredVehicles = useMemo(() => {
    console.log("🚗 VehicleDashboard: Calculando veículos filtrados...");
    let filtered = mockVehicleData;
    console.log("🚗 VehicleDashboard: Dados totais:", mockVehicleData.length, "veículos");

    // Filter by date range
    if (startDate || endDate) {
      const start = startDate || new Date('2000-01-01');
      const end = endDate || new Date('2030-12-31');
      filtered = getVehiclesInDateRange(start, end);
      console.log("🚗 VehicleDashboard: Filtro por data aplicado:", filtered.length, "veículos");
    }

    // Filter by line
    if (selectedLine) {
      filtered = filtered.filter(vehicle => vehicle.linha === selectedLine);
      console.log("🚗 VehicleDashboard: Filtro por linha aplicado:", filtered.length, "veículos");
    }

    // Filter by company
    if (selectedCompany) {
      filtered = filtered.filter(vehicle => vehicle.empresaId === selectedCompany);
      console.log("🚗 VehicleDashboard: Filtro por empresa aplicado:", filtered.length, "veículos");
    }

    console.log("🚗 VehicleDashboard: Filtros finalizados:", filtered.length, "veículos");
    return filtered;
  }, [startDate, endDate, selectedLine, selectedCompany]);

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

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const dateRangeText = startDate && endDate 
    ? `${format(startDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    : startDate 
    ? `A partir de ${format(startDate, "dd/MM/yyyy", { locale: ptBR })}`
    : endDate
    ? `Até ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    : "Todos os períodos";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('dashboard.title')}
              </h1>
              <p className="text-muted-foreground">
                Monitoramento em tempo real • {dateRangeText}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <VehicleFiltersPanel
          onDateRangeChange={handleDateRangeChange}
          onLineChange={setSelectedLine}
          onCompanyChange={setSelectedCompany}
          selectedDateRange={{ start: startDate, end: endDate }}
          selectedLine={selectedLine}
          selectedCompany={selectedCompany}
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

        {/* Top Lines KPI */}
        <div className="mb-8">
          <TopLinesKPI vehicles={filteredVehicles} />
        </div>

        {/* Heat Map */}
        <div className="mb-8">
          <HeatMap vehicles={filteredVehicles} />
        </div>

        {/* Vehicle Table */}
        <VehicleTable vehicles={filteredVehicles} />
      </div>
    </div>
  );
};

export default VehicleDashboard;