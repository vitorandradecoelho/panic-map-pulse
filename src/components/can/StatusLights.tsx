import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Activity } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface StatusLightsProps {
  motorLigado: boolean;
  checkEngine: boolean;
  luzPrecaucao: boolean;
  luzAlerta: boolean;
}

export const StatusLights = ({ 
  motorLigado, 
  checkEngine, 
  luzPrecaucao, 
  luzAlerta 
}: StatusLightsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className={cn(
        "p-4 flex flex-col items-center gap-2 transition-all",
        motorLigado ? "bg-success/10 border-success" : "bg-muted/50"
      )}>
        <Activity className={cn(
          "w-8 h-8",
          motorLigado ? "text-success animate-pulse" : "text-muted-foreground"
        )} />
        <span className="text-sm font-medium text-center">
          {t('can.status.engineOn')}
        </span>
        <span className={cn(
          "text-xs font-bold uppercase",
          motorLigado ? "text-success" : "text-muted-foreground"
        )}>
          {motorLigado ? t('can.status.on') : t('can.status.off')}
        </span>
      </Card>

      <Card className={cn(
        "p-4 flex flex-col items-center gap-2 transition-all",
        checkEngine && "bg-danger/10 border-danger animate-pulse"
      )}>
        <XCircle className={cn(
          "w-8 h-8",
          checkEngine ? "text-danger" : "text-muted-foreground"
        )} />
        <span className="text-sm font-medium text-center">
          {t('can.status.checkEngine')}
        </span>
        <span className={cn(
          "text-xs font-bold uppercase",
          checkEngine ? "text-danger" : "text-success"
        )}>
          {checkEngine ? t('can.status.active') : "OK"}
        </span>
      </Card>

      <Card className={cn(
        "p-4 flex flex-col items-center gap-2 transition-all",
        luzPrecaucao && "bg-warning/10 border-warning animate-pulse"
      )}>
        <AlertTriangle className={cn(
          "w-8 h-8",
          luzPrecaucao ? "text-warning" : "text-muted-foreground"
        )} />
        <span className="text-sm font-medium text-center">
          {t('can.status.caution')}
        </span>
        <span className={cn(
          "text-xs font-bold uppercase",
          luzPrecaucao ? "text-warning" : "text-success"
        )}>
          {luzPrecaucao ? t('can.status.active') : "OK"}
        </span>
      </Card>

      <Card className={cn(
        "p-4 flex flex-col items-center gap-2 transition-all",
        luzAlerta && "bg-danger/10 border-danger animate-pulse"
      )}>
        <AlertTriangle className={cn(
          "w-8 h-8",
          luzAlerta ? "text-danger" : "text-muted-foreground"
        )} />
        <span className="text-sm font-medium text-center">
          {t('can.status.alert')}
        </span>
        <span className={cn(
          "text-xs font-bold uppercase",
          luzAlerta ? "text-danger" : "text-success"
        )}>
          {luzAlerta ? t('can.status.active') : "OK"}
        </span>
      </Card>
    </div>
  );
};
