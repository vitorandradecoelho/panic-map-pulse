import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Progress } from "@/components/ui/progress";

interface TorqueGaugeProps {
  torqueAtual: number;
  torqueSolicitado: number;
}

export const TorqueGauge = ({ torqueAtual, torqueSolicitado }: TorqueGaugeProps) => {
  const { t } = useTranslation();
  const match = Math.abs(torqueAtual - torqueSolicitado) <= 5;
  const difference = Math.abs(torqueAtual - torqueSolicitado);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('can.gauges.torque')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('can.gauges.currentTorque')}</span>
            <span className="font-bold">{torqueAtual}%</span>
          </div>
          <Progress value={torqueAtual} className="h-3" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('can.gauges.requestedTorque')}</span>
            <span className="font-bold">{torqueSolicitado}%</span>
          </div>
          <Progress value={torqueSolicitado} className="h-3" />
        </div>

        <div className={`p-3 rounded-lg text-center ${
          match ? 'bg-success/10 border border-success' : 'bg-warning/10 border border-warning'
        }`}>
          <div className="text-sm font-medium">
            {t('can.gauges.match')}
          </div>
          <div className={`text-2xl font-bold ${match ? 'text-success' : 'text-warning'}`}>
            {match ? '✓' : `±${difference}%`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
