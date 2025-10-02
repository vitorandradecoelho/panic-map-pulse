import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface TemperatureChartProps {
  temperaturaAgua: number;
  temperaturaOleo: number;
}

export const TemperatureChart = ({ temperaturaAgua, temperaturaOleo }: TemperatureChartProps) => {
  const { t } = useTranslation();
  const delta = temperaturaOleo - temperaturaAgua;
  
  const getStatus = () => {
    if (temperaturaAgua > 110 || temperaturaOleo > 110) return { label: t('can.temperature.critical'), color: 'destructive' };
    if (temperaturaAgua > 90 || temperaturaOleo > 90) return { label: t('can.temperature.attention'), color: 'warning' };
    return { label: t('can.temperature.normal'), color: 'success' };
  };

  const status = getStatus();

  // Mock historical data for demonstration
  const data = Array.from({ length: 10 }, (_, i) => ({
    time: `${i * 2}min`,
    agua: temperaturaAgua - (10 - i) * 2 + Math.random() * 5,
    oleo: temperaturaOleo - (10 - i) * 2 + Math.random() * 5,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{t('can.temperature.title')}</CardTitle>
          <Badge variant={status.color as any}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-info/10 rounded-lg border border-info/20">
            <div className="text-xs text-muted-foreground">{t('can.temperature.water')}</div>
            <div className="text-2xl font-bold text-info">{temperaturaAgua}°C</div>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="text-xs text-muted-foreground">{t('can.temperature.oil')}</div>
            <div className="text-2xl font-bold text-warning">{temperaturaOleo}°C</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xs text-muted-foreground">{t('can.temperature.delta')}</div>
            <div className="text-2xl font-bold">{delta.toFixed(1)}°C</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="agua" 
              stroke="hsl(var(--info))" 
              strokeWidth={2}
              name={t('can.temperature.water')}
            />
            <Line 
              type="monotone" 
              dataKey="oleo" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              name={t('can.temperature.oil')}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
