import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface RPMGaugeProps {
  rpm: number;
  maxRpm?: number;
}

export const RPMGauge = ({ rpm, maxRpm = 4000 }: RPMGaugeProps) => {
  const { t } = useTranslation();
  const percentage = Math.min((rpm / maxRpm) * 100, 100);
  
  const getColor = () => {
    if (rpm < 1000) return "text-muted-foreground";
    if (rpm < 2500) return "text-success";
    if (rpm < 3500) return "text-warning";
    return "text-danger";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('can.gauges.rpm')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-32">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={`hsl(var(--${rpm < 2500 ? 'success' : rpm < 3500 ? 'warning' : 'danger'}))`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.51} 251`}
              className="transition-all duration-500"
            />
            {/* Center text */}
            <text
              x="100"
              y="80"
              textAnchor="middle"
              className={cn("text-3xl font-bold", getColor())}
              fill="currentColor"
            >
              {rpm}
            </text>
            <text
              x="100"
              y="100"
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              RPM
            </text>
          </svg>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>2000</span>
          <span>{maxRpm}</span>
        </div>
      </CardContent>
    </Card>
  );
};
