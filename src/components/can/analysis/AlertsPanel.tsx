import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { AlertTriangle, MapPin } from "lucide-react";

interface AlertsPanelProps {
  vehicle: CANVehicleData;
}

export const AlertsPanel = ({ vehicle }: AlertsPanelProps) => {
  const { t } = useTranslation();

  const mockAlerts = [
    { time: "14:23", location: "Bairro Aldeota", type: "panic", severity: "high" },
    { time: "10:45", location: "Bairro Centro", type: "panic", severity: "high" },
    { time: "08:12", location: "Bairro Meireles", type: "panic", severity: "medium" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {t('can.analysis.panicAlerts')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-sm">{alert.time}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {alert.location}
                  </div>
                </div>
              </div>
              <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                {t(`can.analysis.severity.${alert.severity}`)}
              </Badge>
            </div>
          ))}
          {mockAlerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('can.analysis.noAlerts')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
