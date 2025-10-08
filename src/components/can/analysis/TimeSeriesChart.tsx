import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CANVehicleData } from "@/data/canMockData";

interface TimeSeriesChartProps {
  title: string;
  dataKey: 'rpm' | 'torqueAtual' | 'tempAguaMotor';
  vehicle: CANVehicleData;
  timeRange: '1h' | '4h' | '8h';
  onTimeRangeChange: (range: '1h' | '4h' | '8h') => void;
  unit: string;
  color: string;
  historicalData?: CANVehicleData[];
}

export const TimeSeriesChart = ({ 
  title, 
  dataKey, 
  vehicle, 
  timeRange, 
  onTimeRangeChange,
  unit,
  color,
  historicalData = []
}: TimeSeriesChartProps) => {
  // Use real historical data if available, otherwise generate mock data
  const generateTimeSeriesData = () => {
    if (historicalData.length > 0) {
      // Usar dados reais da API
      console.log(`📊 Gerando gráfico para ${dataKey}, registros disponíveis:`, historicalData.length);
      
      const processedData = historicalData
        .map(record => {
          const value = record[dataKey];
          // Log para debug
          if (value === undefined || value === null) {
            console.warn(`⚠️ Valor undefined/null para ${dataKey} no registro:`, record);
          }
          
          return {
            time: new Date(record.dataHoraEnvio).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: typeof value === 'number' ? value : 0,
            timestamp: record.dataHoraEnvio
          };
        })
        .reverse(); // Inverter para mostrar do mais antigo ao mais recente
      
      console.log(`✅ Dados processados para ${dataKey}:`, processedData.slice(0, 3));
      return processedData;
    }
    
    // Fallback: gerar dados mock se não houver dados históricos
    const points = timeRange === '1h' ? 12 : timeRange === '4h' ? 24 : 48;
    const interval = timeRange === '1h' ? 5 : timeRange === '4h' ? 10 : 10;
    const baseValue = vehicle[dataKey] || 0;

    return Array.from({ length: points }, (_, i) => {
      const variance = Math.random() * 0.3 - 0.15;
      const minutesAgo = (points - i - 1) * interval;
      
      return {
        time: `${Math.floor(minutesAgo / 60)}h${minutesAgo % 60}m`,
        value: Math.max(0, baseValue * (1 + variance)),
        timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString()
      };
    });
  };

  const data = generateTimeSeriesData();
  const validValues = data.map(d => d.value).filter(v => typeof v === 'number' && !isNaN(v));
  const maxValue = validValues.length > 0 ? Math.max(...validValues) : 0;
  const avgValue = validValues.length > 0 
    ? Math.round(validValues.reduce((sum, v) => sum + v, 0) / validValues.length) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Máximo: {maxValue.toFixed(1)}{unit} | Média: {avgValue.toFixed(1)}{unit}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '1h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('1h')}
            >
              1h
            </Button>
            <Button
              variant={timeRange === '4h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('4h')}
            >
              4h
            </Button>
            <Button
              variant={timeRange === '8h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('8h')}
            >
              8h
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={unit}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
