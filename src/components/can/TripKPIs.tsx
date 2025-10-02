import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, Thermometer, Gauge, AlertTriangle } from "lucide-react";

interface TripKPIsProps {
  tempoMotorLigado: number;
  tempoSobreaquecimento: number;
  mediaRPM: number;
  maximaRPM: number;
  eventosTorqueMismatch: number;
  tempoMarchaLenta: number;
  aceleracoesBruscas: number;
  frenagensBruscas: number;
}

export const TripKPIs = ({
  tempoMotorLigado,
  tempoSobreaquecimento,
  mediaRPM,
  maximaRPM,
  eventosTorqueMismatch,
  tempoMarchaLenta,
  aceleracoesBruscas,
  frenagensBruscas
}: TripKPIsProps) => {
  const { t } = useTranslation();
  const eventosAgressivos = aceleracoesBruscas + frenagensBruscas;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-sm">{t('can.trip.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <Clock className="w-5 h-5 mx-auto mb-2 text-info" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.engineTime')}</div>
            <div className="text-lg font-bold">{formatTime(tempoMotorLigado)}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <Thermometer className="w-5 h-5 mx-auto mb-2 text-danger" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.overheating')}</div>
            <div className="text-lg font-bold text-danger">{formatTime(tempoSobreaquecimento)}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <Gauge className="w-5 h-5 mx-auto mb-2 text-success" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.avgRPM')}</div>
            <div className="text-lg font-bold">{mediaRPM}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <Gauge className="w-5 h-5 mx-auto mb-2 text-warning" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.maxRPM')}</div>
            <div className="text-lg font-bold text-warning">{maximaRPM}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-warning" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.torqueMismatch')}</div>
            <div className="text-lg font-bold text-warning">{eventosTorqueMismatch}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.idleTime')}</div>
            <div className="text-lg font-bold">{formatTime(tempoMarchaLenta)}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-danger" />
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.aggressive')}</div>
            <div className="text-lg font-bold text-danger">{eventosAgressivos}</div>
          </div>

          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">{t('can.trip.harshBraking')}</div>
            <div className="text-lg font-bold">{frenagensBruscas}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
