import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { Battery, Zap, TrendingUp, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EnergyConsumptionPanelProps {
  vehicle: CANVehicleData;
}

export const EnergyConsumptionPanel = ({ vehicle }: EnergyConsumptionPanelProps) => {
  const { t } = useTranslation();
  
  // Calcular consumo instantâneo de energia (kWh/km)
  const calculateEnergyRate = (rpm: number, torque: number, speed: number): number => {
    // Veículo parado
    if (speed === 0 && rpm > 0) {
      return 0.3; // Consumo mínimo em standby (kWh)
    }
    
    // Veículo desligado
    if (rpm === 0) {
      return 0;
    }
    
    // Cálculo baseado em torque e velocidade
    // Fator de conversão aproximado para veículos elétricos
    const basePower = (rpm * torque) / 9550; // Potência em kW
    const efficiency = 0.85; // Eficiência típica de motor elétrico
    
    if (speed > 0) {
      return (basePower / efficiency) / speed; // kWh/km
    }
    
    return basePower / efficiency; // kWh quando parado mas ligado
  };
  
  const energyRate = calculateEnergyRate(vehicle.rpm, vehicle.torqueAtual, vehicle.velocidade);
  
  // Valores com fallback para propriedades que podem não existir
  const consumoEnergia = vehicle.consumoEnergia ?? energyRate;
  const eficienciaAtual = vehicle.eficienciaAtual ?? (consumoEnergia > 0 ? (1 / consumoEnergia) : 0);
  const nivelBateria = vehicle.nivelBateria ?? vehicle.soc ?? 85;
  const autonomia = vehicle.autonomia ?? Math.round(nivelBateria * 2.5);
  
  // Determinar modo de operação
  const getOperationMode = (): { mode: string; variant: "default" | "outline" | "secondary" } => {
    if (vehicle.velocidade === 0 && vehicle.rpm === 0) {
      return { mode: t('can.energy.off'), variant: 'secondary' };
    }
    if (vehicle.velocidade === 0 && vehicle.rpm > 0) {
      return { mode: t('can.energy.standby'), variant: 'outline' };
    }
    if (vehicle.rpm > 1800 && vehicle.torqueAtual > 60) {
      return { mode: t('can.energy.highPower'), variant: 'default' };
    }
    return { mode: t('can.energy.efficient'), variant: 'outline' };
  };
  
  const operationMode = getOperationMode();
  
  // Calcular eficiência do sistema
  const systemEfficiency = vehicle.torqueSolicitado > 0 
    ? Math.min(100, (vehicle.torqueAtual / vehicle.torqueSolicitado) * 100) 
    : 100;
  
  // Dados para gráfico Consumo vs Velocidade
  const generateSpeedData = () => {
    const data = [];
    for (let speed = 0; speed <= 80; speed += 10) {
      const consumption = speed === 0 ? 0.3 : 0.8 + (speed / 100) * 0.5;
      data.push({
        speed,
        consumption: consumption
      });
    }
    return data;
  };
  
  // Dados para gráfico Consumo vs Torque
  const generateTorqueData = () => {
    const data = [];
    for (let torque = 0; torque <= 100; torque += 10) {
      const consumption = 0.5 + (torque / 100) * 1.5;
      data.push({
        torque,
        consumption: consumption
      });
    }
    return data;
  };
  
  const speedData = generateSpeedData();
  const torqueData = generateTorqueData();
  
  return (
    <div className="space-y-6">
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              {t('can.energy.instantaneous')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {consumoEnergia.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ml-1">kWh/km</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-chart-2" />
              {t('can.energy.operationMode')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={operationMode.variant} className="text-sm">
              {operationMode.mode}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-3" />
              {t('can.energy.efficiency')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {eficienciaAtual.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-1">km/kWh</span>
              </div>
              <Progress value={systemEfficiency} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Battery className="h-4 w-4 text-chart-4" />
              {t('can.energy.batteryLevel')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-chart-4">
                {nivelBateria.toFixed(0)}%
              </div>
              <Progress value={nivelBateria} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {t('can.energy.range')}: {autonomia} km
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('can.energy.consumptionVsSpeed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="speed" 
                  label={{ value: t('can.energy.speedLabel'), position: 'insideBottom', offset: -5 }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: 'kWh/km', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} kWh/km`, t('can.energy.consumption')]}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('can.energy.consumptionVsTorque')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={torqueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="torque" 
                  label={{ value: t('can.energy.torquePercent'), position: 'insideBottom', offset: -5 }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: 'kWh/km', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} kWh/km`, t('can.energy.consumption')]}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};