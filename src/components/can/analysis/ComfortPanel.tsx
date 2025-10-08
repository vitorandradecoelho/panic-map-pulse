import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { Thermometer } from "lucide-react";

interface ComfortPanelProps {
  vehicle: CANVehicleData;
}

export const ComfortPanel = ({ vehicle }: ComfortPanelProps) => {
  const { t } = useTranslation();

  const delta = vehicle.tempInterior - vehicle.tempExterior;
  
  const getComfortStatus = () => {
    const temp = vehicle.tempInterior;
    if (temp >= 20 && temp <= 25) return { label: t('can.comfort.ideal'), variant: 'default' as const };
    if (temp > 25 && temp <= 28) return { label: t('can.comfort.acceptable'), variant: 'secondary' as const };
    if (temp > 28) return { label: t('can.comfort.hot'), variant: 'destructive' as const };
    return { label: t('can.comfort.cold'), variant: 'outline' as const };
  };

  const comfort = getComfortStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t('can.comfort.title')}</CardTitle>
          <Badge variant={comfort.variant}>{comfort.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interior Temperature */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Thermometer className="h-5 w-5 text-destructive" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t('can.comfort.interior')}
            </span>
          </div>
          <span className="text-3xl font-bold">{vehicle.tempInterior}°C</span>
        </div>

        {/* Exterior Temperature */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Thermometer className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t('can.comfort.exterior')}
            </span>
          </div>
          <span className="text-3xl font-bold">{vehicle.tempExterior}°C</span>
        </div>

        {/* Delta */}
        <div className="p-4 rounded-lg bg-muted/50 border text-center">
          <p className="text-sm text-muted-foreground mb-1">{t('can.comfort.delta')}</p>
          <p className="text-2xl font-bold">
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}°C
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
