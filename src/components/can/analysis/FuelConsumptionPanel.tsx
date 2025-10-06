import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { Gauge, Droplet, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FuelConsumptionPanelProps {
  vehicle: CANVehicleData;
}

export const FuelConsumptionPanel = ({ vehicle }: FuelConsumptionPanelProps) => {
  const { t } = useTranslation();
  
  // Constante de calibração k = 0.0125
  // FuelRate(800 RPM, 15%) ≈ 1.5 L/h
  // FuelRate(2500 RPM, 80%) ≈ 25 L/h
  const k = 0.0125;
  
  // Calcular consumo instantâneo (L/h)
  const calculateFuelRate = (rpm: number, torque: number): number => {
    // Marcha lenta: velocidade = 0 e RPM > 600
    if (vehicle.velocidade === 0 && rpm > 600 && rpm < 1000) {
      return 1.5; // Consumo fixo em marcha lenta
    }
    
    // Cálculo proporcional
    if (rpm > 1000 && torque > 40) {
      return k * (rpm * torque) / 100;
    }
    
    // Baixo consumo
    return k * (rpm * torque) / 100;
  };
  
  const fuelRate = calculateFuelRate(vehicle.rpm, vehicle.torqueAtual);
  
  // Determinar modo de operação
  const getOperationMode = (): { mode: string; variant: "default" | "outline" | "secondary" } => {
    if (vehicle.velocidade === 0 && vehicle.rpm < 1000) {
      return { mode: t('can.fuel.idle'), variant: 'secondary' };
    }
    if (vehicle.rpm > 1800 && vehicle.torqueAtual > 60) {
      return { mode: t('can.fuel.highLoad'), variant: 'default' };
    }
    return { mode: t('can.fuel.cruise'), variant: 'outline' };
  };
  
  const operationMode = getOperationMode();
  
  // Calcular eficiência
  const efficiency = vehicle.torqueSolicitado > 0 
    ? Math.min(100, (vehicle.torqueAtual / vehicle.torqueSolicitado) * 100) 
    : 100;
  
  // Dados para gráfico Consumo vs RPM
  const generateRPMData = () => {
    const data = [];
    for (let rpm = 600; rpm <= 3000; rpm += 200) {
      data.push({
        rpm,
        consumption: calculateFuelRate(rpm, vehicle.torqueAtual)
      });
    }
    return data;
  };
  
  // Dados para gráfico Consumo vs Torque
  const generateTorqueData = () => {
    const data = [];
    for (let torque = 0; torque <= 100; torque += 10) {
      data.push({
        torque,
        consumption: calculateFuelRate(vehicle.rpm, torque)
      });
    }
    return data;
  };
  
  const rpmData = generateRPMData();
  const torqueData = generateTorqueData();
  
  return (
    <div className="space-y-6">
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="h-4 w-4 text-primary" />
              {t('can.fuel.instantaneous')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {fuelRate.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">L/h</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-chart-2" />
              {t('can.fuel.operationMode')}
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
              <Zap className="h-4 w-4 text-chart-3" />
              {t('can.fuel.efficiency')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {efficiency.toFixed(0)}%
              </div>
              <Progress value={efficiency} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-4" />
              {t('can.fuel.accumulated')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">
              {(fuelRate * 8).toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">L</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('can.fuel.last8h')}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('can.fuel.consumptionVsRPM')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={rpmData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="rpm" 
                  label={{ value: 'RPM', position: 'insideBottom', offset: -5 }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: 'L/h', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} L/h`, t('can.fuel.consumption')]}
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
            <CardTitle className="text-base">{t('can.fuel.consumptionVsTorque')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={torqueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="torque" 
                  label={{ value: t('can.fuel.torquePercent'), position: 'insideBottom', offset: -5 }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: 'L/h', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} L/h`, t('can.fuel.consumption')]}
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
