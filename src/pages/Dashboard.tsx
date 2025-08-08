import { useState, useMemo } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { FiltersPanel } from "@/components/dashboard/FiltersPanel";
import { AlertsTable } from "@/components/dashboard/AlertsTable";
import { mockPanicAlerts, PanicAlert } from "@/data/mockData";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  TrendingUp,
  Users,
  Timer
} from "lucide-react";
import { subDays, isWithinInterval, format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | undefined>();
  const [selectedSeverity, setSelectedSeverity] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const filteredAlerts = useMemo(() => {
    let filtered = mockPanicAlerts;

    // Date filter
    if (startDate && endDate) {
      filtered = filtered.filter(alert => 
        isWithinInterval(new Date(alert.timestamp), { start: startDate, end: endDate })
      );
    }

    // Neighborhood filter
    if (selectedNeighborhood && selectedNeighborhood !== 'all') {
      filtered = filtered.filter(alert => alert.neighborhood === selectedNeighborhood);
    }

    // Severity filter
    if (selectedSeverity && selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    // Status filter
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(alert => 
        selectedStatus === 'resolved' ? alert.resolved : !alert.resolved
      );
    }

    return filtered;
  }, [startDate, endDate, selectedNeighborhood, selectedSeverity, selectedStatus]);

  const kpiData = useMemo(() => {
    const totalAlerts = filteredAlerts.length;
    const resolvedAlerts = filteredAlerts.filter(alert => alert.resolved).length;
    const pendingAlerts = totalAlerts - resolvedAlerts;
    const criticalAlerts = filteredAlerts.filter(alert => alert.severity === 'critical').length;
    
    const responseTimeAlerts = filteredAlerts.filter(alert => alert.responseTime);
    const avgResponseTime = responseTimeAlerts.length > 0 
      ? Math.round(responseTimeAlerts.reduce((sum, alert) => sum + (alert.responseTime || 0), 0) / responseTimeAlerts.length)
      : 0;

    const neighborhoods = [...new Set(filteredAlerts.map(alert => alert.neighborhood))];
    const topNeighborhood = neighborhoods.reduce((top, neighborhood) => {
      const count = filteredAlerts.filter(alert => alert.neighborhood === neighborhood).length;
      return count > (filteredAlerts.filter(alert => alert.neighborhood === top).length || 0) 
        ? neighborhood 
        : top;
    }, neighborhoods[0] || 'N/A');

    // Previous period for comparison (same period length, but shifted back)
    const periodLength = endDate && startDate 
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 7;
    
    const previousPeriodStart = startDate ? subDays(startDate, periodLength) : subDays(new Date(), 14);
    const previousPeriodEnd = startDate ? startDate : subDays(new Date(), 7);
    
    const previousAlerts = mockPanicAlerts.filter(alert => 
      isWithinInterval(new Date(alert.timestamp), { 
        start: previousPeriodStart, 
        end: previousPeriodEnd 
      })
    );

    const alertsChange = previousAlerts.length > 0 
      ? Math.round(((totalAlerts - previousAlerts.length) / previousAlerts.length) * 100)
      : 0;

    const criticalChange = previousAlerts.filter(a => a.severity === 'critical').length > 0
      ? Math.round(((criticalAlerts - previousAlerts.filter(a => a.severity === 'critical').length) / previousAlerts.filter(a => a.severity === 'critical').length) * 100)
      : 0;

    return {
      totalAlerts,
      resolvedAlerts,
      pendingAlerts,
      criticalAlerts,
      avgResponseTime,
      topNeighborhood,
      alertsChange,
      criticalChange,
      resolutionRate: totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0
    };
  }, [filteredAlerts, startDate, endDate]);

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard de Monitoramento
        </h1>
        <p className="text-muted-foreground">
          Análise de alertas de pânico em tempo real
          {startDate && endDate && (
            <span className="ml-2 text-sm">
              • {format(startDate, "dd/MM", { locale: ptBR })} até {format(endDate, "dd/MM", { locale: ptBR })}
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <FiltersPanel
        onDateRangeChange={handleDateRangeChange}
        onNeighborhoodChange={setSelectedNeighborhood}
        onSeverityChange={setSelectedSeverity}
        onStatusChange={setSelectedStatus}
        startDate={startDate}
        endDate={endDate}
        selectedNeighborhood={selectedNeighborhood}
        selectedSeverity={selectedSeverity}
        selectedStatus={selectedStatus}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total de Alertas"
          value={kpiData.totalAlerts}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={kpiData.alertsChange > 0 ? 'up' : kpiData.alertsChange < 0 ? 'down' : 'neutral'}
          trendValue={`${Math.abs(kpiData.alertsChange)}%`}
          variant="default"
        />
        
        <KPICard
          title="Alertas Críticos"
          value={kpiData.criticalAlerts}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={kpiData.criticalChange > 0 ? 'up' : kpiData.criticalChange < 0 ? 'down' : 'neutral'}
          trendValue={`${Math.abs(kpiData.criticalChange)}%`}
          variant="danger"
        />

        <KPICard
          title="Pendentes"
          value={kpiData.pendingAlerts}
          subtitle={`${((kpiData.pendingAlerts / kpiData.totalAlerts) * 100).toFixed(1)}% do total`}
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />

        <KPICard
          title="Taxa Resolução"
          value={`${kpiData.resolutionRate}%`}
          subtitle={`${kpiData.resolvedAlerts} resolvidos`}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="success"
        />

        <KPICard
          title="Tempo Médio"
          value={`${kpiData.avgResponseTime}min`}
          subtitle="Tempo de resposta"
          icon={<Timer className="h-6 w-6" />}
          variant="info"
        />

        <KPICard
          title="Top Bairro"
          value={kpiData.topNeighborhood}
          subtitle="Maior concentração"
          icon={<MapPin className="h-6 w-6" />}
          variant="default"
        />
      </div>

      {/* Heat Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Mapa de Calor - Densidade de Alertas
        </h2>
        <HeatMap alerts={filteredAlerts} />
      </div>

      {/* Alerts Table */}
      <AlertsTable alerts={filteredAlerts} />
    </div>
  );
};

export default Dashboard;