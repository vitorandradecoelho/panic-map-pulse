import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComfortIndicatorProps {
  temperaturaInterior: number;
  temperaturaExterior: number;
}

export const ComfortIndicator = ({ temperaturaInterior, temperaturaExterior }: ComfortIndicatorProps) => {
  const { t } = useTranslation();
  const delta = temperaturaInterior - temperaturaExterior;
  
  const getComfortStatus = () => {
    if (temperaturaInterior >= 20 && temperaturaInterior <= 25) {
      return { label: t('can.comfort.ideal'), color: 'success' };
    }
    if (temperaturaInterior > 30) {
      return { label: t('can.comfort.hot'), color: 'destructive' };
    }
    if (temperaturaInterior < 18) {
      return { label: t('can.comfort.cold'), color: 'info' };
    }
    return { label: t('can.comfort.acceptable'), color: 'warning' };
  };

  const comfort = getComfortStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{t('can.comfort.title')}</CardTitle>
          <Badge variant={comfort.color as any}>{comfort.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-danger" />
            <span className="text-sm text-muted-foreground">{t('can.comfort.interior')}</span>
          </div>
          <span className="text-2xl font-bold">{temperaturaInterior}°C</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-info" />
            <span className="text-sm text-muted-foreground">{t('can.comfort.exterior')}</span>
          </div>
          <span className="text-2xl font-bold">{temperaturaExterior}°C</span>
        </div>

        <div className="text-center p-4 bg-accent rounded-lg">
          <div className="text-xs text-muted-foreground">{t('can.comfort.delta')}</div>
          <div className="text-xl font-bold">{delta > 0 ? '+' : ''}{delta.toFixed(1)}°C</div>
        </div>
      </CardContent>
    </Card>
  );
};
