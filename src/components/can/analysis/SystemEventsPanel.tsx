import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { CANVehicleData } from "@/data/canMockData";
import { Calendar, Wrench, Fuel, PlayCircle } from "lucide-react";

interface SystemEventsPanelProps {
  vehicle: CANVehicleData;
}

export const SystemEventsPanel = ({ vehicle }: SystemEventsPanelProps) => {
  const { t } = useTranslation();

  const mockEvents = [
    { time: "06:00", type: "operation_start", icon: PlayCircle, description: "Início de Operação", status: "success" },
    { time: "12:36", type: "maintenance", icon: Wrench, description: "Manutenção Preventiva", status: "info" },
    { time: "15:45", type: "refuel", icon: Fuel, description: "Abastecimento", status: "success" },
  ];

  const getIcon = (IconComponent: any) => {
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {t('can.analysis.systemEvents')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  event.status === 'success' ? 'bg-success/10' : 'bg-primary/10'
                }`}>
                  {getIcon(event.icon)}
                </div>
                <div>
                  <p className="font-medium text-sm">{event.time}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
              <Badge variant={event.status === 'success' ? 'default' : 'secondary'}>
                {t(`can.analysis.eventType.${event.type}`)}
              </Badge>
            </div>
          ))}
          {mockEvents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('can.analysis.noEvents')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
