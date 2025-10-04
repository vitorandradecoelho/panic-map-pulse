import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { AlertTriangle, Gauge, Clock, Activity } from "lucide-react";

interface AnalysisKPIsProps {
  vehicle: CANVehicleData;
}

export const AnalysisKPIs = ({ vehicle }: AnalysisKPIsProps) => {
  const { t } = useTranslation();

  const alertsCount = [
    vehicle.checkEngine,
    vehicle.luzPrecaucao,
    vehicle.luzAlerta,
  ].filter(Boolean).length;

  const kmRodados = Math.floor(Math.random() * 200 + 150);
  const tempoAtivo = Math.floor(vehicle.tempoMotorLigado / 60);
  const minutos = vehicle.tempoMotorLigado % 60;

  const getStatusColor = () => {
    if (!vehicle.motorLigado) return "secondary";
    if (vehicle.checkEngine || vehicle.luzAlerta) return "destructive";
    if (vehicle.luzPrecaucao) return "outline";
    return "default";
  };

  const getStatusText = () => {
    if (!vehicle.motorLigado) return t('can.analysis.status.stopped');
    if (vehicle.emMovimento) return t('can.analysis.status.inOperation');
    return t('can.analysis.status.idle');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('can.analysis.alertsToday')}</p>
            <p className="text-2xl font-bold">{alertsCount}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('can.analysis.kmDriven')}</p>
            <p className="text-2xl font-bold">{kmRodados}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-2/10">
            <Clock className="h-5 w-5 text-chart-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('can.analysis.activeTime')}</p>
            <p className="text-2xl font-bold">{tempoAtivo}h {minutos}m</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-3/10">
            <Activity className="h-5 w-5 text-chart-3" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('can.analysis.currentStatus')}</p>
            <Badge variant={getStatusColor()} className="mt-1">
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
