import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CANVehicleData } from "@/data/canMockData";

interface TimeSeriesChartProps {
  title: string;
  dataKey: 'rpm' | 'torque' | 'temperature';
  vehicle: CANVehicleData;
  timeRange: '1h' | '4h' | '8h';
  onTimeRangeChange: (range: '1h' | '4h' | '8h') => void;
  unit: string;
  color: string;
}

export const TimeSeriesChart = ({
  title,
  dataKey,
  vehicle,
  timeRange,
  onTimeRangeChange,
  unit,
  color,
}: TimeSeriesChartProps) => {
  const generateMockData = () => {
    const points = timeRange === '1h' ? 12 : timeRange === '4h' ? 24 : 48;
    const interval = timeRange === '1h' ? 5 : timeRange === '4h' ? 10 : 10;
    
    const baseValue = dataKey === 'rpm' 
      ? vehicle.rpm 
      : dataKey === 'torque' 
      ? vehicle.torqueAtual 
      : vehicle.temperaturaAgua;

    return Array.from({ length: points }, (_, i) => {
      const variance = Math.random() * 0.3 - 0.15;
      const value = Math.max(0, baseValue * (1 + variance));
      
      const now = new Date();
      now.setMinutes(now.getMinutes() - (points - i) * interval);
      
      return {
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        value: Math.round(value),
      };
    });
  };

  const data = generateMockData();
  const maxValue = Math.max(...data.map(d => d.value));
  const avgValue = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Máximo: {maxValue}{unit} | Média: {avgValue}{unit}
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
