import { useState, useMemo } from "react";
import { mockVehicleData, VehicleData, getVehiclesInDateRange } from "@/data/mockData";
import { KPICard } from "@/components/dashboard/KPICard";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { AlertTriangle, Clock, MapPin, Users, Shield, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const AlertsMonitoring = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLine, setSelectedLine] = useState<string>("todas");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("todos");
  const [selectedDriver, setSelectedDriver] = useState<string>("todos");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("todos");
  const [selectedShift, setSelectedShift] = useState<string>("todos");

  // Get alerts data (vehicles with panic flag)
  const alertsData = useMemo(() => {
    return mockVehicleData.filter(vehicle => vehicle.panico);
  }, []);

  // Filter alerts based on filters
  const filteredAlerts = useMemo(() => {
    let filtered = alertsData;

    if (startDate || endDate) {
      const start = startDate || new Date('2000-01-01');
      const end = endDate || new Date('2030-12-31');
      filtered = getVehiclesInDateRange(start, end).filter(v => v.panico);
    }

    if (selectedLine !== "todas") {
      filtered = filtered.filter(alert => alert.linha === selectedLine);
    }

    return filtered;
  }, [alertsData, startDate, endDate, selectedLine]);

  // Calculate KPIs
  const kpiData = useMemo(() => {
    const today = new Date();
    const todayAlerts = filteredAlerts.filter(alert => {
      const alertDate = new Date(alert.dataTransmissaoS.split(' ')[0].split('/').reverse().join('-'));
      return alertDate.toDateString() === today.toDateString();
    });

    // Get critical districts (areas with most alerts)
    const districtCounts = new Map<string, number>();
    filteredAlerts.forEach(alert => {
      const coords = `${alert.gps.coordinates[1].toFixed(3)},${alert.gps.coordinates[0].toFixed(3)}`;
      districtCounts.set(coords, (districtCounts.get(coords) || 0) + 1);
    });
    const criticalDistricts = Array.from(districtCounts.entries())
      .filter(([_, count]) => count > 50)
      .length;

    return {
      totalAlerts: filteredAlerts.length,
      todayAlerts: todayAlerts.length,
      criticalDistricts,
      avgResponseTime: "4.2" // Mock data
    };
  }, [filteredAlerts]);

  // Get rankings
  const lineRanking = useMemo(() => {
    const lineCounts = new Map<string, number>();
    filteredAlerts.forEach(alert => {
      if (alert.linha) {
        lineCounts.set(alert.linha, (lineCounts.get(alert.linha) || 0) + 1);
      }
    });
    
    return Array.from(lineCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([linha, count], index) => ({
        position: index + 1,
        name: linha,
        alerts: count
      }));
  }, [filteredAlerts]);

  const districtRanking = useMemo(() => {
    const districts = [
      { name: "Centro", alerts: 156 },
      { name: "Barra do Ceará", alerts: 134 },
      { name: "Messejana", alerts: 98 },
      { name: "Parangaba", alerts: 87 }
    ];
    
    return districts.map((district, index) => ({
      position: index + 1,
      ...district
    }));
  }, []);

  // Mock drivers data
  const driversData = [
    { name: "João Silva", vehicle: "A-2047", line: "027", totalAlerts: 12, lastAlert: "14/01/2025 16:45", status: "Alto Risco" },
    { name: "Maria Santos", vehicle: "B-1523", line: "051", totalAlerts: 7, lastAlert: "13/01/2025 09:30", status: "Atenção" },
    { name: "Pedro Oliveira", vehicle: "C-0892", line: "075", totalAlerts: 3, lastAlert: "10/01/2025 14:20", status: "Normal" }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Alto Risco": return "destructive";
      case "Atenção": return "secondary";
      default: return "default";
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedLine("todas");
    setSelectedDistrict("todos");
    setSelectedDriver("todos");
    setSelectedVehicle("todos");
    setSelectedShift("todos");
  };

  const dateRangeText = startDate && endDate 
    ? `${format(startDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    : startDate 
    ? `A partir de ${format(startDate, "dd/MM/yyyy", { locale: ptBR })}`
    : endDate
    ? `Até ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`
    : "Últimos 30 dias";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema de Monitoramento - Alertas de Pânico</h1>
              <p className="text-sm text-muted-foreground">Última atualização: 15/01/2025 14:30</p>
            </div>
          </div>
        </div>

        {/* Interactive Filters */}
        <Card className="border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Filtros Interativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRangeText}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: startDate || undefined,
                        to: endDate || undefined,
                      }}
                      onSelect={(range) => {
                        setStartDate(range?.from || null);
                        setEndDate(range?.to || null);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bairro</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="centro">Centro</SelectItem>
                    <SelectItem value="messejana">Messejana</SelectItem>
                    <SelectItem value="parangaba">Parangaba</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Linha</label>
                <Select value={selectedLine} onValueChange={setSelectedLine}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="810">810</SelectItem>
                    <SelectItem value="120">120</SelectItem>
                    <SelectItem value="73">73</SelectItem>
                    <SelectItem value="841">841</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Motorista</label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Veículo</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prefixo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="30557">30557</SelectItem>
                    <SelectItem value="35309">35309</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Turno</label>
                <Select value={selectedShift} onValueChange={setSelectedShift}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="manha">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={clearFilters} className="text-sm">
                Limpar Filtros
              </Button>
              <Button className="text-sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Total de Alertas"
            value={kpiData.totalAlerts.toLocaleString()}
            trend="up"
            trendValue="+12%"
            subtitle="vs. mês anterior"
            icon={<AlertTriangle className="h-6 w-6" />}
            variant="info"
          />
          <KPICard
            title="Alertas Hoje"
            value={kpiData.todayAlerts}
            trend="down"
            trendValue="-8%"
            subtitle="vs. ontem"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <KPICard
            title="Bairros Críticos"
            value={kpiData.criticalDistricts}
            subtitle="Com >50 alertas"
            icon={<MapPin className="h-6 w-6" />}
            variant="danger"
          />
          <KPICard
            title="Tempo Médio Resposta"
            value={`${kpiData.avgResponseTime}min`}
            trend="down"
            trendValue="-0.5min"
            subtitle="vs. média"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Rankings and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Lines Ranking */}
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="mr-2 h-5 w-5 text-danger" />
                Ranking - Linhas Críticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lineRanking.map((line) => (
                <div key={line.position} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {line.position}
                    </div>
                    <div>
                      <p className="font-medium">{line.name} - Centro/Aldeota</p>
                      <p className="text-sm text-muted-foreground">{line.alerts} alertas</p>
                    </div>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Critical Districts Ranking */}
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-2 h-5 w-5 text-warning" />
                Ranking - Bairros Críticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {districtRanking.map((district) => (
                <div key={district.position} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {district.position}
                    </div>
                    <div>
                      <p className="font-medium">{district.name}</p>
                      <p className="text-sm text-muted-foreground">{district.alerts} alertas</p>
                    </div>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Predictive Analysis */}
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-info" />
                Análise Preditiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-danger/10 p-4 border border-danger/20">
                <h4 className="font-medium text-danger mb-2">Alto Risco Previsto</h4>
                <p className="text-sm text-foreground">Hoje 18:00-20:00</p>
                <p className="text-sm text-muted-foreground">Centro/Aldeota</p>
              </div>
              
              <div className="rounded-lg bg-warning/10 p-4 border border-warning/20">
                <h4 className="font-medium text-warning mb-2">Risco Moderado</h4>
                <p className="text-sm text-foreground">Amanhã 07:00-09:00</p>
                <p className="text-sm text-muted-foreground">Parangaba/Centro</p>
              </div>

              <div className="pt-2">
                <h4 className="font-medium mb-2">Padrões Identificados:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Picos às 18h-19h (rush vespertino)</li>
                  <li>• Sextas-feiras +40% alertas</li>
                  <li>• Linhas Centro: maior reincidência</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heat Map */}
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Mapa de Alertas - Fortaleza
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Clusters</Button>
                  <Button variant="default" size="sm">Heatmap</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <HeatMap vehicles={filteredAlerts} />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Mapa Interativo de Fortaleza<br />
                Pontos de alerta clusterizados por intensidade
              </div>
              <div className="flex justify-center space-x-4 mt-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <span>Alto risco (&gt;20)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span>Médio risco (5-20)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span>Baixo risco (&lt;5)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temporal Evolution Chart */}
          <Card className="border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Evolução Temporal dos Alertas
                </div>
                <div className="flex space-x-2">
                  <Button variant="default" size="sm">Dia</Button>
                  <Button variant="outline" size="sm">Semana</Button>
                  <Button variant="outline" size="sm">Mês</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico de Linha Temporal</p>
                  <p className="text-sm">Evolução dos alertas por período</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers and Vehicles Panel */}
        <Card className="border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" />
                Painel Motoristas & Veículos
              </CardTitle>
              <Button variant="outline" size="sm">
                Exportar Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Motorista</th>
                    <th className="text-left py-3 px-4 font-medium">Veículo</th>
                    <th className="text-left py-3 px-4 font-medium">Linha</th>
                    <th className="text-left py-3 px-4 font-medium">Total Alertas</th>
                    <th className="text-left py-3 px-4 font-medium">Último Alerta</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {driversData.map((driver, index) => (
                    <tr key={index} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{driver.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{driver.vehicle}</td>
                      <td className="py-3 px-4">{driver.line}</td>
                      <td className="py-3 px-4">{driver.totalAlerts}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{driver.lastAlert}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(driver.status)}>
                          {driver.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsMonitoring;