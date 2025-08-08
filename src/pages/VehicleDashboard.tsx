import { useState, useMemo } from "react";
import { mockVehicleData, VehicleData, getVehiclesInDateRange } from "@/data/mockData";
import { VehicleFiltersPanel } from "@/components/dashboard/VehicleFiltersPanel";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { KPICard } from "@/components/dashboard/KPICard";
import { Truck, MapPin, Gauge, Building, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const VehicleDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  // Filter vehicles based on current filter states
  const filteredVehicles = useMemo(() => {
    let filtered = mockVehicleData;

    // Filter by date range
    if (startDate || endDate) {
      const start = startDate || new Date('2000-01-01');
      const end = endDate || new Date('2030-12-31');
      filtered = getVehiclesInDateRange(start, end);
    }

    // Filter by line
    if (selectedLine) {
      filtered = filtered.filter(vehicle => vehicle.linha === selectedLine);
    }

    // Filter by company
    if (selectedCompany) {
      filtered = filtered.filter(vehicle => vehicle.empresaId === selectedCompany);
    }

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard de Veículos
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <KPICard
            title="Total de Veículos"
            value={kpiData.totalVehicles}
            icon={<Truck className="h-6 w-6" />}
            trend="neutral"
            trendValue="+0%"
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20"
          />
          
          <KPICard
            title="Com Motorista"
            value={`${kpiData.totalVehicles > 0 ? Math.round((kpiData.vehiclesWithDriver / kpiData.totalVehicles) * 100) : 0}%`}
            icon={<Building className="h-6 w-6" />}
            trend="up"
            trendValue="+5%"
            className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20"
          />
          
          <KPICard
            title="Velocidade Média"
            value={`${Math.round(kpiData.avgSpeed)} km/h`}
            icon={<Gauge className="h-6 w-6" />}
            trend="neutral"
            trendValue="0%"
            className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20"
          />
          
          <KPICard
            title="Linhas Ativas"
            value={kpiData.uniqueLines}
            icon={<MapPin className="h-6 w-6" />}
            trend="up"
            trendValue="+2"
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20"
          />
          
          <KPICard
            title="Empresas"
            value={kpiData.uniqueCompanies}
            icon={<Building className="h-6 w-6" />}
            trend="neutral"
            trendValue="0"
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20"
          />
          
          <KPICard
            title="Última Transmissão"
            value={kpiData.latestTransmission ? format(kpiData.latestTransmission, "HH:mm", { locale: ptBR }) : "N/A"}
            icon={<Clock className="h-6 w-6" />}
            trend="neutral"
            trendValue="Agora"
            className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20"
          />
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