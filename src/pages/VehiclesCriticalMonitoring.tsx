import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/hooks/useTranslation";
import { mockCANVehicles, CANVehicleData } from "@/data/canMockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Eye, Edit, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const VehiclesCriticalMonitoring = () => {
  const { t } = useTranslation();
  
  const [periodFilter, setPeriodFilter] = useState("7days");
  const [lineFilter, setLineFilter] = useState("all");
  const [criticalityFilter, setCriticalityFilter] = useState("all");

  // Calculate critical vehicles and their alert counts
  const criticalVehiclesData = useMemo(() => {
    return mockCANVehicles.map(vehicle => {
      let alertCount = 0;
      let criticality: "high" | "medium" | "low" = "low";
      
      const torqueDiff = Math.abs(vehicle.torqueAtual - vehicle.torqueSolicitado);
      const isIdle = vehicle.rpm > 0 && vehicle.rpm < 900 && vehicle.velocidade === 0;
      
      if (vehicle.tempAguaMotor > 100) alertCount += 2;
      if (vehicle.tempOleoMotor > 105) alertCount += 2;
      if (vehicle.tempInterior > 32) alertCount += 1;
      if (torqueDiff > 15) alertCount += 1;
      if (isIdle && vehicle.horas > 5) alertCount += 1; // Marcha lenta prolongada
      if (vehicle.nivelCombustible < 20) alertCount += 2;
      if (vehicle.presionAceite < 150 && vehicle.rpm > 1000) alertCount += 3;
      
      if (alertCount >= 6) criticality = "high";
      else if (alertCount >= 3) criticality = "medium";
      
      return {
        ...vehicle,
        alertCount,
        criticality,
        lastAlert: "Hoje, 14:30"
      };
    }).filter(v => v.alertCount > 0)
      .sort((a, b) => b.alertCount - a.alertCount);
  }, []);

  // Apply filters
  const filteredVehicles = useMemo(() => {
    return criticalVehiclesData.filter(vehicle => {
      if (lineFilter !== "all" && vehicle.linha !== lineFilter) return false;
      if (criticalityFilter !== "all" && vehicle.criticality !== criticalityFilter) return false;
      return true;
    });
  }, [criticalVehiclesData, lineFilter, criticalityFilter]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalAlerts = criticalVehiclesData.reduce((sum, v) => sum + v.alertCount, 0);
    const avgResponseTime = 4.2;
    const reincidenceRate = 18;
    
    return {
      criticalVehicles: filteredVehicles.length,
      totalAlerts,
      avgResponseTime,
      reincidenceRate
    };
  }, [filteredVehicles, criticalVehiclesData]);

  const uniqueLines = Array.from(new Set(mockCANVehicles.map(v => v.linha)));

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case "high":
        return <Badge variant="destructive">{t('critical.monitoring.criticality.high')}</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">{t('critical.monitoring.criticality.medium')}</Badge>;
      default:
        return <Badge variant="secondary">{t('critical.monitoring.criticality.low')}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title={t('critical.monitoring.title')} />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t('critical.monitoring.title')}</h1>
          <p className="text-muted-foreground">{t('critical.monitoring.subtitle')}</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('critical.monitoring.filters.period')}</label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">{t('critical.monitoring.period.7days')}</SelectItem>
                    <SelectItem value="15days">{t('critical.monitoring.period.15days')}</SelectItem>
                    <SelectItem value="30days">{t('critical.monitoring.period.30days')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('critical.monitoring.filters.line')}</label>
                <Select value={lineFilter} onValueChange={setLineFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('critical.monitoring.filters.allLines')}</SelectItem>
                    {uniqueLines.map(line => (
                      <SelectItem key={line} value={line}>{t('can.critical.line')} {line}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('critical.monitoring.filters.criticality')}</label>
                <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('critical.monitoring.filters.all')}</SelectItem>
                    <SelectItem value="high">{t('critical.monitoring.criticality.high')}</SelectItem>
                    <SelectItem value="medium">{t('critical.monitoring.criticality.medium')}</SelectItem>
                    <SelectItem value="low">{t('critical.monitoring.criticality.low')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('critical.monitoring.filters.apply')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('critical.monitoring.kpi.criticalVehicles')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.criticalVehicles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-danger">+12%</span> {t('critical.monitoring.kpi.vsPrevious')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('critical.monitoring.kpi.totalAlerts')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('critical.monitoring.period.7days')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('critical.monitoring.kpi.avgResponse')}</CardTitle>
              <TrendingDown className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.avgResponseTime}min</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">-15%</span> {t('critical.monitoring.kpi.improvement')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('critical.monitoring.kpi.reincidence')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.reincidenceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{t('critical.monitoring.kpi.sameVehicle')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Vehicles Ranking Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('critical.monitoring.ranking.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('critical.monitoring.table.prefix')}</TableHead>
                  <TableHead>{t('critical.monitoring.table.line')}</TableHead>
                  <TableHead>{t('critical.monitoring.table.driver')}</TableHead>
                  <TableHead>{t('critical.monitoring.table.alerts')}</TableHead>
                  <TableHead>{t('critical.monitoring.table.lastAlert')}</TableHead>
                  <TableHead>{t('critical.monitoring.table.criticality')}</TableHead>
                  <TableHead className="text-right">{t('critical.monitoring.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.serial}>
                    <TableCell className="font-medium">{vehicle.prefixoVeiculo}</TableCell>
                    <TableCell>{t('can.critical.line')} {vehicle.linha}</TableCell>
                    <TableCell>{vehicle.motorista}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.alertCount} {t('critical.monitoring.table.alertsCount')}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{vehicle.lastAlert}</TableCell>
                    <TableCell>{getCriticalityBadge(vehicle.criticality)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('critical.monitoring.noData')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VehiclesCriticalMonitoring;
