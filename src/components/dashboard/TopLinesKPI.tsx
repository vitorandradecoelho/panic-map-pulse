import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Route } from "lucide-react";
import { VehicleData } from "@/data/mockData";
import { useTranslation } from "@/hooks/useTranslation";

interface TopLinesKPIProps {
  vehicles: VehicleData[];
}

interface LineStats {
  linha: string;
  count: number;
  percentage: number;
}

export const TopLinesKPI = ({ vehicles }: TopLinesKPIProps) => {
  const { t } = useTranslation();

  const topLines = useMemo(() => {
    // Count events by line (only vehicles with panic events)
    const panicVehicles = vehicles.filter(vehicle => vehicle.panico);
    const lineCounts = new Map<string, number>();
    
    panicVehicles.forEach(vehicle => {
      if (vehicle.linha && vehicle.linha.trim() !== '') {
        const currentCount = lineCounts.get(vehicle.linha) || 0;
        lineCounts.set(vehicle.linha, currentCount + 1);
      }
    });

    // Convert to array and sort by count
    const lineStats: LineStats[] = Array.from(lineCounts.entries())
      .map(([linha, count]) => ({
        linha,
        count,
        percentage: panicVehicles.length > 0 ? (count / panicVehicles.length) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Get top 3

    return lineStats;
  }, [vehicles]);

  const totalPanicEvents = vehicles.filter(v => v.panico).length;

  if (topLines.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Route className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-card-foreground">
              {t('dashboard.topLines.title') || 'Top 3 Linhas com Mais Eventos'}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.topLines.noData') || 'Nenhum evento de pânico encontrado'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Route className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-card-foreground">
              {t('dashboard.topLines.title') || 'Top 3 Linhas com Mais Eventos'}
            </h3>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{totalPanicEvents} eventos</span>
          </Badge>
        </div>

        <div className="space-y-4">
          {topLines.map((lineStats, index) => (
            <div key={lineStats.linha} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-card-foreground">Linha {lineStats.linha}</p>
                  <p className="text-sm text-muted-foreground">
                    {lineStats.count} evento{lineStats.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-card-foreground">{lineStats.percentage.toFixed(1)}%</p>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300"
                    style={{ width: `${lineStats.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            {t('dashboard.topLines.footer') || 'Baseado nos eventos de pânico registrados no período selecionado'}
          </p>
        </div>
      </div>
    </Card>
  );
};