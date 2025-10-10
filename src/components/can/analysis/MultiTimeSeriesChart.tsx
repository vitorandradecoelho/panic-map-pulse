import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CANVehicleData } from "@/data/canMockData";

type Range = '1h' | '4h' | '8h';

export interface SeriesDef {
  key: keyof CANVehicleData;
  name: string;
  color: string; // use semantic tokens e.g. hsl(var(--primary))
  unit?: string;
  yAxis?: 'left' | 'right';
}

interface MultiTimeSeriesChartProps {
  title: string;
  series: SeriesDef[];
  vehicle: CANVehicleData; // usado para fallback
  timeRange: Range;
  onTimeRangeChange: (range: Range) => void;
  historicalData?: CANVehicleData[];
}

export const MultiTimeSeriesChart = ({
  title,
  series,
  vehicle,
  timeRange,
  onTimeRangeChange,
  historicalData = []
}: MultiTimeSeriesChartProps) => {
  const timeRangeMs: Record<Range, number> = {
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
  };

  const buildData = () => {
    if (historicalData.length > 0) {
      // basear o corte no registro mais recente recebido, não no "agora"
      const latestTime = historicalData.reduce((max, r) => {
        const ts = new Date(r.dataHoraEnvio).getTime();
        return ts > max ? ts : max;
      }, 0);
      const cutoff = latestTime - timeRangeMs[timeRange];

      const filtered = historicalData
        .filter(r => new Date(r.dataHoraEnvio).getTime() >= cutoff)
        .map(r => {
          const obj: any = {
            time: new Date(r.dataHoraEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: r.dataHoraEnvio,
          };
          for (const s of series) {
            const v = r[s.key];
            obj[s.key as string] = typeof v === 'number' ? v : 0;
          }
          return obj;
        })
        .reverse();

      return filtered;
    }

    // Fallback: gerar poucos pontos a partir do veículo atual
    const points = timeRange === '1h' ? 12 : timeRange === '4h' ? 24 : 48;
    const interval = timeRange === '1h' ? 5 : 10; // minutos

    return Array.from({ length: points }, (_, i) => {
      const minutesAgo = (points - i - 1) * interval;
      const base: any = {
        time: `${Math.floor(minutesAgo / 60)}h${minutesAgo % 60}m`,
        timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      };
      for (const s of series) {
        const baseVal = (vehicle[s.key] as unknown as number) || 0;
        const variance = Math.random() * 0.3 - 0.15;
        base[s.key as string] = Math.max(0, baseVal * (1 + variance));
      }
      return base;
    });
  };

  const data = buildData();

  // calcular máximo/média baseado na primeira série como referência
  const refKey = series[0]?.key as string;
  const validValues = data.map(d => d[refKey]).filter((v: any) => typeof v === 'number' && !isNaN(v));
  const maxValue = validValues.length ? Math.max(...validValues) : 0;
  const avgValue = validValues.length ? validValues.reduce((a: number, b: number) => a + b, 0) / validValues.length : 0;

  // tooltip formatter com unidade por série
  const unitByKey = Object.fromEntries(series.map(s => [s.key as string, s.unit || '']));
  const nameByKey = Object.fromEntries(series.map(s => [s.key as string, s.name]));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Máximo: {maxValue.toFixed(1)} {series[0]?.unit || ''} | Média: {avgValue.toFixed(1)} {series[0]?.unit || ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={timeRange === '1h' ? 'default' : 'outline'} size="sm" onClick={() => onTimeRangeChange('1h')}>1h</Button>
            <Button variant={timeRange === '4h' ? 'default' : 'outline'} size="sm" onClick={() => onTimeRangeChange('4h')}>4h</Button>
            <Button variant={timeRange === '8h' ? 'default' : 'outline'} size="sm" onClick={() => onTimeRangeChange('8h')}>8h</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis yAxisId="left" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              formatter={(value: any, name: any) => {
                const unit = unitByKey[name] || '';
                return [typeof value === 'number' ? value.toFixed(1) + (unit ? ` ${unit}` : '') : value, nameByKey[name] || name];
              }}
            />
            <Legend />
            {series.map(s => (
              <Line
                key={String(s.key)}
                type="monotone"
                dataKey={String(s.key)}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                name={s.name}
                yAxisId={s.yAxis || 'left'}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
