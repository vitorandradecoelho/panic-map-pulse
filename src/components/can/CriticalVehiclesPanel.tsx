import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Thermometer, XCircle } from "lucide-react";
import { CANVehicleData } from "@/data/canMockData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CriticalVehiclesPanelProps {
  vehicles: CANVehicleData[];
}

export const CriticalVehiclesPanel = ({ vehicles }: CriticalVehiclesPanelProps) => {
  const { t } = useTranslation();

  const criticalVehicles = vehicles.filter(v => 
    v.tempAguaMotor > 100 || 
    v.tempOleoMotor > 105 ||
    v.tempInterior > 32 ||
    Math.abs(v.torqueAtual - v.torqueSolicitado) > 15
  );

  const getIssues = (vehicle: CANVehicleData) => {
    const issues = [];
    const torqueDiff = Math.abs(vehicle.torqueAtual - vehicle.torqueSolicitado);
    
    if (vehicle.tempAguaMotor > 100) issues.push({ icon: Thermometer, label: `${t('can.temperature.water')} ${vehicle.tempAguaMotor}°C`, color: 'text-danger' });
    if (vehicle.tempOleoMotor > 105) issues.push({ icon: Thermometer, label: `${t('can.temperature.oil')} ${vehicle.tempOleoMotor}°C`, color: 'text-danger' });
    if (vehicle.tempInterior > 32) issues.push({ icon: Thermometer, label: `${t('can.comfort.interior')} ${vehicle.tempInterior}°C`, color: 'text-warning' });
    if (torqueDiff > 15) issues.push({ icon: AlertTriangle, label: `Torque Mismatch: ${torqueDiff}%`, color: 'text-warning' });
    if (vehicle.nivelBateria < 20) issues.push({ icon: AlertTriangle, label: `${t('can.energy.batteryLevel')}: ${vehicle.nivelBateria}%`, color: 'text-warning' });
    
    return issues;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{t('can.critical.title')}</CardTitle>
          <Badge variant="destructive">{criticalVehicles.length} {t('can.critical.vehicles')}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {criticalVehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('can.critical.noIssues')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {criticalVehicles.map(vehicle => {
                const issues = getIssues(vehicle);
                return (
                  <div key={vehicle.serial} className="p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{vehicle.serial}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.linha && `${t('can.critical.line')} ${vehicle.linha}`}
                          {vehicle.motorista && ` - ${vehicle.motorista}`}
                        </p>
                      </div>
                      <Badge variant="destructive">{issues.length} {t('can.critical.issues')}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {issues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <issue.icon className={`w-4 h-4 ${issue.color}`} />
                          <span className={issue.color}>{issue.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
